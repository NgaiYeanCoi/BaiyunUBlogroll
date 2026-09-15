# BaiyunUBlogroll Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan with independent ownership and a final review.

**Goal:** Replace the retired Python project with an Astro static blogroll, starting from current RSS feeds without migrating old articles.

**Architecture:** Node produces validated, per-source JSON snapshots. One catalog loader applies exclusions and stable date rules for both HTML and the public search index. Astro builds offline; GitHub Actions validates candidate refreshes before persisting only feed JSON and deploying only dist to GitHub Pages.

**Tech Stack:** Node 24, Astro 7, TypeScript, rss-parser, Zod, Vitest; no server or database.

**Spec:** ../specs/2026-09-14-astro-blogroll-design.md

## Global constraints and rulings

- User explicitly retired the old site: no migration, compatibility layer, or imported old articles. Four source URLs remain as initial configuration.
- Work on `codex/astro-pages-rebuild` in the current checkout. Preexisting modified files are backed up under ignored `.local/legacy-before-rebuild`; preserve that backup. Branch isolation is sufficient for this in-place replacement; do not create another checkout or discard user edits.
- The approved HTML concept is the visual reference; do not regenerate a different design. Use Astro components and CSS, with small browser-side search code.
- A direct catalog loader is sufficient: do not duplicate it in an Astro content collection cache.
- Independent implementation may run concurrently with fixed interfaces and disjoint owned files. Controller handles dependencies, integration and git commits; agents do not change shared types without coordination.
- Necessary comments explain date, matching, persistence, configuration and safety boundaries.

## Shared contracts

`src/lib/types.ts` defines all persisted and returned shapes. Public stable entry points:

```ts
// src/lib/catalog/index.ts (server only)
loadCatalog(root?: string, dataDirectory?: string): Promise<Catalog>
// src/lib/catalog/dates.ts (browser safe)
displayDate(date: ArticleDate | null): string // empty string for unknown
sortArticles(articles: Article[]): Article[] // new array, spec ordering
// src/lib/catalog/search.ts (browser safe, frontend ownership)
searchArticles(articles: Article[], sources: Source[], query: string, sourceId: string): Article[]
```

The loader defaults to cwd and `BLOGROLL_DATA_DIR` or `data/feeds`, and fails on corrupt or unsupported data. Missing files are valid for a fresh source. Catalog sources and articles exclude tombstones. `dataVersion` hashes visible business data deterministically. `changedAt` is persisted content change time, never live connectivity status.

CLI contracts:

- `npm run refresh`: read repository snapshots, fetch bounded feeds, write candidate JSON only to `.cache/refresh/feeds` plus `.cache/refresh/report.json`. Nonzero when all enabled sources fail. No persistent data changes or deployment.
- Build with `BLOGROLL_DATA_DIR=.cache/refresh/feeds` and `BLOGROLL_REPORT_FILE=.cache/refresh/report.json` to validate a candidate. Normal build is offline.
- `npm run data:promote`: after successful candidate build/check, validate and copy the exact configured candidate JSON files to `data/feeds`. Git workflow stages only explicit allowed files. Controller implements this entry point.
- `npm run check:dist`: assert required pages/index/status, base-path URLs and static artifact boundaries. `SOURCE_SHA` links artifact to source revision.
- Public `catalog.json` contains `{sources, articles, dataVersion, changedAt}` from the same filtered loader as HTML. `status.json` contains source SHA, data version, and either actual refresh report or `not_checked`. Neither exposes unfiltered snapshots or feed diagnostics as HTML.

## Task 1 — Bootstrap and retire old runtime (controller)

- [x] Create package/lock, Astro strict config, initial sources, shared types and ignored local caches.
- [x] Remove obsolete Python entrypoints, generated root HTML/JSON/Markdown, fonts and wordcloud assets after protecting local changes.
- [x] Install and pin dependencies; validate Node version; do not publish.

## Task 2 — Data domain and refresh (core agent)

Owned files: `src/lib/feeds/**`, `src/lib/catalog/**` except search.ts, `scripts/refresh.ts`, `tests/feeds.test.ts`, `tests/catalog.test.ts`, `tests/fixtures/**`.

- [x] Write failing behavior tests, then implement source/snapshot validation, date preservation/sorting, safe HTTP URL and plain-text normalization.
- [x] Test repeat fetch dedupe, URL+GUID continuity/ambiguity, retained history, missing-field preservation, persistent article/source exclusions, malformed/empty feeds, timeout/retry/body limits, partial and total failure.
- [x] Implement single-request RSS/Atom parsing via rss-parser, concurrency <=4, timeout 15s, max2 tries, body <=5MiB. Inject network for offline tests.
- [x] Implement strict `loadCatalog` and deterministic public data version.
- [x] Implement candidate-only refresh CLI and concise diagnostics. Zero valid articles counts as failure. No old data imports.

Validation: `npx vitest run tests/feeds.test.ts tests/catalog.test.ts`; red before implementation, green after, record relevant outputs in local report.

## Task 3 — Approved frontend (frontend agent)

Owned files: `src/pages/**`, `src/components/**`, `src/layouts/**`, `src/styles/**`, `src/client/**`, `src/lib/catalog/search.ts`, `tests/search.test.ts`, `public/**`.

- [x] Implement approved copy/layout/colors for article feed, directory, join page; no fabricated summaries or dates.
- [x] Pre-render 20-item pages; include real links and no-JS readable content. Handle zero articles gracefully.
- [x] Add global metadata search + source filter + query-state pagination, using safe DOM text rendering. Test across pages, combined filters, empty states, URL restoration.
- [x] Publish filtered `catalog.json` and truthful `status.json`; use one base helper for all routes and assets.
- [x] Support dark mode, visible focus and reduced motion, narrow320px, accessible labeled controls, SEO canonical.

Validation: focused search tests and `npm run check`; controller compares real browser to approved concept and checks mobile/no-JS.

## Task 4 — Pages delivery and maintenance (delivery agent)

Owned files: `.github/**`, `readme.md` (controller owns scripts/check-dist.ts and scripts/promote-data.ts).

- [x] Replace old workflow with PR offline checks, trusted default-branch offline deploy and scheduled/manual refresh pipeline using CLI contracts above.
- [x] Schedule `30 16 * * *` UTC. Workflow dispatch boolean refresh (default true), false offline rebuild. Checkout actual default branch for refresh.
- [x] Separate read-only build, data-write and Pages permissions. Upload only dist; candidate artifact only internal transfer. If all refresh fails, no write/deploy.
- [x] Guard current default branch revision before write/deploy, never force push; stage only allowed configured snapshot JSON. Deploy exact previously checked dist. Serialize publication.
- [x] Document fresh start, Node setup, config/exclusion examples, validation/promote flow, custom-domain/root base, GitHub Pages settings, branch protection failure, schedule constraints. Add join Issue template.

Validation: inspect YAML/exact allowlist/read-only PR conditions and official action docs. Do not change remote settings or publish.

## Task 5 — Integration and acceptance (controller + independent reviewer)

- [x] Implement promotion and dist checks with meaningful failure tests where necessary.
- [x] Refresh real four feeds with bounded calls, validate candidate build then promote. Only new feed entries become data.
- [x] Run offline unit tests, Astro type check, production builds/checks for `/` and `/BaiyunUBlogroll/`.
- [x] Test desktop/mobile320px, long text, search beyond static first page, source filters, URL restoration, keyboard and no-JS navigation in a real browser.
- [x] Independently review spec compliance and code/publish correctness; resolve material findings and rerun relevant checks.
- [x] Update implementation status/evidence in docs and local progress ledger. Deliver local preview and explicitly distinguish local validation from deployment.
