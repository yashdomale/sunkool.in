/**
 * Resolves a stored image reference to an absolute URL for og:image, twitter:image and JSON-LD.
 *
 * `posts.cover_image` holds either a site-relative path (the bundled articles, e.g.
 * `/blog/restored/x.png`) or a full Supabase Storage URL (everything uploaded through the editor).
 * Prefixing the site origin onto the second kind produces `https://www.sunkool.inhttps://...`, so
 * only references that are not already absolute get the origin.
 */
export function absoluteUrl(value: string, base: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return new URL(trimmed, base).toString();
}
