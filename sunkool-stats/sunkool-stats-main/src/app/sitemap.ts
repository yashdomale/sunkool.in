import type { MetadataRoute } from "next";
import { getAllPublishedPostSlugs, getCategorySitemapStats } from "@/lib/blog/queries";
import { categorySitemapEntries } from "@/lib/blog/listing-seo";
import { LEGAL_PAGES } from "@/lib/legal-pages";
import { cities } from "@/lib/cities";
import { getAllVideoSlugs, getVideo } from "@/lib/videos";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";

const BASE = "https://www.sunkool.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Falls back to an empty list rather than failing the whole sitemap (and
  // build, since this route is statically generated) if Supabase is
  // unreachable — the static routes below still matter on their own.
  const [posts, categoryStats] = await Promise.all([
    getAllPublishedPostSlugs().catch(() => []),
    getCategorySitemapStats().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    // No lastModified: `new Date()` here only ever meant "when the sitemap was last built", which
    // Google learns to ignore - and then discounts every other lastmod on the site too.
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/window-film`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ppf`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/interior-ppf`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ultra-edge`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/compare`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/warranty`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/regulations`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/become-dealer`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/our-journey`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/videos`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const videoRoutes: MetadataRoute.Sitemap = getAllVideoSlugs()
    .map((slug) => getVideo(slug))
    .filter((v) => v !== undefined)
    .map((video) => ({
      url: `${BASE}/videos/${video.slug}`,
      changeFrequency: "yearly",
      priority: 0.5,
      videos: [
        {
          title: video.title,
          thumbnail_loc: `${BASE}${video.poster}`,
          description: video.description,
          content_loc: `${BASE}${resolvePublicAssetSrc(video.videoSrc)}`,
          duration: video.durationSeconds,
          publication_date: video.uploadDate,
          family_friendly: "yes",
        },
      ],
    }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_PAGES.map((p) => ({
    url: `${BASE}/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  // Every city served by the [city] route is registered in src/lib/cities.ts,
  // so a new city appears here (and only here) once it is added there.
  const cityRoutes: MetadataRoute.Sitemap = Object.keys(cities).map((slug) => ({
    url: `${BASE}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Only category pages that are indexable (curated copy, enough articles) - the same rule that
  // decides their robots tag, so the sitemap never lists a noindex URL. Pagination, search and
  // thin categories are deliberately absent.
  const categoryRoutes: MetadataRoute.Sitemap = categorySitemapEntries(categoryStats, BASE);

  return [...staticRoutes, ...categoryRoutes, ...videoRoutes, ...cityRoutes, ...legalRoutes, ...postRoutes];
}
