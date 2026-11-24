// What search engines (and visitors) get for each /blog listing URL: the HTTP outcome, robots
// directive, canonical, title, description and heading. Pure on purpose - no Next, no database -
// so generateMetadata, the page and the sitemap share one rule and `npm test` can pin it down.
//
// Policy:
//   /blog                       index, canonical /blog
//   /blog?page=N                index, canonical /blog?page=N (N=1 is a duplicate of /blog)
//   /blog?category=<slug>       index only if the category has curated copy AND enough articles
//                               (below that it is thin: noindex,follow, still browsable)
//   /blog?q=<text>              noindex,follow - internal search results
//   unknown category, malformed or out-of-range ?page=    404
// Unknown parameters (utm_*, fbclid…) never reach the canonical, so they cannot spawn duplicates.

import { getCategoryCopy } from "./category-copy";

/** A category page is only worth indexing once it lists at least this many published articles. */
export const MIN_INDEXABLE_CATEGORY_POSTS = 2;

export const BLOG_DESCRIPTION =
  "Insights on window film, paint protection, heat-rejection technology and vehicle care from SUNKOOL.";

/**
 * The <title> of the main /blog listing; the root layout template appends the brand. It is the
 * umbrella over the category pages, so it must not echo any of their titles (listing-seo.test.ts).
 */
export const BLOG_TITLE = "Window Film, PPF & Car Care Insights";

type Param = string | string[] | undefined;
/** Next's `searchParams`: a repeated key (?page=2&page=3) arrives as an array. */
export type RawListingParams = { category?: Param; q?: Param; page?: Param };

export type ListingRequest = { category?: string; q?: string; page: number };
export type CategoryRef = { slug: string; name: string };

export type ListingCheck =
  | { ok: true; request: ListingRequest; category?: CategoryRef }
  | { ok: false };

const firstValue = (value: Param) => (Array.isArray(value) ? value[0] : value);

/** Canonical form: a positive whole number with no sign, decimals or leading zeros. */
const PAGE_PATTERN = /^[1-9]\d{0,3}$/;

/**
 * Normalises the raw query: first value of a repeated key, trimmed, category lower-cased, `page`
 * defaulting to 1. Returns null when `page` can never be a real page number. The category is not
 * checked against anything here - see validateListingParams.
 */
export function parseListingParams(raw: RawListingParams): ListingRequest | null {
  const rawPage = firstValue(raw.page);
  let page = 1;
  if (rawPage) {
    if (!PAGE_PATTERN.test(rawPage)) return null;
    page = Number(rawPage);
  }

  const q = firstValue(raw.q)?.trim() || undefined;
  const category = firstValue(raw.category)?.trim().toLowerCase() || undefined;
  return category ? { category, q, page } : { q, page };
}

/** parseListingParams, plus a requested `category` must be one of `categories`. */
export function validateListingParams(raw: RawListingParams, categories: CategoryRef[]): ListingCheck {
  const request = parseListingParams(raw);
  if (!request) return { ok: false };
  if (!request.category) return { ok: true, request };

  const category = categories.find((c) => c.slug === request.category);
  return category ? { ok: true, request, category } : { ok: false };
}

/** The site-relative URL of a listing, parameters in a fixed order. Page 1 has no `page` parameter. */
export function listingPath({ category, q, page }: { category?: string; q?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

/** The one rule for "is this category page good enough to index", shared with the sitemap. */
export function isIndexableCategory(slug: string, publishedCount: number): boolean {
  return getCategoryCopy(slug) !== undefined && publishedCount >= MIN_INDEXABLE_CATEGORY_POSTS;
}

export type ListingSeo = {
  kind: "ok";
  robots: { index: boolean; follow: true };
  /** Site-relative; resolved against metadataBase. */
  canonical: string;
  /** Bare title - the root layout template appends the brand. */
  title: string;
  description: string;
  eyebrow: string;
  /** Set on category pages; the plain blog keeps its own header. */
  heading?: { title: string; intro: string };
  totalPages: number;
};
export type ListingOutcome = ListingSeo | { kind: "not-found" };

export function describeListing(
  request: ListingRequest,
  category: CategoryRef | undefined,
  { total, pageSize }: { total: number; pageSize: number }
): ListingOutcome {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (request.page > totalPages) return { kind: "not-found" };

  const copy = category ? getCategoryCopy(category.slug) : undefined;
  const index = !request.q && (!category || isIndexableCategory(category.slug, total));

  const baseTitle = copy?.title ?? (category ? `${category.name} Articles` : BLOG_TITLE);
  const baseDescription =
    copy?.description ?? (category ? `SUNKOOL Journal articles filed under ${category.name}.` : BLOG_DESCRIPTION);
  const paged = request.page > 1;

  return {
    kind: "ok",
    robots: { index, follow: true },
    canonical: listingPath(request),
    title: paged ? `${baseTitle} — Page ${request.page}` : baseTitle,
    description: paged ? `Page ${request.page} of ${totalPages}. ${baseDescription}` : baseDescription,
    eyebrow: paged ? `The Journal · Page ${request.page}` : "The Journal",
    heading: category
      ? {
          title: copy?.heading ?? category.name,
          intro: copy?.intro ?? `Articles from the SUNKOOL Journal filed under ${category.name}.`,
        }
      : undefined,
    totalPages,
  };
}

export type CategoryStat = { slug: string; count: number; updatedAt?: string };

/** Sitemap entries for the category pages that qualify for indexing - and only those. */
export function categorySitemapEntries(stats: CategoryStat[], base: string) {
  return stats
    .filter((stat) => isIndexableCategory(stat.slug, stat.count))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((stat) => ({
      url: `${base}${listingPath({ category: stat.slug })}`,
      ...(stat.updatedAt ? { lastModified: new Date(stat.updatedAt) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
}
