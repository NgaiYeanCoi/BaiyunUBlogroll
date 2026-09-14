import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Article } from '../../src/lib/types';
export const source = {
  id: 'test',
  name: 'Test',
  siteUrl: 'https://example.com/',
  feedUrl: 'https://example.com/feed',
  enabled: true,
};
export const article = (id = 'one'): Article => ({
  id,
  sourceId: 'test',
  url: `https://example.com/${id}`,
  title: id,
  summary: '',
  guids: [],
  urlAliases: [],
  published: null,
  updated: null,
});
export async function repository() {
  const root = await mkdtemp(join(tmpdir(), 'blogroll-test-'));
  await mkdir(join(root, 'config'));
  await mkdir(join(root, 'data/feeds'), { recursive: true });
  await writeFile(join(root, 'config/sources.json'), JSON.stringify([source]));
  await writeFile(
    join(root, 'config/exclusions.json'),
    JSON.stringify({ sources: [], articles: [] }),
  );
  return root;
}
