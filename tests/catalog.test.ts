import { describe, expect, it } from 'vitest';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadCatalog } from '../src/lib/catalog/index';
import { parseDate, displayDate, sortArticles } from '../src/lib/catalog/dates';
import { article, repository } from './fixtures/helpers';
describe('article dates', () => {
  it('preserves calendar values and rejects invalid calendar dates without fabricating zones', () => {
    expect(parseDate('2026-09-14')).toEqual({
      kind: 'date',
      value: '2026-09-14',
      raw: '2026-09-14',
    });
    expect(parseDate('2026-09-14T12:30:00')?.kind).toBe('local');
    expect(parseDate('2026-02-30')).toBeNull();
    expect(parseDate('yesterday')).toBeNull();
    expect(displayDate(parseDate('2026-09-14T20:00:00Z'))).toBe('2026-09-15');
    expect(parseDate('Mon, 30 Feb 2026 12:00:00 GMT')).toBeNull();
    expect(parseDate('Mon, 14 Sep 2026 12:00:00 GMT')?.value).toBe('2026-09-14T12:00:00.000Z');
  });
  it('orders displayed day then instants then stable IDs, retaining unknown dates', () => {
    const records = [
      article('z'),
      { ...article('b'), published: parseDate('2026-09-14') },
      { ...article('a'), updated: parseDate('2026-09-13T20:00:00Z') },
      { ...article('c'), published: parseDate('2026-09-15T01:00:00') },
    ];
    expect(sortArticles(records).map((x) => x.id)).toEqual(['c', 'a', 'b', 'z']);
    expect(records[0].id).toBe('z');
  });
});
describe('catalog trust boundary', () => {
  it('builds a fresh empty site and fails closed on corrupt or unsupported snapshots', async () => {
    const root = await repository();
    expect((await loadCatalog(root)).articles).toEqual([]);
    await writeFile(join(root, 'data/feeds/test.json'), '{broken');
    await expect(loadCatalog(root)).rejects.toThrow();
    await writeFile(join(root, 'data/feeds/test.json'), JSON.stringify({ schemaVersion: 9 }));
    await expect(loadCatalog(root)).rejects.toThrow();
  });
  it('filters source and known article aliases and hashes visible business data only', async () => {
    const root = await repository();
    const snap = {
      schemaVersion: 1,
      sourceId: 'test',
      contentChangedAt: '2026-09-14T00:00:00.000Z',
      articles: [{ ...article(), urlAliases: ['https://example.com/old'] }, article('two')],
    };
    await writeFile(join(root, 'data/feeds/test.json'), JSON.stringify(snap));
    await writeFile(
      join(root, 'config/exclusions.json'),
      JSON.stringify({
        sources: [],
        articles: [{ sourceId: 'test', urls: ['https://example.com/old#fragment'] }],
      }),
    );
    const first = await loadCatalog(root);
    expect(first.articles.map((x) => x.id)).toEqual(['two']);
    snap.contentChangedAt = '2026-09-15T00:00:00.000Z';
    await writeFile(join(root, 'data/feeds/test.json'), JSON.stringify(snap));
    expect((await loadCatalog(root)).dataVersion).toBe(first.dataVersion);
    await writeFile(
      join(root, 'config/exclusions.json'),
      JSON.stringify({ sources: ['test'], articles: [] }),
    );
    expect((await loadCatalog(root)).sources).toEqual([]);
    expect((await loadCatalog(root)).articles).toEqual([]);
  });
});
