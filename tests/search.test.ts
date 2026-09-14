import { describe, expect, it } from 'vitest';
import {
  readSearchState,
  searchArticles,
  searchPage,
  searchStateUrl,
} from '../src/lib/catalog/search';
import type { Article, Source } from '../src/lib/types';

const sources: Source[] = [
  {
    id: 'nyc',
    name: "NgaiYeanCoi's blog",
    siteUrl: 'https://blog.nyc1.xyz/',
    feedUrl: 'https://blog.nyc1.xyz/atom.xml',
    enabled: true,
  },
  {
    id: 'toho',
    name: '西行妖',
    siteUrl: 'https://my.toho.red/',
    feedUrl: 'https://my.toho.red/index.xml',
    enabled: true,
  },
];

function article(id: string, sourceId: string, overrides: Partial<Article> = {}): Article {
  return {
    id,
    sourceId,
    url: `https://example.com/${id}`,
    title: `文章 ${id}`,
    summary: '',
    guids: [],
    urlAliases: [],
    published: null,
    updated: null,
    ...overrides,
  };
}

const articles = [
  article('a', 'nyc', { title: 'Astro 静态站实践', summary: '一份部署记录', author: 'Alice' }),
  article('b', 'toho', { title: '校园日常', summary: '关于社团和摄影', author: '西行妖' }),
  article('c', 'nyc', { title: '网络排障笔记', summary: 'DNS 与路由', author: 'Bob' }),
];

describe('searchArticles', () => {
  it('searches title, summary, article author, and source name case-insensitively', () => {
    expect(searchArticles(articles, sources, '  ASTRO ', 'all').map(({ id }) => id)).toEqual(['a']);
    expect(searchArticles(articles, sources, '摄影', 'all').map(({ id }) => id)).toEqual(['b']);
    expect(searchArticles(articles, sources, 'alice', 'all').map(({ id }) => id)).toEqual(['a']);
    expect(searchArticles(articles, sources, 'ngaiyeancoi', 'all').map(({ id }) => id)).toEqual([
      'a',
      'c',
    ]);
  });

  it('combines source filtering with the query and accepts an empty source filter', () => {
    expect(searchArticles(articles, sources, '文章', 'nyc')).toEqual([]);
    expect(searchArticles(articles, sources, '路由', 'nyc').map(({ id }) => id)).toEqual(['c']);
    expect(searchArticles(articles, sources, '', '').map(({ id }) => id)).toEqual(['a', 'b', 'c']);
  });

  it('returns a new array without reordering or mutating the catalog', () => {
    const before = [...articles];
    const result = searchArticles(articles, sources, '', 'all');
    expect(result).toEqual(before);
    expect(result).not.toBe(articles);
    expect(articles).toEqual(before);
  });

  it('does not make an unknown source selectable through a query match', () => {
    expect(searchArticles(articles, sources, '', 'missing')).toEqual([]);
  });

  it('searches the full catalog before pagination and clamps empty or out-of-range pages', () => {
    const many = Array.from({ length: 25 }, (_, index) =>
      article(String(index), 'nyc', { title: index === 24 ? '最后一篇命中' : `文章 ${index}` }),
    );
    const matches = searchArticles(many, sources, '最后一篇', 'all');
    expect(matches.map(({ id }) => id)).toEqual(['24']);
    expect(searchPage(many, 2).items).toHaveLength(5);
    expect(searchPage(matches, 9)).toMatchObject({ page: 1, pageCount: 1 });
    expect(searchPage([], 2)).toEqual({ items: [], page: 1, pageCount: 1 });
  });

  it('restores valid query state and serializes a shareable base-path URL', () => {
    const restored = readSearchState(
      new URLSearchParams('q=%20Astro%20&source=nyc&page=3'),
      1,
      sources,
    );
    expect(restored).toEqual({ query: 'Astro', sourceId: 'nyc', page: 3 });
    expect(searchStateUrl('/BaiyunUBlogroll/', 'https://example.com', restored).toString()).toBe(
      'https://example.com/BaiyunUBlogroll/?q=Astro&source=nyc&page=3',
    );
    expect(readSearchState(new URLSearchParams('source=missing&page=nope'), 2, sources)).toEqual({
      query: '',
      sourceId: 'all',
      page: 2,
    });
  });
});
