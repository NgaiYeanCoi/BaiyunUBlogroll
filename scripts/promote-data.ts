import assert from 'node:assert/strict';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRepository } from '../src/lib/catalog/index';
import { checkDist } from './check-dist';

export async function promoteData(root = process.cwd()): Promise<string[]> {
  const candidate = path.resolve(root, process.env.BLOGROLL_DATA_DIR ?? '.cache/refresh/feeds');
  const reportFile = path.resolve(
    root,
    process.env.BLOGROLL_REPORT_FILE ?? '.cache/refresh/report.json',
  );
  const report = JSON.parse(await readFile(reportFile, 'utf8'));
  assert(
    ['success', 'degraded'].includes(report.status),
    'Cannot promote a failed or unchecked refresh',
  );
  assert(
    Array.isArray(report.sources) &&
      report.sources.some(
        (source: { status: string; articleCount: number }) =>
          source.status === 'success' && source.articleCount > 0,
      ),
    'Refresh has no successful source',
  );
  await checkDist(root, candidate, reportFile);
  const repository = await loadRepository(root, candidate);
  const changed: { relative: string; contents: string }[] = [];

  // Read and validate the entire allowlist before modifying persistent files. Missing candidates are errors.
  for (const source of repository.sources) {
    const contents = await readFile(path.join(candidate, `${source.id}.json`), 'utf8');
    const relative = `data/feeds/${source.id}.json`;
    const existing = await readFile(path.join(root, relative), 'utf8').catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error;
        return null;
      },
    );
    if (
      existing === null ||
      JSON.stringify(JSON.parse(existing)) !== JSON.stringify(JSON.parse(contents))
    )
      changed.push({ relative, contents });
  }
  await mkdir(path.join(root, 'data/feeds'), { recursive: true });
  for (const file of changed) {
    const target = path.join(root, file.relative);
    const temporary = `${target}.tmp`;
    await writeFile(temporary, file.contents, { encoding: 'utf8', flag: 'wx' });
    await rename(temporary, target);
  }
  const files = changed.map((file) => file.relative);
  await mkdir(path.join(root, '.cache'), { recursive: true });
  // The writer job consumes these literal validated paths instead of staging the working directory.
  await writeFile(
    path.join(root, '.cache/promoted-files.txt'),
    files.length ? files.join('\n') + '\n' : '',
  );
  return files;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(`Promoted ${(await promoteData()).length} changed source snapshot(s).`);
}
