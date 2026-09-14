import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadCatalog } from '../src/lib/catalog/index';
import { checkDist } from '../scripts/check-dist';
import { promoteData } from '../scripts/promote-data';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function fixture(base = '/BaiyunUBlogroll/') {
  const root = await mkdtemp(path.join(tmpdir(), 'blogroll-delivery-'));
  roots.push(root);
  const json = async (file: string, value: unknown) => {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), JSON.stringify(value));
  };
  await json('config/site.json', { url: 'https://example.com', base });
  await json('config/sources.json', [
    {
      id: 'a',
      name: 'A',
      siteUrl: 'https://a.test/',
      feedUrl: 'https://a.test/rss',
      enabled: true,
    },
  ]);
  await json('config/exclusions.json', { sources: [], articles: [] });
  await json('.cache/refresh/feeds/a.json', {
    schemaVersion: 1,
    sourceId: 'a',
    contentChangedAt: null,
    articles: [
      {
        id: 'a-one',
        sourceId: 'a',
        url: 'https://a.test/one',
        title: 'One',
        summary: '',
        guids: [],
        urlAliases: [],
        published: null,
        updated: null,
      },
    ],
  });
  const report = {
    status: 'success',
    checkedAt: '2026-09-14T00:00:00Z',
    sources: [{ sourceId: 'a', status: 'success', articleCount: 1, diagnostics: [] }],
  };
  await json('.cache/refresh/report.json', report);
  const catalog = await loadCatalog(root, path.join(root, '.cache/refresh/feeds'));
  await json('dist/catalog.json', catalog);
  await json('dist/status.json', {
    sourceSha: 'local',
    dataVersion: catalog.dataVersion,
    changedAt: null,
    refresh: report,
  });
  for (const route of ['', 'blogs/', 'join/']) {
    const file = path.join(root, 'dist', route, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(
      file,
      `<html lang="zh-CN"><head><link rel="canonical" href="https://example.com${base}${route}"></head><body><a href="${base}">首页</a></body></html>`,
    );
  }
  return { root, json, catalog, report };
}

describe('validated static publication', () => {
  it.each(['/', '/BaiyunUBlogroll/'])(
    'accepts offline HTML and matching catalog under %s',
    async (base) => {
      const { root } = await fixture(base);
      await expect(checkDist(root, '.cache/refresh/feeds')).resolves.toBeUndefined();
    },
  );
  it('rejects exposed development files and missing internal resources', async () => {
    const { root } = await fixture();
    await writeFile(path.join(root, 'dist', 'main.py'), 'private development script');
    await expect(checkDist(root, '.cache/refresh/feeds')).rejects.toThrow(
      /unexpected|forbidden|不允许/i,
    );
    await rm(path.join(root, 'dist', 'main.py'));
    await writeFile(
      path.join(root, 'dist', 'index.html'),
      '<a href="/BaiyunUBlogroll/missing.css">broken</a>',
    );
    await expect(checkDist(root, '.cache/refresh/feeds')).rejects.toThrow();
  });
  it('rejects a public catalog that diverges from filtered source data', async () => {
    const { root, json, catalog } = await fixture();
    await json('dist/catalog.json', { ...catalog, dataVersion: 'stale' });
    await expect(checkDist(root, '.cache/refresh/feeds')).rejects.toThrow();
  });
  it('promotes only configured candidates and does not rewrite identical files', async () => {
    const { root, json } = await fixture();
    await json('.cache/refresh/feeds/not-configured.json', { arbitrary: true });
    await expect(promoteData(root)).resolves.toEqual(['data/feeds/a.json']);
    expect(JSON.parse(await readFile(path.join(root, 'data/feeds/a.json'), 'utf8')).sourceId).toBe(
      'a',
    );
    await expect(readFile(path.join(root, 'data/feeds/not-configured.json'))).rejects.toThrow();
    await expect(promoteData(root)).resolves.toEqual([]);
  });
  it('does not persist a failed refresh or candidate different from the verified build', async () => {
    const { root, json } = await fixture();
    await json('.cache/refresh/report.json', { status: 'failed' });
    await expect(promoteData(root)).rejects.toThrow();
    await expect(readFile(path.join(root, 'data/feeds/a.json'))).rejects.toThrow();
    await json('.cache/refresh/report.json', { status: 'success' });
    await json('dist/catalog.json', { dataVersion: 'old-version' });
    await expect(promoteData(root)).rejects.toThrow();
    await expect(readFile(path.join(root, 'data/feeds/a.json'))).rejects.toThrow();
  });
  it('rejects promotion when the artifact describes an offline or different refresh run', async () => {
    const { root, json, catalog, report } = await fixture();
    const metadata = { sourceSha: 'local', dataVersion: catalog.dataVersion, changedAt: null };
    await json('dist/status.json', { ...metadata, refresh: { status: 'not_checked' } });
    await expect(promoteData(root)).rejects.toThrow(/refresh|report/i);
    await json('dist/status.json', {
      ...metadata,
      refresh: { ...report, checkedAt: '2026-09-13T00:00:00Z' },
    });
    await expect(promoteData(root)).rejects.toThrow(/refresh|report/i);
    await expect(readFile(path.join(root, 'data/feeds/a.json'))).rejects.toThrow();
  });
});
