import type { PostStatus } from "../types";

/** Something a blog post is allowed to link to: a site page or another post. */
export type LinkDestination = {
  kind: "post" | "page";
  /** Site-relative URL, e.g. "/blog/some-post" or "/window-film". */
  href: string;
  title: string;
  /** Excerpt / meta description. Shown in previews and used for search. */
  description: string;
  /** Phrases that may be used as anchor text. Empty = searchable, never auto-suggested. */
  keywords: string[];
  /** Pages are always live; a post can still be a draft (and then isn't linkable). */
  status: PostStatus;
  /** Posts only. */
  id?: string;
  /** Category name for posts, "Page" for site pages. */
  group: string;
};

/** One proposed link, in terms of the document that was scanned. */
export type LinkSuggestion = {
  id: string;
  /** ProseMirror positions of the anchor text in the scanned document. */
  from: number;
  to: number;
  anchor: string;
  /** Surrounding text from the same paragraph, for the preview. */
  before: string;
  after: string;
  destination: Pick<LinkDestination, "kind" | "href" | "title" | "group">;
  /** Why this was suggested, in plain words. */
  reason: string;
  score: number;
};

/** Identifies the post being edited so it is never offered a link to itself. */
export type LinkSource = {
  /** Undefined while the post is still unsaved. */
  id?: string;
  /** Read live from the form, since the slug can be edited. */
  slug?: string;
};
