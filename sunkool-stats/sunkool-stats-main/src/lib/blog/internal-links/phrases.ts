import type { LinkDestination } from "./types";
import { contentTokens, escapeRegExp, isGenericToken, normalizeSpaces } from "./text";

export type PhraseSource = "page-keyword" | "post-keyword" | "post-title" | "title-words";

/** A phrase a destination may be linked on, before any matching machinery is built for it. */
export type PhraseSpec = { text: string; source: PhraseSource };

/** A phrase ready to search with. */
export type Phrase = PhraseSpec & {
  /** Compiled once; global, so callers reset lastIndex before use. */
  regex: RegExp;
  wordCount: number;
  /** First word (lowercase unless case-sensitive), used to skip segments that can't match before running the regex. */
  firstWord: string;
  caseSensitive: boolean;
};

export const SOURCE_WEIGHT: Record<PhraseSource, number> = {
  "post-title": 7,
  "page-keyword": 6,
  "post-keyword": 5,
  "title-words": 3,
};

const MAX_PHRASE_LENGTH = 90;
const MAX_NGRAM = 5;
/** Compiled phrases kept between scans; plenty for a library of thousands of posts, and bounded. */
const MAX_COMPILED = 20000;

/** "PPF", "IS 2553": short all-caps phrases only match in that case, so "ppf" inside other text isn't linked. */
const isAcronymPhrase = (phrase: string) => /^[A-Z0-9]+(?:\s[A-Z0-9]+)*$/.test(phrase) && /[A-Z]/.test(phrase);

const compiled = new Map<string, Phrase>();

/**
 * Builds the matcher for a phrase (cached — compiling a Unicode-aware regex is
 * by far the slowest step, so it is only done for phrases that could match).
 */
export function compilePhrase(spec: PhraseSpec): Phrase {
  const key = `${spec.source}\u0000${spec.text}`;
  const cached = compiled.get(key);
  if (cached) return cached;

  const words = spec.text.split(/[\s\-–—]+/).filter(Boolean);
  const caseSensitive = isAcronymPhrase(spec.text);
  // Any space or hyphen between the words matches ("nano ceramic" = "nano-ceramic"), and a plural
  // "s" is allowed on the last word ("window films") except for acronyms.
  const body = words.map(escapeRegExp).join("[\\s\\u00a0\\-–]+");
  const plural = caseSensitive ? "" : "(?:s|es)?";
  const phrase: Phrase = {
    ...spec,
    regex: new RegExp(`(?<![\\p{L}\\p{N}])${body}${plural}(?![\\p{L}\\p{N}])`, caseSensitive ? "gu" : "giu"),
    wordCount: words.length,
    firstWord: caseSensitive ? words[0] : words[0].toLowerCase(),
    caseSensitive,
  };
  if (compiled.size >= MAX_COMPILED) compiled.clear();
  compiled.set(key, phrase);
  return phrase;
}

/**
 * A cheap, conservative test run before compiling: could this phrase appear in
 * text whose words are `docWords` (lowercase)? It only ever says "no" when the
 * phrase certainly cannot match, so skipping those phrases changes no result.
 * The last word may carry a plural "s"/"es", as the matcher allows.
 */
export function phraseCouldMatch(text: string, docWords: ReadonlySet<string>): boolean {
  const words = text.split(/[\s\-–—]+/).filter(Boolean);
  return words.every((word, index) => {
    const parts = word.toLowerCase().match(/[\p{L}\p{N}]+/gu);
    if (!parts) return true; // nothing checkable ("&", "(" …): let the matcher decide
    return parts.every((part, partIndex) => {
      if (docWords.has(part)) return true;
      const isLast = index === words.length - 1 && partIndex === parts.length - 1;
      return isLast && (docWords.has(`${part}s`) || docWords.has(`${part}es`));
    });
  });
}

/** A title without its " | Sunkool" tail or trailing punctuation: how someone would write the post's name in a sentence. */
function cleanTitle(title: string) {
  return normalizeSpaces(title)
    .replace(/\s*[|–—-]\s*sunkool\s*$/i, "")
    .replace(/[\s?!.:;,]+$/, "");
}

/**
 * Word runs from a title that read like a topic ("Ceramic Shield" out of
 * "7 Powerful Reasons Why the Best Ceramic Shield for a Car Is Worth Every Rupee").
 * They must start and end on a meaningful word, contain at least two, and cover
 * a good share of the title's topic words — otherwise "Maruti Suzuki" alone would
 * point at one particular Baleno article.
 */
function titleWordRuns(title: string): string[] {
  const words = (cleanTitle(title).match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) ?? []).map((w) => w.replace(/['’]s$/i, ""));
  const topicWordCount = contentTokens(title).length;
  const runs: string[] = [];

  for (let start = 0; start < words.length; start++) {
    if (isGenericToken(words[start].toLowerCase())) continue;
    for (let end = start + 1; end < Math.min(words.length, start + MAX_NGRAM); end++) {
      if (isGenericToken(words[end].toLowerCase())) continue;
      const run = words.slice(start, end + 1);
      const topicWords = run.filter((w) => !isGenericToken(w.toLowerCase())).length;
      if (topicWords >= 2 && topicWords / Math.max(topicWordCount, 1) >= 0.5) runs.push(run.join(" "));
    }
  }
  return runs;
}

/** Whether a post-supplied phrase says enough about a topic to anchor a link on. */
function isSpecificPhrase(phrase: string) {
  return phrase.length <= MAX_PHRASE_LENGTH && contentTokens(phrase).length >= 2;
}

const specCache = new WeakMap<LinkDestination, PhraseSpec[]>();

/**
 * The phrases that may be used as anchor text for a destination, strongest
 * first. Site pages use their curated keywords as written. Posts use their
 * keyword field and title, but only phrases specific enough to mean something:
 * imported posts carry keywords like "car", "india" and "Technology" that would
 * otherwise link half the blog to one article.
 *
 * Depends only on the destination, so it is worked out once and remembered.
 */
export function phraseSpecsFor(destination: LinkDestination): PhraseSpec[] {
  const cached = specCache.get(destination);
  if (cached) return cached;

  const found = new Map<string, PhraseSpec>();
  const add = (text: string, source: PhraseSource) => {
    const clean = normalizeSpaces(text);
    if (!clean) return;
    const key = clean.toLowerCase();
    const existing = found.get(key);
    if (!existing || SOURCE_WEIGHT[source] > SOURCE_WEIGHT[existing.source]) found.set(key, { text: clean, source });
  };

  if (destination.kind === "page") {
    for (const keyword of destination.keywords) add(keyword, "page-keyword");
  } else {
    const title = cleanTitle(destination.title);
    const category = destination.group.toLowerCase();
    if (isSpecificPhrase(title)) add(title, "post-title");
    for (const keyword of destination.keywords) {
      const clean = normalizeSpaces(keyword);
      if (clean.toLowerCase() !== category && isSpecificPhrase(clean)) add(clean, "post-keyword");
    }
    for (const run of titleWordRuns(destination.title)) add(run, "title-words");
  }

  const specs = [...found.values()];
  specCache.set(destination, specs);
  return specs;
}

/** The topic words that characterise a destination, used to check a title-word match is on topic. */
export function profileTokens(destination: LinkDestination): Set<string> {
  return new Set([...contentTokens(destination.title), ...destination.keywords.flatMap((k) => contentTokens(k))]);
}
