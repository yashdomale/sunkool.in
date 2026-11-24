export const BLOG_PREFIX = "/blog/";

const SITE_ORIGIN = /^https?:\/\/(?:www\.)?sunkool\.in(?=[/?#]|$)/i;

export const postHref = (slug: string) => `${BLOG_PREFIX}${slug}`;

/** "/blog/<slug>" → slug. Anything deeper or elsewhere is not a post URL. */
export function slugFromPath(path: string): string | null {
  if (!path.startsWith(BLOG_PREFIX)) return null;
  const slug = path.slice(BLOG_PREFIX.length);
  return slug && !slug.includes("/") ? slug : null;
}

/**
 * Splits a link into the part that decides where it goes (`path`) and the
 * part that doesn't (`?query` / `#hash`) — or null when it points off-site.
 * Both "/ppf" and "https://www.sunkool.in/ppf/" are the site page "/ppf".
 */
export function splitSiteHref(href: string): { path: string; suffix: string } | null {
  let value = href.trim();
  if (SITE_ORIGIN.test(value)) {
    value = value.replace(SITE_ORIGIN, "");
    if (!value.startsWith("/")) value = `/${value}`; // "https://sunkool.in" and "https://sunkool.in?x=1"
  }
  if (!value.startsWith("/") || value.startsWith("//")) return null;

  const cut = value.search(/[?#]/);
  let path = cut === -1 ? value : value.slice(0, cut);
  const suffix = cut === -1 ? "" : value.slice(cut);
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  return { path, suffix };
}

/** The site path a link points at, or null for external, mailto:, tel: and "#anchor" links. */
export function toSitePath(href: string): string | null {
  return splitSiteHref(href)?.path ?? null;
}

/**
 * Turns what was typed into a safe href, or null if it isn't one. Bare
 * domains get https://, and anything with a scheme other than http(s),
 * mailto or tel (javascript:, data:, …) is rejected.
 */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return null;
  if ((value.startsWith("/") && !value.startsWith("//")) || value.startsWith("#")) return value;
  if (/^(mailto|tel):./i.test(value)) return value;
  // "host:8080" is a port, not a scheme, so only a colon not followed by a digit counts.
  if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(value) && !/^https?:\/\//i.test(value)) return null;

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value.replace(/^\/\//, "")}`;
  try {
    const { hostname } = new URL(candidate);
    return hostname.includes(".") || hostname === "localhost" ? candidate : null;
  } catch {
    return null;
  }
}

/**
 * The web address in text typed into the link dialog's search box, or null when
 * it is a search for a page or post. Only text that is plainly an address counts
 * — a scheme, "www.", or a bare domain, with no spaces — so "window film" or
 * "PPF" still search, while "https://www.sunkool.in" is linked as typed instead
 * of being matched against page titles.
 */
export function typedAddress(raw: string): string | null {
  const value = raw.trim();
  const isAddress =
    /^(?:https?:\/\/|mailto:|tel:|www\.)/i.test(value) ||
    /^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:[/:?#]\S*)?$/i.test(value);
  return isAddress ? normalizeUrl(value) : null;
}
