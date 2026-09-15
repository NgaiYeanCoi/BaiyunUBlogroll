import { z } from 'zod';
import { parseDate } from './dates';

export function normalizeUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}
const httpUrl = z
  .string()
  .refine((value) => normalizeUrl(value) !== null, 'Expected an absolute HTTP(S) URL');
const stableId = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/);
export const SourceSchema = z
  .object({
    id: stableId,
    name: z.string().trim().min(1),
    siteUrl: httpUrl,
    feedUrl: httpUrl,
    avatarUrl: httpUrl.optional(),
    enabled: z.boolean(),
    description: z.string().optional(),
  })
  .strict();
const ArticleDateSchema = z
  .object({ kind: z.enum(['instant', 'date', 'local']), value: z.string(), raw: z.string() })
  .strict()
  .refine((date) => {
    const parsed = parseDate(date.value);
    return parsed?.kind === date.kind && parsed.value === date.value;
  }, 'Invalid date value or kind');
export const ArticleSchema = z
  .object({
    id: stableId,
    sourceId: stableId,
    url: httpUrl,
    title: z.string().min(1),
    summary: z.string(),
    author: z.string().min(1).optional(),
    guids: z.array(z.string().min(1)),
    urlAliases: z.array(httpUrl),
    published: ArticleDateSchema.nullable(),
    updated: ArticleDateSchema.nullable(),
  })
  .strict();
const ArticleIdentitySchema = ArticleSchema.pick({
  id: true,
  url: true,
  guids: true,
  urlAliases: true,
});
export const FeedSnapshotSchema = z
  .object({
    schemaVersion: z.literal(1),
    sourceId: stableId,
    contentChangedAt: z.iso.datetime().nullable(),
    articles: z.array(ArticleSchema),
    tombstones: z.array(ArticleIdentitySchema).optional(),
  })
  .strict()
  .superRefine((snapshot, ctx) => {
    const ids = new Set<string>();
    const urls = new Set<string>();
    for (const article of snapshot.articles) {
      if (
        article.sourceId !== snapshot.sourceId ||
        ids.has(article.id) ||
        urls.has(normalizeUrl(article.url)!)
      )
        ctx.addIssue({
          code: 'custom',
          message: 'Duplicate article identity or mismatched source',
        });
      ids.add(article.id);
      urls.add(normalizeUrl(article.url)!);
    }
  });
export const ExclusionsSchema = z
  .object({
    sources: z.array(stableId),
    articles: z.array(
      z
        .object({
          sourceId: stableId,
          ids: z.array(stableId).optional(),
          urls: z.array(httpUrl).optional(),
          guids: z.array(z.string().min(1)).optional(),
        })
        .strict()
        .refine(
          (rule) => !!(rule.ids?.length || rule.urls?.length || rule.guids?.length),
          'An article exclusion needs an identifier',
        ),
    ),
  })
  .strict();
