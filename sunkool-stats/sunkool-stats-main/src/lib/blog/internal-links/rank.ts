import { normalizeSpaces, tokenize } from "./text";
import type { LinkDestination } from "./types";

function scoreDestination(query: string, queryTokens: string[], destination: LinkDestination): number {
  const title = destination.title.toLowerCase();
  const href = destination.href.toLowerCase();
  const keywords = destination.keywords.map((keyword) => keyword.toLowerCase());
  let score = 0;

  if (title === query) score = 100;
  else if (keywords.includes(query)) score = 90;
  else if (title.startsWith(query)) score = 70;
  else if (keywords.some((keyword) => keyword.includes(query) || (keyword.length > 3 && query.includes(keyword)))) score = 55;
  else if (title.includes(query)) score = 45;
  else if (href.includes(query.replace(/\s+/g, "-"))) score = 35;

  if (score === 0 && queryTokens.length > 0) {
    // Every word of the query somewhere in the title, keywords or description.
    const haystack = tokenize(`${destination.title} ${destination.keywords.join(" ")} ${destination.description} ${destination.href}`);
    const present = queryTokens.filter((token) => haystack.some((word) => word.startsWith(token)));
    if (present.length === queryTokens.length) score = 20 + present.length;
  }

  // On a tie, the page that is the topic beats a post that merely mentions it.
  return score > 0 && destination.kind === "page" ? score + 0.5 : score;
}

/**
 * Orders destinations for the link dialog's search box: exact title or keyword
 * hits first, then partial hits, then anything whose text contains every word
 * typed. With no query, everything comes back in its given order.
 */
export function rankDestinations(query: string, destinations: LinkDestination[]): LinkDestination[] {
  const cleaned = normalizeSpaces(query).toLowerCase();
  if (!cleaned) return destinations;
  const queryTokens = tokenize(cleaned);

  return destinations
    .map((destination, index) => ({ destination, index, score: scoreDestination(cleaned, queryTokens, destination) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.destination);
}
