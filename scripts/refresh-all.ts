import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function refreshAll(root = process.cwd()): number {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('Run this workflow with npm run refresh:all');

  // Candidate paths apply only to this workflow, so later offline builds cannot accidentally read stale candidates.
  const env = {
    ...process.env,
    BLOGROLL_DATA_DIR: '.cache/refresh/feeds',
    BLOGROLL_REPORT_FILE: '.cache/refresh/report.json',
  };
  for (const task of ['refresh', 'build', 'data:promote']) {
    // Invoke npm through Node to handle Windows .cmd wrappers and paths with spaces without a shell.
    const result = spawnSync(process.execPath, [npmCli, 'run', task], {
      cwd: root,
      env,
      stdio: 'inherit',
      windowsHide: true,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) return result.status ?? 1;
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    process.exitCode = refreshAll();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
