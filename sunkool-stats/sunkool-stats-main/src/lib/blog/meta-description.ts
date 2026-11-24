// The description search engines get for an article. Editors type the "meta description" by hand,
// and a title pasted into that box gives a snippet that says nothing new, so it counts as missing
// and the excerpt is used instead - the same fallback an empty box already gets.

// A description may be the title plus this many extra characters (a brand suffix, say) and still
// be a restatement of it.
const SUFFIX_ALLOWANCE = 12;

const words = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

/** True when `text` adds nothing to `title`: it is the title, a piece of it, or the title plus a short suffix. */
export function restatesTitle(text: string, title: string): boolean {
  const a = words(text);
  const t = words(title);
  if (!t) return false;
  return !a || t.includes(a) || (a.includes(t) && a.length - t.length <= SUFFIX_ALLOWANCE);
}

type DescribedPost = {
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string;
};

/** The editor's meta description, unless it only restates the article's title; then the excerpt. */
export function articleMetaDescription(post: DescribedPost): string {
  const own = post.metaDescription;
  if (!own || [post.metaTitle, post.title].some((title) => title && restatesTitle(own, title))) return post.excerpt;
  return own;
}
