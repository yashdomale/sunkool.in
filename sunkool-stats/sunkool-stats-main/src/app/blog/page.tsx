import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BlogSearch } from "@/components/blog/blog-search";
import { Pagination } from "@/components/blog/pagination";
import { AnnouncementsSection } from "@/components/updates/announcements-section";
import { getAllCategories, getFeaturedPosts, getPublishedPosts } from "@/lib/blog/queries";
import { getPublishedAnnouncements } from "@/lib/announcements/queries";
import {
  describeListing,
  parseListingParams,
  validateListingParams,
  type RawListingParams,
} from "@/lib/blog/listing-seo";

export const revalidate = 3600;

type SearchParams = Promise<RawListingParams>;

// generateMetadata and the page need the same lookups; cache() makes each one query per request.
const loadCategories = cache(getAllCategories);
const loadFeatured = cache(() => getFeaturedPosts(1));
const loadPosts = cache((page: number, category?: string, q?: string) =>
  getPublishedPosts({ page, category, q })
);

/**
 * Validates the URL, loads the listing and decides how it is presented to search engines (see
 * listing-seo.ts for the policy). Anything that is not a real listing - an unknown category, a
 * malformed or out-of-range ?page= - is a real 404 rather than an empty 200.
 */
async function resolveListing(searchParams: SearchParams) {
  const raw = await searchParams;
  const parsed = parseListingParams(raw);
  if (!parsed) notFound();

  // The three queries don't depend on each other, so they run together; an unknown category just
  // comes back as an empty list here and is rejected right below.
  const showFeatured = parsed.page === 1 && !parsed.category && !parsed.q;
  const [categories, result, featuredPosts, announcements] = await Promise.all([
    loadCategories(),
    loadPosts(parsed.page, parsed.category, parsed.q),
    showFeatured ? loadFeatured() : Promise.resolve([]),
    // Announcements sit under the intro text of the main listing only, not on filtered or paged views.
    showFeatured ? getPublishedAnnouncements() : Promise.resolve([]),
  ]);

  const check = validateListingParams(raw, categories);
  if (!check.ok) notFound();

  const seo = describeListing(check.request, check.category, result);
  if (seo.kind === "not-found") notFound();

  return { request: check.request, categories, result, featured: featuredPosts[0] ?? null, announcements, seo };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { request, seo } = await resolveListing(searchParams);
  const isMainListing = !request.category && request.page === 1;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: seo.robots,
    openGraph: {
      title: isMainListing
        ? "SUNKOOL Journal — Window Film, PPF & Heat Rejection Insights"
        : `${seo.title} — SUNKOOL`,
      description: isMainListing
        ? "Materials science, ownership guides and industry perspective — written by the people who engineer the film."
        : seo.description,
      url: seo.canonical,
      type: "website",
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { request, categories, result, featured, announcements, seo } = await resolveListing(searchParams);
  const gridPosts = featured ? result.posts.filter((p) => p.id !== featured.id) : result.posts;

  return (
    <>
      <PageHeader
        eyebrow={seo.eyebrow}
        title={
          seo.heading?.title ?? (
            <>
              Stories from the{" "}
              <span className="text-gradient-electric">cutting edge.</span>
            </>
          )
        }
        description={
          seo.heading?.intro ??
          "Materials science, ownership guides and industry perspective — written by the people who engineer the film."
        }
      />
      <section className="pb-28">
        <div className="container-lux">
          <AnnouncementsSection announcements={announcements} />
          <BlogSearch />
          <CategoryFilter categories={categories} active={request.category} q={request.q} />
          <BlogGrid posts={gridPosts} featured={featured} />
          <Pagination
            page={request.page}
            totalPages={seo.totalPages}
            category={request.category}
            q={request.q}
          />
        </div>
      </section>
    </>
  );
}
