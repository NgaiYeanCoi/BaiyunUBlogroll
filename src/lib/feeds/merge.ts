import type { Article, ArticleIdentity, Exclusions } from '../types';
import { isExcluded } from '../catalog/exclusions';
const unique = (values: string[]) => [...new Set(values)].sort();
export function mergeArticles(
  old: Article[],
  incoming: Article[],
  exclusions: Exclusions,
  identities: ArticleIdentity[] = [],
  sourceId = old[0]?.sourceId ?? incoming[0]?.sourceId ?? '',
) {
  // Retain only identity metadata for withdrawals. It can match URL/GUID moves on later runs;
  // removing its matching exclusion allows fresh feed content to restore the stable article ID.
  const articles: Article[] = [
    ...old.map((article) => ({ ...article })),
    ...identities.map((identity) => ({
      ...identity,
      sourceId,
      title: '',
      summary: '',
      published: null,
      updated: null,
    })),
  ];
  const diagnostics: string[] = [];
  let acceptedCount = 0;
  const incomingGuidUrls = new Map<string, Set<string>>();
  for (const article of incoming)
    for (const guid of article.guids) {
      const key = `${article.sourceId}\n${guid}`;
      const urls = incomingGuidUrls.get(key) ?? new Set<string>();
      urls.add(article.url);
      incomingGuidUrls.set(key, urls);
    }
  for (const next of incoming) {
    const sameSource = articles.filter((article) => article.sourceId === next.sourceId);
    const urlMatches = sameSource.filter((article) =>
      [article.url, ...article.urlAliases].includes(next.url),
    );
    // A repeated GUID on different URLs in the same feed is not reliable even on an empty first collection.
    const matchableGuids = next.guids.filter(
      (guid) => incomingGuidUrls.get(`${next.sourceId}\n${guid}`)?.size === 1,
    );
    if (matchableGuids.length !== next.guids.length)
      diagnostics.push(`GUID reused across incoming URLs for ${next.url}; matching by URL only`);
    const guidMatches = sameSource.filter((article) =>
      matchableGuids.some((guid) => article.guids.includes(guid)),
    );
    const matches = urlMatches.length ? urlMatches : guidMatches;
    if (matches.length > 1) {
      diagnostics.push(`Ambiguous identity for ${next.url}; existing articles preserved`);
      continue;
    }
    const previous = matches[0];
    if (!previous) {
      if (next.title) {
        articles.push(next);
        acceptedCount++;
      } else if (!next.title) diagnostics.push(`Missing title for new article ${next.url}`);
      continue;
    }
    const reliableGuids = next.guids.filter(
      (guid) => !sameSource.some((article) => article !== previous && article.guids.includes(guid)),
    );
    if (reliableGuids.length !== next.guids.length)
      diagnostics.push(`Conflicting GUID ignored for URL-matched article ${next.url}`);
    const merged = {
      ...previous,
      url: next.url,
      title: next.title || previous.title,
      summary: next.summary || previous.summary,
      author: next.author || previous.author,
      published: next.published ?? previous.published,
      updated: next.updated ?? previous.updated,
      guids: unique([...previous.guids, ...reliableGuids]),
      urlAliases: unique(
        [...previous.urlAliases, ...next.urlAliases, previous.url].filter(
          (url) => url !== next.url,
        ),
      ),
    };
    if (!merged.author) delete merged.author;
    // Count only usable incoming records after unique identity resolution, never retained history alone.
    if (merged.title) acceptedCount++;
    articles[articles.indexOf(previous)] = merged;
  }
  const sorted = articles.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const tombstones = sorted
    .filter((article) => isExcluded(article, exclusions))
    .map(({ id, url, guids, urlAliases }) => ({ id, url, guids, urlAliases }));
  return {
    articles: sorted.filter((article) => article.title && !isExcluded(article, exclusions)),
    tombstones,
    diagnostics,
    acceptedCount,
  };
}
