/** Keep cards compact while retaining the complete summary in the searchable catalog. */
export function summaryExcerpt(summary: string, limit = 160): string {
  const characters = Array.from(summary);
  return characters.length <= limit ? summary : `${characters.slice(0, limit).join('')}…`;
}
