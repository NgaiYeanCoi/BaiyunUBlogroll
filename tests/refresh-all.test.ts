import { afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { refreshAll } from '../scripts/refresh-all';

const roots: string[] = [];
afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function workspace(failedTask = '') {
  const root = await mkdtemp(join(tmpdir(), 'blogroll refresh '));
  roots.push(root);
  // Exercise real Node subprocesses, including Windows paths with spaces, without fetching RSS.
  const cli = join(root, 'test npm cli.mjs');
  await writeFile(
    cli,
    [
      "import { appendFileSync, writeFileSync } from 'node:fs';",
      'const task = process.argv[3];',
      "appendFileSync('steps.jsonl', JSON.stringify({task, data:process.env.BLOGROLL_DATA_DIR, report:process.env.BLOGROLL_REPORT_FILE}) + '\\n');",
      'if (task === process.env.BLOGROLL_TEST_FAIL_TASK) process.exit(23);',
      "if (task === 'data:promote') writeFileSync('saved.json', '{}');",
    ].join('\n'),
  );
  vi.stubEnv('npm_execpath', cli);
  vi.stubEnv('BLOGROLL_TEST_FAIL_TASK', failedTask);
  return root;
}

async function steps(root: string) {
  return (await readFile(join(root, 'steps.jsonl'), 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
}

it('refreshes, builds and saves with fixed candidate paths while leaving the parent environment unchanged', async () => {
  const root = await workspace();
  vi.stubEnv('BLOGROLL_DATA_DIR', 'unrelated-data');
  vi.stubEnv('BLOGROLL_REPORT_FILE', 'unrelated-report');
  expect(refreshAll(root)).toBe(0);
  expect(await steps(root)).toEqual(
    ['refresh', 'build', 'data:promote'].map((task) => ({
      task,
      data: '.cache/refresh/feeds',
      report: '.cache/refresh/report.json',
    })),
  );
  expect(await readFile(join(root, 'saved.json'), 'utf8')).toBe('{}');
  expect(process.env.BLOGROLL_DATA_DIR).toBe('unrelated-data');
  expect(process.env.BLOGROLL_REPORT_FILE).toBe('unrelated-report');
});

it.each(['refresh', 'build', 'data:promote'])(
  'stops immediately when %s fails and does not save data',
  async (failedTask) => {
    const root = await workspace(failedTask);
    expect(refreshAll(root)).toBe(23);
    const tasks = ['refresh', 'build', 'data:promote'];
    expect((await steps(root)).map((step) => step.task)).toEqual(
      tasks.slice(0, tasks.indexOf(failedTask) + 1),
    );
    await expect(readFile(join(root, 'saved.json'))).rejects.toThrow();
  },
);

it('explains the supported entrypoint when invoked without npm', () => {
  vi.stubEnv('npm_execpath', undefined);
  expect(() => refreshAll()).toThrow(/npm run refresh:all/);
});
