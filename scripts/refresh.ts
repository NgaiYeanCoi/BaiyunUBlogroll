import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { RefreshReport, SourceResult } from '../src/lib/types';
import type { FetchOptions } from '../src/lib/feeds/fetch';
import { fetchFeed } from '../src/lib/feeds/fetch';
import { parseFeed } from '../src/lib/feeds/parse';
import { mergeArticles } from '../src/lib/feeds/merge';
import { loadRepository } from '../src/lib/catalog/index';
import { FeedSnapshotSchema } from '../src/lib/catalog/schema';

export async function refreshCandidates(
  root = process.cwd(),
  options: FetchOptions & { now?: () => Date } = {},
): Promise<RefreshReport> {
  // Refresh always starts from repository history, never from a prior partial candidate or an environment override.
  const { sources, snapshots, exclusions } = await loadRepository(root, 'data/feeds');
  const checkedAt = (options.now?.() ?? new Date()).toISOString();
  const results: SourceResult[] = new Array(sources.length);
  const output = resolve(root, '.cache/refresh/feeds');
  await mkdir(output, { recursive: true });
  // Only direct JSON children of the fixed candidate directory are removed; repository snapshots are read-only here.
  for (const entry of await readdir(output, { withFileTypes: true }))
    if (entry.isFile() && entry.name.endsWith('.json')) await unlink(join(output, entry.name));
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, sources.length) }, async () => {
      for (;;) {
        const index = cursor++;
        const source = sources[index];
        if (!source) break;
        const old = snapshots[source.id];
        let incoming = [] as typeof old.articles;
        let diagnostics: string[] = [];
        let status: SourceResult['status'];
        if (exclusions.sources.includes(source.id)) status = 'excluded';
        else if (!source.enabled) status = 'paused';
        else {
          try {
            const parsed = await parseFeed(await fetchFeed(source.feedUrl, options), source);
            incoming = parsed.articles;
            diagnostics = parsed.diagnostics;
            status = 'success';
          } catch (error) {
            status = 'failed';
            diagnostics = [error instanceof Error ? error.message : String(error)];
          }
        }
        let merged = mergeArticles(old.articles, incoming, exclusions, old.tombstones, source.id);
        diagnostics.push(...merged.diagnostics);
        if (status === 'success' && merged.acceptedCount === 0) {
          // Parsing an item is insufficient: rejected identities must not make retained history look freshly collected.
          status = 'failed';
          diagnostics.push('Feed has zero valid accepted articles');
          merged = mergeArticles(old.articles, [], exclusions, old.tombstones, source.id);
        }
        const { articles, tombstones } = merged;
        const changed = JSON.stringify(articles) !== JSON.stringify(old.articles);
        const snapshot = FeedSnapshotSchema.parse({
          ...old,
          articles,
          ...(tombstones.length ? { tombstones } : { tombstones: undefined }),
          contentChangedAt: changed ? checkedAt : old.contentChangedAt,
        });
        await writeFile(
          join(output, `${source.id}.json`),
          `${JSON.stringify(snapshot, null, 2)}\n`,
        );
        results[index] = {
          sourceId: source.id,
          status,
          articleCount: articles.length,
          diagnostics,
        };
      }
    }),
  );
  const succeeded = results.filter((result) => result.status === 'success').length;
  const report: RefreshReport = {
    status: !succeeded
      ? 'failed'
      : results.some((result) => result.status === 'failed')
        ? 'degraded'
        : 'success',
    checkedAt,
    sources: results,
  };
  await writeFile(
    resolve(root, '.cache/refresh/report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  refreshCandidates()
    .then((report) => {
      console.log(
        `Refresh ${report.status}: ${report.sources.map((source) => `${source.sourceId}=${source.status} (${source.articleCount})`).join(', ')}`,
      );
      for (const source of report.sources)
        for (const diagnostic of source.diagnostics)
          console.error(`${source.sourceId}: ${diagnostic}`);
      if (report.status === 'failed') process.exitCode = 1;
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
