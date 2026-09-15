/** Dates without time zones retain their calendar meaning; collection time is never an article date. */
export type ArticleDate = { kind: 'instant' | 'date' | 'local'; value: string; raw: string };
export type Source = {
  id: string;
  name: string;
  siteUrl: string;
  feedUrl: string;
  avatarUrl?: string;
  enabled: boolean;
  description?: string;
};
export type Article = {
  id: string;
  sourceId: string;
  url: string;
  title: string;
  summary: string;
  author?: string;
  guids: string[];
  urlAliases: string[];
  published: ArticleDate | null;
  updated: ArticleDate | null;
};
/** Withdrawn identities retain matching aliases without preserving withdrawn titles or summaries. */
export type ArticleIdentity = Pick<Article, 'id' | 'url' | 'guids' | 'urlAliases'>;
export type FeedSnapshot = {
  schemaVersion: 1;
  sourceId: string;
  contentChangedAt: string | null;
  articles: Article[];
  tombstones?: ArticleIdentity[];
};
/** Tombstones are independent of feed snapshots so a repeated fetch cannot silently restore an article. */
export type Exclusions = {
  sources: string[];
  articles: { sourceId: string; ids?: string[]; urls?: string[]; guids?: string[] }[];
};
export type Catalog = {
  sources: Source[];
  articles: Article[];
  dataVersion: string;
  changedAt: string | null;
};
export type SourceResult = {
  sourceId: string;
  status: 'success' | 'failed' | 'paused' | 'excluded';
  articleCount: number;
  diagnostics: string[];
};
export type RefreshReport = {
  status: 'success' | 'degraded' | 'failed';
  checkedAt: string;
  sources: SourceResult[];
};
