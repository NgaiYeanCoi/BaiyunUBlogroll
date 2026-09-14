import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { Catalog, FeedSnapshot } from '../types';
import { SourceSchema, ExclusionsSchema, FeedSnapshotSchema } from './schema';
import { isExcluded } from './exclusions';
import { sortArticles } from './dates';
export { isExcluded } from './exclusions';

export async function loadRepository(
  root = process.cwd(),
  dataDirectory = process.env.BLOGROLL_DATA_DIR ?? 'data/feeds',
) {
  const sources = z
    .array(SourceSchema)
    .parse(JSON.parse(await readFile(resolve(root, 'config/sources.json'), 'utf8')));
  if (new Set(sources.map((source) => source.id)).size !== sources.length)
    throw new Error('Duplicate source IDs');
  const exclusions = ExclusionsSchema.parse(
    JSON.parse(await readFile(resolve(root, 'config/exclusions.json'), 'utf8')),
  );
  const snapshots: Record<string, FeedSnapshot> = {};
  for (const source of sources) {
    let input: string;
    try {
      input = await readFile(resolve(root, dataDirectory, `${source.id}.json`), 'utf8');
    } catch (error) {
      // Only an absent configured snapshot is a fresh source; permission and corruption errors fail the build.
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      snapshots[source.id] = {
        schemaVersion: 1,
        sourceId: source.id,
        contentChangedAt: null,
        articles: [],
      };
      continue;
    }
    const snapshot = FeedSnapshotSchema.parse(JSON.parse(input));
    if (snapshot.sourceId !== source.id) throw new Error(`Snapshot source mismatch: ${source.id}`);
    snapshots[source.id] = snapshot;
  }
  // Only configured sources participate: removing a source never exposes orphan snapshot files.
  return { sources, exclusions, snapshots };
}
export async function loadCatalog(root = process.cwd(), dataDirectory?: string): Promise<Catalog> {
  const repository = await loadRepository(root, dataDirectory);
  const sources = repository.sources.filter(
    (source) => !repository.exclusions.sources.includes(source.id),
  );
  const articles = sortArticles(
    sources
      .flatMap((source) => repository.snapshots[source.id].articles)
      .filter((article) => !isExcluded(article, repository.exclusions)),
  );
  const changes = sources
    .map((source) => repository.snapshots[source.id].contentChangedAt)
    .filter((value): value is string => value !== null)
    .sort();
  const dataVersion = createHash('sha256')
    .update(JSON.stringify({ sources, articles }))
    .digest('hex');
  return { sources, articles, dataVersion, changedAt: changes.at(-1) ?? null };
}
