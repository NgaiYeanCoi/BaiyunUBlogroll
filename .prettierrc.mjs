// Keep Astro templates and the shared TypeScript pipeline readable with one formatter.
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  printWidth: 100,
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
