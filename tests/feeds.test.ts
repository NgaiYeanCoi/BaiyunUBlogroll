import { describe, expect, it } from 'vitest';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { article, repository, source } from './fixtures/helpers';
import { parseFeed, normalizeUrl, plainText } from '../src/lib/feeds/parse';
import { mergeArticles } from '../src/lib/feeds/merge';
import { fetchFeed } from '../src/lib/feeds/fetch';
import { refreshCandidates } from '../scripts/refresh';

const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><title>Blog</title><entry><id>tag:a</id><title>First</title><link href="https://example.com/one#x"/><published>2026-09-01T00:00:00Z</published><updated>2026-09-14T00:00:00Z</updated><summary type="html">&lt;p&gt;Hello &amp;amp; bye&lt;/p&gt;</summary></entry></feed>`;
describe('feed normalization', () => {
  it('never invents published from updated and preserves malformed/local/date-only Atom values', async () => {
    const onlyUpdated = await parseFeed(atom.replace(/<published>.*?<\/published>/, ''), source);
    expect(onlyUpdated.articles[0].published).toBeNull();
    expect(onlyUpdated.articles[0].updated?.kind).toBe('instant');
    const invalid = await parseFeed(
      atom
        .replace('2026-09-01T00:00:00Z', 'bad date')
        .replace('2026-09-14T00:00:00Z', '2026-09-14T12:00:00'),
      source,
    );
    expect(invalid.articles[0].published).toBeNull();
    expect(invalid.articles[0].updated?.kind).toBe('local');
    expect(invalid.diagnostics.join(' ')).toContain('bad date');
    const dateOnly = await parseFeed(atom.replace('2026-09-01T00:00:00Z', '2026-09-01'), source);
    expect(dateOnly.articles[0].published?.kind).toBe('date');
  });
  it('keeps Atom published and updated distinct through rss-parser', async () => {
    const result = await parseFeed(atom, source);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].published?.value).toBe('2026-09-01T00:00:00.000Z');
    expect(result.articles[0].updated?.value).toBe('2026-09-14T00:00:00.000Z');
    expect(result.articles[0].summary).toBe('Hello & bye');
    expect(result.articles[0].url).toBe('https://example.com/one');
  });
  it('preserves Atom author names through the parser adapter', async () => {
    const result = await parseFeed(
      atom.replace(
        '<title>First</title>',
        '<title>First</title><author><name>Alice</name></author>',
      ),
      source,
    );
    expect(result.articles[0].author).toBe('Alice');
  });
  it('skips one structurally damaged Atom entry without discarding valid neighboring articles', async () => {
    const mixed = atom.replace(
      '</feed>',
      '<entry><title>Broken link</title><link>not-an-Atom-link</link></entry></feed>',
    );
    const result = await parseFeed(mixed, source);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].title).toBe('First');
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });
  it('normalizes text and only accepts safe absolute HTTP URLs', () => {
    expect(plainText('<script>bad()</script><p>Hello&nbsp;世界</p><style>bad</style>')).toBe(
      'Hello 世界',
    );
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl('https://a.test/A?b=1#x')).toBe('https://a.test/A?b=1');
  });
  it('retains undated items and skips unsafe links, but rejects malformed and zero-valid feeds', async () => {
    const xml =
      '<rss version="2.0"><channel><title>RSS</title><item><title>Safe</title><link>https://example.com/a</link></item><item><title>Bad</title><link>javascript:bad</link></item></channel></rss>';
    const result = await parseFeed(xml, source);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].published).toBeNull();
    expect(result.diagnostics.length).toBeGreaterThan(0);
    await expect(parseFeed('<broken', source)).rejects.toThrow();
    await expect(parseFeed('<rss version="2.0"><channel/></rss>', source)).rejects.toThrow();
  });
});
describe('history and identity', () => {
  const none = { sources: [], articles: [] };
  it('retains history, updates nonempty fields and preserves stable identity on GUID link moves', () => {
    const old = { ...article(), guids: ['tag:a'], summary: 'Retain me' };
    const incoming = {
      ...article('incoming'),
      url: 'https://example.com/new',
      title: 'New',
      guids: ['tag:a'],
    };
    const first = mergeArticles([old, article('history')], [incoming], none).articles;
    expect(first).toHaveLength(2);
    expect(first.find((x) => x.id === 'one')).toMatchObject({
      title: 'New',
      summary: 'Retain me',
      url: 'https://example.com/new',
      urlAliases: ['https://example.com/one'],
    });
    expect(mergeArticles(first, [incoming], none).articles).toEqual(first);
  });
  it('does not overwrite ambiguous GUID matches or resurrect excluded aliases', () => {
    const old = [
      { ...article('a'), guids: ['shared'] },
      { ...article('b'), guids: ['shared'] },
    ];
    const incoming = { ...article('new'), guids: ['shared'] };
    const result = mergeArticles(old, [incoming], none);
    expect(result.articles.map((x) => x.id)).toEqual(['a', 'b']);
    expect(result.diagnostics.length).toBeGreaterThan(0);
    const excluded = {
      sources: [],
      articles: [{ sourceId: 'test', urls: ['https://example.com/a'] }],
    };
    expect(
      mergeArticles([old[0]], [{ ...incoming, guids: ['shared'] }], excluded).articles,
    ).toEqual([]);
  });
  it('does not spread a conflicting GUID to a URL-matched article', () => {
    const existing = [
      { ...article('a'), guids: ['a-guid'] },
      { ...article('b'), guids: ['b-guid'] },
    ];
    const result = mergeArticles(
      existing,
      [{ ...article('a'), title: 'Edited A', guids: ['b-guid'] }],
      none,
    );
    expect(result.articles[0].title).toBe('Edited A');
    expect(result.articles[0].guids).toEqual(['a-guid']);
    expect(result.articles[1].title).toBe('b');
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });
  it('keeps distinct incoming URLs when a feed reuses one GUID on multiple articles', () => {
    const result = mergeArticles(
      [],
      [
        { ...article('a'), guids: ['shared'] },
        { ...article('b'), guids: ['shared'] },
      ],
      none,
    );
    expect(result.articles.map((article) => article.url)).toEqual([
      'https://example.com/a',
      'https://example.com/b',
    ]);
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(
      mergeArticles(
        result.articles,
        [
          { ...article('a'), guids: ['shared'] },
          { ...article('b'), guids: ['shared'] },
        ],
        none,
      ).articles,
    ).toEqual(result.articles);
  });
});
describe('bounded network and refresh', () => {
  it('fails a refresh when every incoming record is rejected despite retained history', async () => {
    const root = await repository();
    const history = [
      { ...article('a'), guids: ['same'] },
      { ...article('b'), guids: ['same'] },
    ];
    const original = JSON.stringify({
      schemaVersion: 1,
      sourceId: 'test',
      contentChangedAt: null,
      articles: history,
    });
    await writeFile(join(root, 'data/feeds/test.json'), original);
    const xml =
      '<rss version="2.0"><channel><item><link>https://example.com/c</link><guid>same</guid></item></channel></rss>';
    const report = await refreshCandidates(root, { fetch: async () => new Response(xml) });
    expect(report.status).toBe('failed');
    expect(report.sources[0].status).toBe('failed');
    expect(report.sources[0].articleCount).toBe(2);
    expect(report.sources[0].diagnostics.join(' ')).toMatch(/Ambiguous identity/);
    expect(
      JSON.parse(await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8')).articles,
    ).toEqual(history);
    expect(await readFile(join(root, 'data/feeds/test.json'), 'utf8')).toBe(original);
  });
  it('accepts a titleless incoming record when a unique identity retains a valid historical title', async () => {
    const root = await repository();
    await writeFile(
      join(root, 'data/feeds/test.json'),
      JSON.stringify({
        schemaVersion: 1,
        sourceId: 'test',
        contentChangedAt: null,
        articles: [{ ...article('a'), guids: ['unique'] }],
      }),
    );
    const xml =
      '<rss version="2.0"><channel><item><link>https://example.com/new</link><guid>unique</guid><description>New summary</description></item></channel></rss>';
    const report = await refreshCandidates(root, { fetch: async () => new Response(xml) });
    expect(report.status).toBe('success');
    const candidate = JSON.parse(
      await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8'),
    );
    expect(candidate.articles).toHaveLength(1);
    expect(candidate.articles[0]).toMatchObject({
      id: 'a',
      title: 'a',
      url: 'https://example.com/new',
      summary: 'New summary',
    });
  });
  it('remembers excluded identity across URL changes on repeated refreshes and allows deliberate restoration', async () => {
    const root = await repository();
    await writeFile(
      join(root, 'data/feeds/test.json'),
      JSON.stringify({
        schemaVersion: 1,
        sourceId: 'test',
        contentChangedAt: null,
        articles: [{ ...article(), guids: ['tag:a'] }],
      }),
    );
    await writeFile(
      join(root, 'config/exclusions.json'),
      JSON.stringify({
        sources: [],
        articles: [{ sourceId: 'test', urls: ['https://example.com/one'] }],
      }),
    );
    await refreshCandidates(root, { fetch: async () => new Response(atom) });
    const candidate = await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8');
    expect(JSON.parse(candidate).articles).toEqual([]);
    expect(JSON.parse(candidate).tombstones).toHaveLength(1);
    expect(candidate).not.toContain('First');
    await writeFile(join(root, 'data/feeds/test.json'), candidate);
    const changed = atom.replace('https://example.com/one#x', 'https://example.com/new');
    await refreshCandidates(root, { fetch: async () => new Response(changed) });
    const second = await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8');
    expect(JSON.parse(second).articles).toEqual([]);
    await writeFile(join(root, 'data/feeds/test.json'), second);
    await writeFile(
      join(root, 'config/exclusions.json'),
      JSON.stringify({ sources: [], articles: [] }),
    );
    await refreshCandidates(root, { fetch: async () => new Response(changed) });
    const restored = JSON.parse(
      await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8'),
    );
    expect(restored.articles).toHaveLength(1);
    expect(restored.articles[0].id).toBe('one');
  });
  it('bounds concurrency, preserves unchanged timestamps, and never fetches paused or excluded sources', async () => {
    const root = await repository();
    const sources = Array.from({ length: 8 }, (_, index) => ({
      ...source,
      id: `source${index}`,
      enabled: index !== 6,
    }));
    await writeFile(join(root, 'config/sources.json'), JSON.stringify(sources));
    await writeFile(
      join(root, 'config/exclusions.json'),
      JSON.stringify({ sources: ['source7'], articles: [] }),
    );
    let active = 0;
    let peak = 0;
    let calls = 0;
    const fetcher: typeof fetch = async () => {
      calls++;
      active++;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active--;
      return new Response(atom);
    };
    await refreshCandidates(root, { fetch: fetcher, now: () => new Date('2026-09-14T00:00:00Z') });
    expect(peak).toBeLessThanOrEqual(4);
    expect(calls).toBe(6);
    const first = await readFile(join(root, '.cache/refresh/feeds/source0.json'), 'utf8');
    await writeFile(join(root, 'data/feeds/source0.json'), first);
    await refreshCandidates(root, { fetch: fetcher, now: () => new Date('2026-09-15T00:00:00Z') });
    expect(await readFile(join(root, '.cache/refresh/feeds/source0.json'), 'utf8')).toBe(first);
  });
  it('retries transient failures at most twice and rejects nonretryable HTTP failures', async () => {
    let calls = 0;
    const fetcher: typeof fetch = async () => {
      calls++;
      return calls === 1 ? new Response('', { status: 503 }) : new Response(atom);
    };
    expect(await fetchFeed(source.feedUrl, { fetch: fetcher })).toContain('<feed');
    expect(calls).toBe(2);
    calls = 0;
    await expect(
      fetchFeed(source.feedUrl, {
        fetch: async () => {
          calls++;
          return new Response('', { status: 404 });
        },
      }),
    ).rejects.toThrow();
    expect(calls).toBe(1);
  });
  it('bounds streamed response bodies and aborts hanging requests', async () => {
    await expect(
      fetchFeed(source.feedUrl, { maxBytes: 10, fetch: async () => new Response(atom) }),
    ).rejects.toThrow(/large|limit/i);
    await expect(
      fetchFeed(source.feedUrl, {
        timeoutMs: 5,
        fetch: async (_url, init) =>
          new Promise((_resolve, reject) =>
            init?.signal?.addEventListener('abort', () => reject(new Error('aborted'))),
          ),
      }),
    ).rejects.toThrow(/timeout|abort/i);
  });
  it('times out an indefinitely stalled response body, not only connection establishment', async () => {
    await expect(
      fetchFeed(source.feedUrl, {
        timeoutMs: 5,
        fetch: async () => new Response(new ReadableStream({ start() {} })),
      }),
    ).rejects.toThrow(/timeout/i);
  });
  it('writes only candidates, retains failed-source history, and reports partial then total failure', async () => {
    const root = await repository();
    const second = { ...source, id: 'other', feedUrl: 'https://other.test/feed' };
    await writeFile(join(root, 'config/sources.json'), JSON.stringify([source, second]));
    const original = JSON.stringify({
      schemaVersion: 1,
      sourceId: 'test',
      contentChangedAt: null,
      articles: [article('history')],
    });
    await writeFile(join(root, 'data/feeds/test.json'), original);
    const result = await refreshCandidates(root, {
      fetch: async (url) =>
        String(url).includes('other') ? new Response('', { status: 404 }) : new Response(atom),
      now: () => new Date('2026-09-14T01:00:00Z'),
    });
    expect(result.status).toBe('degraded');
    expect(await readFile(join(root, 'data/feeds/test.json'), 'utf8')).toBe(original);
    expect(
      JSON.parse(await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8')).articles,
    ).toHaveLength(2);
    const failed = await refreshCandidates(root, {
      fetch: async () => new Response('', { status: 500 }),
    });
    expect(failed.status).toBe('failed');
    expect(
      JSON.parse(await readFile(join(root, '.cache/refresh/feeds/test.json'), 'utf8')).articles,
    ).toHaveLength(1);
  });
});
