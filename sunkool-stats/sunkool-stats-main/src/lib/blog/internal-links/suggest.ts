import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { collectSitePaths } from "./doc-links";
import { compilePhrase, phraseCouldMatch, phraseSpecsFor, profileTokens, SOURCE_WEIGHT, type Phrase } from "./phrases";
import { contentTokens, normalizeSpaces, tokenize } from "./text";
import type { LinkDestination, LinkSource, LinkSuggestion } from "./types";
import { postHref } from "./urls";

export type SuggestOptions = {
  /** Most suggestions to return. */
  limit?: number;
  /** Most suggestions in one paragraph, so a link-heavy sentence doesn't read as spam. */
  perParagraph?: number;
};

const DEFAULT_LIMIT = 10;
const DEFAULT_PER_PARAGRAPH = 2;
const CONTEXT_CHARS = 56;
const MIN_TITLE_EVIDENCE = 3;

/** "Nano-Ceramic  Film", "nano ceramic film" and "nano ceramic films" are the same phrase. */
const phraseKey = (phrase: string) =>
  normalizeSpaces(phrase.replace(/-/g, " "))
    .toLowerCase()
    .replace(/(?<=\w{3})(?<!s)e?s$/, "");

/** A stretch of plain, linkable text inside one paragraph. */
type Segment = { start: number; text: string; lower: string; block: number; blockEnd: number };

type Candidate = {
  destination: LinkDestination;
  phrase: Phrase;
  from: number;
  to: number;
  anchor: string;
  score: number;
  corroboration: string[];
  block: number;
  blockEnd: number;
};

/**
 * Stretches of paragraph text that can take a new link. Headings, code blocks,
 * and anything already linked or marked as code are left alone, as are
 * hard breaks and images (they split a stretch in two). Formatting such as
 * bold or italic does not split a stretch, so a phrase can span "heat **control**
 * film" — the link goes over the whole phrase and keeps the bold.
 */
function collectSegments(doc: ProseMirrorNode): Segment[] {
  const { link, code } = doc.type.schema.marks;
  const segments: Segment[] = [];

  doc.descendants((node, pos) => {
    if (!node.isTextblock) return true;
    if (node.type.name !== "paragraph") return false;

    let open: Segment | undefined;
    node.forEach((child, offset) => {
      const childPos = pos + 1 + offset;
      const blocked = !child.isText || child.marks.some((mark) => mark.type === link || mark.type === code);
      if (blocked) {
        open = undefined;
        return;
      }
      const text = child.text ?? "";
      if (open) {
        open.text += text;
        open.lower += text.toLowerCase();
      } else {
        open = { start: childPos, text, lower: text.toLowerCase(), block: pos, blockEnd: pos + node.nodeSize };
        segments.push(open);
      }
    });
    return false;
  });
  return segments;
}

/** Why a destination was suggested, in the words an editor would use. */
function reasonFor({ destination, phrase, corroboration }: Candidate) {
  switch (phrase.source) {
    case "page-keyword":
      return `"${phrase.text}" is what the ${destination.title} page is about`;
    case "post-title":
      return `Matches the title of the post "${destination.title}"`;
    case "post-keyword":
      return `"${phrase.text}" is a keyword of the post "${destination.title}"`;
    default:
      return `Words from the title of "${destination.title}"${corroboration.length ? `; this post also mentions ${corroboration.join(", ")}` : ""}`;
  }
}

function clip(text: string, side: "before" | "after") {
  const clean = text.replace(/\s+/g, " ");
  if (clean.length <= CONTEXT_CHARS) return clean;
  const piece = side === "before" ? clean.slice(-CONTEXT_CHARS) : clean.slice(0, CONTEXT_CHARS);
  // Cut on a word boundary so the preview doesn't start or end mid-word.
  const trimmed = side === "before" ? piece.replace(/^\S*\s/, "") : piece.replace(/\s\S*$/, "");
  return side === "before" ? `…${trimmed}` : `${trimmed}…`;
}

/**
 * Finds places in a post where a link to another page or post would help a
 * reader, and returns them for review — it changes nothing.
 *
 * A destination is only considered if it's a published post or a real page,
 * isn't the post being edited, and isn't already linked from this post. Each
 * destination gets at most one link (its best-scoring spot), no two links share
 * an anchor text or overlap, and no paragraph gets more than a couple. Text
 * that is already a link, a heading, or code is never touched.
 */
export function suggestInternalLinks(
  doc: ProseMirrorNode,
  destinations: LinkDestination[],
  source: LinkSource = {},
  options: SuggestOptions = {}
): LinkSuggestion[] {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const perParagraph = options.perParagraph ?? DEFAULT_PER_PARAGRAPH;

  const alreadyLinked = new Set(collectSitePaths(doc.toJSON()));
  const selfPath = source.slug ? postHref(source.slug) : null;
  const eligible = destinations.filter(
    (d) =>
      d.status === "published" &&
      !alreadyLinked.has(d.href) &&
      d.href !== selfPath &&
      !(source.id && d.id === source.id)
  );
  if (eligible.length === 0) return [];

  const segments = collectSegments(doc);
  if (segments.length === 0) return [];
  const docTopicWords = new Set(contentTokens(doc.textBetween(0, doc.content.size, " ")));
  // A phrase a site page is about ("paint protection film") belongs to that page. A post that
  // happens to list it as a keyword must not take it over — not even when the page itself is
  // skipped because this post already links to it.
  const pageOwnedPhrases = new Set(
    destinations.filter((d) => d.kind === "page").flatMap((d) => d.keywords.map(phraseKey))
  );

  // Every word in the text that can take a link. A phrase with a word that isn't here can't match,
  // which rules out nearly every phrase of nearly every destination without building a regex.
  const docWords = new Set<string>();
  for (const segment of segments) for (const word of tokenize(segment.lower)) docWords.add(word);

  const candidates: Candidate[] = [];
  for (const destination of eligible) {
    const possible = phraseSpecsFor(destination).filter(
      (spec) =>
        phraseCouldMatch(spec.text, docWords) &&
        !(destination.kind === "post" && pageOwnedPhrases.has(phraseKey(spec.text)))
    );
    if (possible.length === 0) continue;

    const profile = profileTokens(destination);
    const titleTopic = contentTokens(destination.title);
    for (const spec of possible) {
      const phrase = compilePhrase(spec);
      const phraseWords = new Set(contentTokens(phrase.text));
      // Words from a title are only a hint. Accept them when they are the title's whole topic
      // ("Safety Glazing" from "Safety Glazing for Cars Explained"), or when three of its topic
      // words are in play: the phrase's own plus others this post also uses. "Maruti Suzuki"
      // alone could be about anything; in a post that also says "Baleno" it is on topic.
      const corroboration = [...profile].filter((word) => !phraseWords.has(word) && docTopicWords.has(word));
      const coversTitle = titleTopic.length > 0 && titleTopic.every((word) => phraseWords.has(word));
      if (phrase.source === "title-words" && !coversTitle && phraseWords.size + corroboration.length < MIN_TITLE_EVIDENCE) continue;

      for (const segment of segments) {
        if (!(phrase.caseSensitive ? segment.text : segment.lower).includes(phrase.firstWord)) continue;
        phrase.regex.lastIndex = 0;
        for (let match = phrase.regex.exec(segment.text); match; match = phrase.regex.exec(segment.text)) {
          const from = segment.start + match.index;
          candidates.push({
            destination,
            phrase,
            from,
            to: from + match[0].length,
            anchor: match[0],
            // Specific, authoritative phrases first; shared topic words and an earlier position break ties.
            score:
              SOURCE_WEIGHT[phrase.source] +
              Math.min(phrase.wordCount, 4) * 1.5 +
              Math.min(corroboration.length, 6) * 0.5 -
              from / 1e7,
            corroboration: corroboration.slice(0, 3),
            block: segment.block,
            blockEnd: segment.blockEnd,
          });
        }
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score || a.from - b.from);

  const accepted: Candidate[] = [];
  const usedDestinations = new Set<string>();
  const usedAnchors = new Set<string>();
  const perBlock = new Map<number, number>();

  for (const candidate of candidates) {
    if (accepted.length >= limit) break;
    // Keyed on the phrase, not the literal text, so "paint protection film" and
    // "Paint Protection Films" count as the same anchor.
    const anchorKey = phraseKey(candidate.phrase.text);
    if (
      usedDestinations.has(candidate.destination.href) ||
      usedAnchors.has(anchorKey) ||
      (perBlock.get(candidate.block) ?? 0) >= perParagraph ||
      accepted.some((other) => candidate.from < other.to && other.from < candidate.to)
    ) {
      continue;
    }
    accepted.push(candidate);
    usedDestinations.add(candidate.destination.href);
    usedAnchors.add(anchorKey);
    perBlock.set(candidate.block, (perBlock.get(candidate.block) ?? 0) + 1);
  }

  return accepted
    .sort((a, b) => a.from - b.from)
    .map((candidate) => ({
      id: `${candidate.from}-${candidate.to}-${candidate.destination.href}`,
      from: candidate.from,
      to: candidate.to,
      anchor: candidate.anchor,
      before: clip(doc.textBetween(candidate.block + 1, candidate.from), "before"),
      after: clip(doc.textBetween(candidate.to, candidate.blockEnd - 1), "after"),
      destination: {
        kind: candidate.destination.kind,
        href: candidate.destination.href,
        title: candidate.destination.title,
        group: candidate.destination.group,
      },
      reason: reasonFor(candidate),
      score: Math.round(candidate.score * 10) / 10,
    }));
}
