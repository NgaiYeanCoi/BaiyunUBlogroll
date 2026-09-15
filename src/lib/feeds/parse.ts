import { createHash } from 'node:crypto';
import Parser from 'rss-parser';
import { decodeHTML } from 'entities';
import type { Article, Source } from '../types';
import { normalizeUrl } from '../catalog/schema';
import { parseDate } from '../catalog/dates';
export { normalizeUrl } from '../catalog/schema';

function stringValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && '_' in value) return stringValue(value._);
  return '';
}
export function plainText(value: unknown): string {
  // External content is always rendered as text. Remove markup before entity decoding so literal &lt; examples survive.
  return decodeHTML(
    stringValue(value)
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\s+/gu, ' ')
    .trim();
}
type ParsedItem = Parser.Item & {
  parserError?: string;
  atom?: boolean;
  rawPublished?: unknown;
  rawUpdated?: unknown;
  author?: unknown;
  id?: unknown;
  'dc:date'?: unknown;
  'content:encoded'?: unknown;
};
type XmlEntry = Record<string, unknown[]>;
class DatePreservingParser extends Parser<Record<string, unknown>, ParsedItem> {
  parseItemAtom(entry: XmlEntry): ParsedItem {
    // rss-parser 3.13 coerces Atom dates and substitutes updated for published. Bypass only that behavior;
    // raw dates are validated by our model, so one invalid date cannot make the entire feed fail.
    const base = Parser.prototype as unknown as { parseItemAtom(entry: XmlEntry): ParsedItem };
    try {
      const item = base.parseItemAtom.call(this, { ...entry, published: [], updated: [] });
      return {
        ...item,
        atom: true,
        rawPublished: entry.published?.[0],
        rawUpdated: entry.updated?.[0],
      };
    } catch {
      return { parserError: 'Malformed Atom entry' };
    }
  }
  parseItemRss(entry: XmlEntry, fields: unknown): ParsedItem {
    // A damaged item is not a failed source when valid neighboring records remain usable.
    const base = Parser.prototype as unknown as {
      parseItemRss(entry: XmlEntry, fields: unknown): ParsedItem;
    };
    try {
      return base.parseItemRss.call(this, entry, fields);
    } catch {
      return { parserError: 'Malformed RSS item' };
    }
  }
}
export async function parseFeed(
  xml: string,
  source: Source,
): Promise<{ articles: Article[]; diagnostics: string[] }> {
  // Reject DTDs rather than accepting external entity or expansion semantics from future parser updates.
  if (/<!DOCTYPE|<!ENTITY/i.test(xml))
    throw new Error('Feed contains unsupported DTD/entity declarations');
  const parser = new DatePreservingParser({
    customFields: {
      item: [['updated', 'rawUpdated'], ['dc:date', 'rawPublished'], 'author', 'content:encoded'],
    },
  });
  const feed = await parser.parseString(xml);
  const articles: Article[] = [];
  const diagnostics: string[] = [];
  for (const [index, item] of feed.items.entries()) {
    if (item.parserError) {
      diagnostics.push(`Item ${index + 1}: ${item.parserError}`);
      continue;
    }
    const url = normalizeUrl(item.link);
    if (!url) {
      diagnostics.push(`Item ${index + 1}: invalid or missing HTTP(S) link`);
      continue;
    }
    const title = plainText(item.title);
    const publishedRaw = item.atom ? item.rawPublished : (item.pubDate ?? item.rawPublished);
    const published = parseDate(stringValue(publishedRaw));
    const updated = parseDate(stringValue(item.rawUpdated));
    for (const [label, raw, parsed] of [
      ['published', publishedRaw, published],
      ['updated', item.rawUpdated, updated],
    ]) {
      if (stringValue(raw) && !parsed)
        diagnostics.push(
          `Item ${index + 1}: invalid ${label} date ${JSON.stringify(stringValue(raw).slice(0, 160))}`,
        );
    }
    const author = plainText(item.author ?? item.creator);
    const guid = stringValue(item.guid ?? item.id).trim();
    articles.push({
      id: `${source.id}-${createHash('sha256').update(`${source.id}\n${url}`).digest('hex').slice(0, 24)}`,
      sourceId: source.id,
      url,
      title,
      summary: plainText(item.summary || item.content || item['content:encoded']),
      ...(author ? { author } : {}),
      guids: guid ? [guid] : [],
      urlAliases: [],
      published,
      updated,
    });
  }
  if (!articles.length) throw new Error('Feed has zero valid articles');
  return { articles, diagnostics };
}
