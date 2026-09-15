import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadCatalog } from '../src/lib/catalog/index';

async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const lists = await Promise.all(
    entries.map(async (entry) => {
      const file = path.join(directory, entry.name);
      assert(!entry.isSymbolicLink(), `Forbidden symbolic link: ${file}`);
      return entry.isDirectory() ? filesIn(file) : [file];
    }),
  );
  return lists.flat();
}

export async function checkDist(
  root = process.cwd(),
  dataDirectory?: string,
  reportFile = process.env.BLOGROLL_REPORT_FILE,
): Promise<void> {
  const dist = path.join(root, 'dist');
  const site = JSON.parse(await readFile(path.join(root, 'config/site.json'), 'utf8'));
  const base = `/${(process.env.SITE_BASE ?? site.base).replace(/^\/+|\/+$/g, '')}/`.replace(
    '//',
    '/',
  );
  const origin = new URL(process.env.SITE_URL ?? site.url).origin;
  const catalog = await loadCatalog(root, dataDirectory);
  const published = JSON.parse(await readFile(path.join(dist, 'catalog.json'), 'utf8'));
  // This comparison also proves withdrawn content is absent from the public search index.
  assert.deepEqual(
    published,
    catalog,
    'Public catalog differs from validated, filtered source data',
  );
  const status = JSON.parse(await readFile(path.join(dist, 'status.json'), 'utf8'));
  assert.equal(status.dataVersion, catalog.dataVersion, 'Status and article data versions differ');
  assert.equal(status.changedAt, catalog.changedAt, 'Content change timestamp differs');
  assert.equal(typeof status.sourceSha, 'string', 'Missing source revision');
  assert(
    ['success', 'degraded', 'not_checked'].includes(status.refresh?.status),
    'Unexpected publication refresh state',
  );
  if (reportFile) {
    const report = JSON.parse(await readFile(path.resolve(root, reportFile), 'utf8'));
    // Identical article data can occur in different refreshes; the report must still belong to this exact artifact.
    assert.deepEqual(
      status.refresh,
      report,
      'Artifact refresh report differs from the candidate run',
    );
  }
  if (process.env.SOURCE_SHA)
    assert.equal(status.sourceSha, process.env.SOURCE_SHA, 'Wrong source revision');

  const required = ['index.html', 'blogs/index.html', 'join/index.html'];
  for (let page = 2; page <= Math.ceil(catalog.articles.length / 20); page++)
    required.push(`page/${page}/index.html`);
  for (const route of required)
    assert((await stat(path.join(dist, route))).isFile(), `Missing page ${route}`);
  for (const file of await filesIn(dist)) {
    const relative = path.relative(dist, file).split(path.sep).join('/');
    // Only public page, data and asset directories belong in a Pages artifact.
    assert(
      !/(^|\/)(config|data|scripts|tests|node_modules|docs|\.local|\.cache|\.git)(\/|$)/.test(
        relative,
      ),
      `Forbidden output path: ${relative}`,
    );
    assert(
      /\.(html|css|js|json|svg|png|jpg|jpeg|webp|avif|ico|txt|xml|woff2?)$/.test(relative) ||
        relative === '.nojekyll',
      `Unexpected output file: ${relative}`,
    );
    if (file.endsWith('.json'))
      assert(
        ['catalog.json', 'status.json'].includes(relative),
        `Unexpected public JSON: ${relative}`,
      );
    if (!file.endsWith('.html')) continue;
    assert(required.includes(relative), `Unexpected or stale HTML page: ${relative}`);
    const html = await readFile(file, 'utf8');
    const route = relative.replace(/index\.html$/, '');
    const current = new URL(base + route, origin);
    const canonical = html.match(
      /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/,
    )?.[1];
    assert.equal(canonical, current.href, `Wrong canonical URL in ${relative}`);
    for (const match of html.matchAll(/\b(?:href|src|action)=["']([^"']*)["']/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      if (!raw || raw.startsWith('#') || /^(mailto:|tel:|data:)/.test(raw)) continue;
      const url = new URL(raw, current);
      assert(['https:', 'http:'].includes(url.protocol), `Unsafe URL in ${relative}`);
      if (url.origin !== origin) continue;
      assert(url.pathname.startsWith(base), `URL escapes Pages base in ${relative}: ${raw}`);
      const target = decodeURIComponent(url.pathname.slice(base.length));
      const resolved = path.resolve(
        dist,
        target.endsWith('/') || !target ? `${target}index.html` : target,
      );
      assert(resolved.startsWith(dist + path.sep), `URL escapes output directory: ${raw}`);
      assert((await stat(resolved)).isFile(), `Missing local resource ${raw}`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await checkDist();
  console.log(
    'Static output verified: pages, assets, base paths, filtered catalog and publication metadata.',
  );
}
