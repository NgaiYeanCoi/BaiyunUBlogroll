import type { Article, Source } from '../types';

export type SearchState = { query: string; sourceId: string; page: number };

function normalizeSearchValue(value: string): string {
  return value.trim().toLocaleLowerCase();
}

/** Search stays metadata-only: source names are included, but article bodies are never fetched or indexed. */
export function searchArticles(
  articles: Article[],
  sources: Source[],
  query: string,
  sourceId: string,
): Article[] {
  const normalizedQuery = normalizeSearchValue(query);
  const selectedSource = sourceId && sourceId !== 'all' ? sourceId : null;
  const sourceNames = new Map(sources.map((source) => [source.id, source.name]));

  if (selectedSource && !sourceNames.has(selectedSource)) return [];

  return articles.filter((item) => {
    if (selectedSource && item.sourceId !== selectedSource) return false;
    if (!normalizedQuery) return true;

    const haystack = [
      item.title,
      item.summary,
      item.author ?? '',
      sourceNames.get(item.sourceId) ?? '',
    ]
      .join('\n')
      .toLocaleLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function readSearchState(
  params: URLSearchParams,
  staticPage: number,
  sources: Source[],
): SearchState {
  const requestedSource = params.get('source') ?? 'all';
  const parsedPage = Number.parseInt(params.get('page') ?? '', 10);
  return {
    query: params.get('q')?.trim() ?? '',
    sourceId:
      requestedSource === 'all' || sources.some(({ id }) => id === requestedSource)
        ? requestedSource
        : 'all',
    page: Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : Math.max(1, staticPage),
  };
}

export function searchStateUrl(baseUrl: string, origin: string, state: SearchState): URL {
  const url = new URL(baseUrl, origin);
  const normalizedQuery = state.query.trim();
  if (normalizedQuery) url.searchParams.set('q', normalizedQuery);
  if (state.sourceId !== 'all') url.searchParams.set('source', state.sourceId);
  if (state.page > 1) url.searchParams.set('page', String(state.page));
  return url;
}

export function searchPage<T>(
  items: T[],
  requestedPage: number,
  pageSize = 20,
): { items: T[]; page: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pageCount };
}
