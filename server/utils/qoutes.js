import { readFileSync } from 'node:fs';

export const data = JSON.parse(
  readFileSync(new URL('../data/data.json', import.meta.url), 'utf8'),
);

export function getQuote(mood, entryDate) {
  const list = data.moodQuotes[String(mood)];
  if (!list || !list.length) return null;

  const day = Number(entryDate.slice(8, 10));
  return list[day % list.length];
}
