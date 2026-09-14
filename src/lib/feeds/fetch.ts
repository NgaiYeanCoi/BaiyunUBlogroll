export type FetchOptions = { fetch?: typeof fetch; timeoutMs?: number; maxBytes?: number };
class FetchFailure extends Error {
  constructor(
    message: string,
    readonly retryable = false,
  ) {
    super(message);
  }
}
export async function fetchFeed(url: string, options: FetchOptions = {}): Promise<string> {
  const fetcher = options.fetch ?? fetch;
  const maxBytes = options.maxBytes ?? 5 * 1024 * 1024;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const aborted = new Promise<never>((_resolve, reject) =>
      controller.signal.addEventListener('abort', () => reject(controller.signal.reason), {
        once: true,
      }),
    );
    const timer = setTimeout(
      () => controller.abort(new Error('Feed request timeout')),
      options.timeoutMs ?? 15_000,
    );
    try {
      const response = await Promise.race([
        aborted,
        fetcher(url, {
          signal: controller.signal,
          headers: {
            Accept: 'application/atom+xml, application/rss+xml, application/xml, text/xml',
            'User-Agent': 'BaiyunUBlogroll/1.0',
          },
        }),
      ]);
      if (!response.ok) {
        await response.body?.cancel();
        throw new FetchFailure(
          `HTTP ${response.status}`,
          [408, 429].includes(response.status) || response.status >= 500,
        );
      }
      if (Number(response.headers.get('content-length')) > maxBytes) {
        await response.body?.cancel();
        throw new FetchFailure('Feed response exceeds body limit');
      }
      if (!response.body) throw new FetchFailure('Empty response body');
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let bytes = 0;
      // The deadline covers body streaming too, including custom transports that do not honor fetch's signal.
      const cancel = () => {
        void reader.cancel().catch(() => {});
      };
      controller.signal.addEventListener('abort', cancel, { once: true });
      try {
        while (true) {
          const chunk = await Promise.race([aborted, reader.read()]);
          if (chunk.done) break;
          bytes += chunk.value.byteLength;
          if (bytes > maxBytes) {
            await reader.cancel();
            throw new FetchFailure('Feed response exceeds body limit');
          }
          chunks.push(chunk.value);
        }
      } finally {
        controller.signal.removeEventListener('abort', cancel);
        reader.releaseLock();
      }
      return new TextDecoder().decode(Buffer.concat(chunks));
    } catch (error) {
      if (attempt === 2 || (error instanceof FetchFailure && !error.retryable)) throw error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('Feed request failed');
}
