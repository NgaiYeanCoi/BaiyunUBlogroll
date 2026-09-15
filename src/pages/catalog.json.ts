import type { APIRoute } from 'astro';
import { loadCatalog } from '../lib/catalog/index';

export const prerender = true;

export const GET: APIRoute = async () => {
  // This endpoint serializes the already-filtered catalog used by the HTML pages.
  const catalog = await loadCatalog();
  return new Response(JSON.stringify(catalog), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
