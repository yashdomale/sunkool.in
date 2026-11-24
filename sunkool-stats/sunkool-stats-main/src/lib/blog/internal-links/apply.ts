import type { Schema } from "@tiptap/pm/model";
import type { Transaction } from "@tiptap/pm/state";
import { collectSitePaths } from "./doc-links";
import type { LinkSuggestion } from "./types";
import { splitSiteHref, toSitePath } from "./urls";

export type SkippedSuggestion = { suggestion: LinkSuggestion; reason: string };

/**
 * The attributes for a link to somewhere on this site. Same-tab and with the
 * referrer intact — unlike the editor's default for typed links
 * (target="_blank", rel="noopener noreferrer"), which suits other websites.
 */
export const INTERNAL_LINK_ATTRS = { target: null, rel: null } as const;

/**
 * Every attribute a link should carry, spelled out. Tiptap's setLink merges the
 * existing link's attributes underneath the ones given, so leaving `target` and
 * `rel` unsaid would let an edited link keep the previous kind's values (an
 * internal link turned external would stay same-tab). External links get the
 * editor's own defaults, read from the schema so they can't drift from its config.
 */
export function linkAttrsFor(schema: Schema, href: string) {
  if (toSitePath(href) !== null) return { href, ...INTERNAL_LINK_ATTRS };
  const { target, rel } = schema.marks.link.create({ href }).attrs as { target: string | null; rel: string | null };
  return { href, target, rel };
}

/**
 * Adds the approved suggestions to a transaction as link marks. Only the link
 * mark is added: the text, and any bold/italic/etc. already on it, stay exactly
 * as they were, and no character moves, so every suggestion's position stays
 * valid however many are applied.
 *
 * The document is re-checked as it is now, not as it was when scanned — a
 * suggestion is skipped (and reported) if the text under it has changed, the
 * text has since become a link, or its destination is already linked.
 */
export function addSuggestedLinks(
  tr: Transaction,
  suggestions: LinkSuggestion[]
): { applied: LinkSuggestion[]; skipped: SkippedSuggestion[] } {
  const linkType = tr.doc.type.schema.marks.link;
  const linked = new Set(collectSitePaths(tr.doc.toJSON()));
  const applied: LinkSuggestion[] = [];
  const skipped: SkippedSuggestion[] = [];

  for (const suggestion of [...suggestions].sort((a, b) => a.from - b.from)) {
    const { from, to, anchor, destination } = suggestion;
    const skip = (reason: string) => skipped.push({ suggestion, reason });

    const target = splitSiteHref(destination.href);
    if (!target || !destination.href.startsWith("/")) {
      skip("Not a link to a page on this site.");
    } else if (from < 0 || to > tr.doc.content.size || from >= to || tr.doc.textBetween(from, to) !== anchor) {
      skip("The text changed since it was scanned.");
    } else if (tr.doc.rangeHasMark(from, to, linkType)) {
      skip("That text is already a link.");
    } else if (linked.has(target.path)) {
      skip("This post already links to that page.");
    } else {
      tr.addMark(from, to, linkType.create({ href: destination.href, ...INTERNAL_LINK_ATTRS }));
      linked.add(target.path);
      applied.push(suggestion);
    }
  }
  return { applied, skipped };
}
