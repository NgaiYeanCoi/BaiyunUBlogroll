import type { Article, Exclusions } from '../types';
import { normalizeUrl } from './schema';
export function isExcluded(article: Article, exclusions: Exclusions): boolean {
  if (exclusions.sources.includes(article.sourceId)) return true;
  const urls = new Set([article.url, ...article.urlAliases].map(normalizeUrl));
  return exclusions.articles.some(
    (rule) =>
      rule.sourceId === article.sourceId &&
      (rule.ids?.includes(article.id) ||
        rule.urls?.some((url) => urls.has(normalizeUrl(url))) ||
        rule.guids?.some((guid) => article.guids.includes(guid))),
  );
}
