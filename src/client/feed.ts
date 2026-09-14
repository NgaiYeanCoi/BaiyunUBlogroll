import type { Article, Catalog, Source } from '../lib/types';
import { displayDate } from '../lib/catalog/dates';
import { readSearchState, searchArticles, searchPage, searchStateUrl } from '../lib/catalog/search';
import { summaryExcerpt } from './text';

const PAGE_SIZE = 20;

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function externalLink(className: string, text: string, href: string): HTMLAnchorElement {
  const link = createElement('a', className, text);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function externalIcon(): SVGSVGElement {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  const path = document.createElementNS(namespace, 'path');
  path.setAttribute('d', 'M7 17 17 7M8 7h9v9');
  icon.append(path);
  return icon;
}

function renderArticle(article: Article, source?: Source): HTMLElement {
  const card = createElement('article', 'post-card');
  const meta = createElement('div', 'post-meta');
  meta.append(
    createElement('span', 'meta-dot'),
    createElement('span', '', source?.name ?? article.author ?? '未知博客'),
  );
  if (article.author && article.author !== source?.name)
    meta.append(createElement('span', '', `· ${article.author}`));
  const selectedDate = article.updated ?? article.published;
  const date = createElement('time', 'post-date', displayDate(selectedDate) || '日期未知');
  if (selectedDate) date.dateTime = selectedDate.value;
  const dateKind = article.updated ? '更新日期' : article.published ? '发表日期' : '日期未知';
  const accessibleDate = selectedDate ? `${dateKind}：${date.textContent}` : dateKind;
  date.title = accessibleDate;
  date.setAttribute('aria-label', accessibleDate);
  meta.append(date);

  const heading = createElement('h3');
  heading.append(externalLink('', article.title, article.url));
  card.append(meta, heading);
  if (article.summary)
    card.append(createElement('p', 'post-summary', summaryExcerpt(article.summary)));
  const bottom = createElement('div', 'post-bottom');
  const readLink = externalLink('text-link', '阅读原文', article.url);
  readLink.append(externalIcon());
  bottom.append(readLink);
  card.append(bottom);
  return card;
}

async function startFeed(): Promise<void> {
  const root = document.querySelector<HTMLElement>('[data-feed-app]');
  if (!root) return;
  const queryInput = root.querySelector<HTMLInputElement>('[data-query]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-clear]');
  const form = root.querySelector<HTMLFormElement>('[data-search-form]');
  const list = root.querySelector<HTMLElement>('[data-feed-list]');
  const count = root.querySelector<HTMLElement>('[data-result-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const status = root.querySelector<HTMLElement>('[data-search-status]');
  if (!queryInput || !clearButton || !form || !list || !count || !empty || !status) return;

  // Stable aliases retain DOM null checks inside the render callbacks below.
  const feedRoot = root;
  const searchInput = queryInput;
  const clearSearch = clearButton;
  const feedForm = form;
  const feedList = list;
  const resultCount = count;
  const emptyState = empty;
  const searchStatus = status;

  const response = await fetch(feedRoot.dataset.catalogUrl ?? 'catalog.json');
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const catalog = (await response.json()) as Catalog;
  const sourceById = new Map(catalog.sources.map((source) => [source.id, source]));
  let state = readSearchState(
    new URL(window.location.href).searchParams,
    Number(feedRoot.dataset.staticPage) || 1,
    catalog.sources,
  );
  let isComposing = false;

  searchInput.disabled = false;
  clearSearch.disabled = false;
  feedRoot.querySelectorAll<HTMLButtonElement>('[data-source]').forEach((button) => {
    button.disabled = false;
  });
  searchStatus.hidden = true;

  function stateUrl(page = state.page): URL {
    return searchStateUrl(feedRoot.dataset.baseUrl ?? '/', window.location.origin, {
      ...state,
      page,
    });
  }

  function setUrl(): void {
    history.replaceState(null, '', stateUrl());
  }

  function renderPagination(pageCount: number, activeSearch: boolean): void {
    const oldPagination = feedRoot.querySelector<HTMLElement>('[data-pagination]');
    if (pageCount <= 1) {
      oldPagination?.remove();
      return;
    }
    const nav = oldPagination ?? createElement('nav', 'pagination');
    nav.dataset.pagination = '';
    nav.setAttribute('aria-label', '文章分页');
    nav.replaceChildren();

    const link = (label: string, page: number, rel: string) => {
      const anchor = createElement('a', '', label);
      anchor.rel = rel;
      anchor.href = activeSearch
        ? stateUrl(page).toString()
        : page === 1
          ? (feedRoot.dataset.baseUrl ?? '/')
          : `${feedRoot.dataset.baseUrl ?? '/'}page/${page}/`;
      if (activeSearch)
        anchor.addEventListener('click', (event) => {
          event.preventDefault();
          state.page = page;
          setUrl();
          render();
          feedRoot.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
          });
        });
      return anchor;
    };
    if (state.page > 1) nav.append(link('上一页', state.page - 1, 'prev'));
    nav.append(createElement('span', '', `第 ${state.page} / ${pageCount} 页`));
    if (state.page < pageCount) nav.append(link('下一页', state.page + 1, 'next'));
    if (!oldPagination) feedRoot.querySelector('section')?.append(nav);
  }

  function render(): void {
    const matches = searchArticles(catalog.articles, catalog.sources, state.query, state.sourceId);
    const resultPage = searchPage(matches, state.page, PAGE_SIZE);
    state.page = resultPage.page;
    feedList.replaceChildren(
      ...resultPage.items.map((article) =>
        renderArticle(article, sourceById.get(article.sourceId)),
      ),
    );
    const first = matches.length === 0 ? 0 : (state.page - 1) * PAGE_SIZE + 1;
    const last = Math.min(state.page * PAGE_SIZE, matches.length);
    resultCount.textContent = `${matches.length} 篇 · ${first}–${last}`;
    emptyState.hidden = matches.length !== 0;
    clearSearch.hidden = state.query.length === 0;
    searchInput.value = state.query;
    feedRoot.querySelectorAll<HTMLButtonElement>('[data-source]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.source === state.sourceId));
    });
    renderPagination(resultPage.pageCount, Boolean(state.query || state.sourceId !== 'all'));
  }

  searchInput.addEventListener('input', () => {
    if (isComposing) return;
    state.query = searchInput.value;
    state.page = 1;
    setUrl();
    render();
  });
  searchInput.addEventListener('compositionstart', () => {
    isComposing = true;
  });
  searchInput.addEventListener('compositionend', () => {
    isComposing = false;
    state.query = searchInput.value;
    state.page = 1;
    setUrl();
    render();
  });
  clearSearch.addEventListener('click', () => {
    state.query = '';
    state.page = 1;
    setUrl();
    render();
    searchInput.focus();
  });
  feedForm.addEventListener('submit', (event) => event.preventDefault());
  feedRoot.querySelectorAll<HTMLButtonElement>('[data-source]').forEach((button) =>
    button.addEventListener('click', () => {
      state.sourceId = button.dataset.source ?? 'all';
      state.page = 1;
      setUrl();
      render();
    }),
  );
  window.addEventListener('popstate', () => {
    const restored = new URL(window.location.href);
    state = readSearchState(restored.searchParams, 1, catalog.sources);
    render();
  });
  render();
}

startFeed().catch((error: unknown) => {
  // Static HTML stays usable if the optional browser index cannot be loaded.
  const status = document.querySelector<HTMLElement>('[data-search-status]');
  if (status) status.textContent = '搜索索引暂不可用，仍可浏览当前静态文章和分页。';
  console.error(error);
});
