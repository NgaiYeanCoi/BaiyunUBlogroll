const configuredBase = import.meta.env.BASE_URL || '/';

/** All generated and browser-side URLs share Astro's normalized deployment base. */
export function withBase(path = ''): string {
  const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}
