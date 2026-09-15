import type { Article, ArticleDate } from '../types';
export function parseDate(raw: unknown): ArticleDate | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const value = raw.trim();
  const calendar =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?(Z|[+-]\d{2}:?\d{2})?$/i.exec(
      value,
    );
  if (calendar) {
    const [, y, m, d, hour, minute, second, zone] = calendar;
    const day = new Date(`${y}-${m}-${d}T00:00:00Z`);
    if (
      !Number.isFinite(day.getTime()) ||
      day.toISOString().slice(0, 10) !== `${y}-${m}-${d}` ||
      Number(hour ?? 0) > 23 ||
      Number(minute ?? 0) > 59 ||
      Number(second ?? 0) > 59 ||
      (zone && !hour)
    )
      return null;
    if (!hour) return { kind: 'date', value, raw };
    if (!zone) return { kind: 'local', value: value.replace(' ', 'T'), raw };
  } else {
    // RFC feed dates need both a real calendar day and an explicit zone; Date.parse alone rolls Feb 30 forward.
    const rfc =
      /^(?:[A-Za-z]{3},?\s+)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(?:[+-]\d{4}|GMT|UTC|UT|[ECMP][SD]T)$/i.exec(
        value,
      );
    if (!rfc) return null;
    const [, day, monthName, year, hour, minute, second] = rfc;
    const month =
      ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(
        monthName.toLowerCase(),
      ) + 1;
    if (
      !month ||
      !parseDate(`${year}-${String(month).padStart(2, '0')}-${day.padStart(2, '0')}`) ||
      +hour > 23 ||
      +minute > 59 ||
      +(second ?? 0) > 59
    )
      return null;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp)
    ? { kind: 'instant', value: new Date(timestamp).toISOString(), raw }
    : null;
}

export function displayDate(date: ArticleDate | null): string {
  if (!date) return '';
  if (date.kind !== 'instant') return date.value.slice(0, 10);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date.value));
}
export function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const ad = a.updated ?? a.published;
    const bd = b.updated ?? b.published;
    const day = displayDate(bd).localeCompare(displayDate(ad));
    if (day) return day;
    if (ad?.kind === 'instant' && bd?.kind === 'instant') {
      const time = Date.parse(bd.value) - Date.parse(ad.value);
      if (time) return time;
    } else if (ad?.kind === 'instant') return -1;
    else if (bd?.kind === 'instant') return 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}
