import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { APIRoute } from 'astro';
import { loadCatalog } from '../lib/catalog/index';
import type { RefreshReport } from '../lib/types';

export const prerender = true;

async function readRefreshReport(): Promise<RefreshReport | { status: 'not_checked' }> {
  const reportFile = process.env.BLOGROLL_REPORT_FILE;
  if (!reportFile) return { status: 'not_checked' };
  const reportPath = resolve(process.cwd(), reportFile);
  return JSON.parse(await readFile(reportPath, 'utf8')) as RefreshReport;
}

export const GET: APIRoute = async () => {
  const [catalog, refresh] = await Promise.all([loadCatalog(), readRefreshReport()]);
  const status = {
    sourceSha: process.env.SOURCE_SHA ?? 'local',
    dataVersion: catalog.dataVersion,
    changedAt: catalog.changedAt,
    refresh,
  };
  return new Response(JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
