import { defineConfig } from 'astro/config';
import site from './config/site.json' with { type: 'json' };

// Pages project URLs and custom domains share the same route and asset base.
const base = process.env.SITE_BASE ?? site.base;
export default defineConfig({
  site: process.env.SITE_URL ?? site.url,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
