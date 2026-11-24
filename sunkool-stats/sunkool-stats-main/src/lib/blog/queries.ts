import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createCachedPublicClient, createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import seedData from "./seed-data.json";
import type { AdminPostSort, Author, Category, Faq, PaginatedPosts, Post, PostStatus } from "./types";
import { buildDashboardAnalytics, type AnalyticsRow, type CategoryRow, type DashboardAnalytics } from "./analytics";
import { getSitePageDestinations } from "./internal-links/site-pages";
import type { LinkDestination } from "./internal-links/types";
import { postHref } from "./internal-links/urls";
import type { CategoryStat } from "./listing-seo";
import { LATEST_UPDATE_TAG, newestOf } from "./latest-update";
import { readLatestAnnouncementAt } from "@/lib/announcements/queries";

const POST_SELECT = "*, author:authors(*), category:categories(*)";
const PAGE_SIZE = 9;
// The original published articles are available without a CMS connection.
// Configured projects always use the database, including empty results/errors.
const seedPosts = seedData.posts as Post[];

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  cover_image: string | null;
  status: PostStatus;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  faqs: Faq[] | null;
  reading_time: number;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author: Author | null;
  category: Category | null;
};

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: (row.content as Post["content"]) ?? { type: "doc", content: [] },
    coverImage: row.cover_image,
    author: row.author,
    category: row.category,
    status: row.status,
    featured: row.featured,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: row.keywords ?? [],
    faqs: row.faqs ?? [],
    readingTime: row.reading_time,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

export async function getPublishedPosts(options: {
  page?: number;
  category?: string;
  q?: string;
} = {}): Promise<PaginatedPosts> {
  const page = Math.max(1, options.page ?? 1);
  if (!isSupabaseConfigured()) {
    const q = options.q?.toLocaleLowerCase();
    const posts = seedPosts.filter((post) =>
      (!options.category || post.category?.slug === options.category) &&
      (!q || `${post.title} ${post.excerpt}`.toLocaleLowerCase().includes(q))
    );
    return { posts: posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: posts.length, page, pageSize: PAGE_SIZE };
  }
  // Free-text searches are unbounded, so they stay uncached; the listing, categories and pages are cached.
  const supabase = options.q ? await createClient() : createCachedPublicClient();

  let query = supabase
    .from("posts")
    .select(POST_SELECT, { count: "exact" })
    .eq("status", "published");

  if (options.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .maybeSingle();
    // No matching category: force an empty result set rather than ignoring the filter.
    query = query.eq("category_id", category?.id ?? "00000000-0000-0000-0000-000000000000");
  }
  if (options.q) {
    query = query.or(`title.ilike.%${options.q}%,excerpt.ilike.%${options.q}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("published_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  // A page past the end is a 416 from PostgREST. Answer it as an empty page of the real list
  // (true total, no posts) so the caller can 404 it instead of throwing a 500.
  if (error?.code === "PGRST103" && page > 1) {
    const { total } = await getPublishedPosts({ ...options, page: 1 });
    return { posts: [], total, page, pageSize: PAGE_SIZE };
  }
  if (error) throw error;

  return {
    posts: (data as PostRow[] ?? []).map(mapPost),
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getFeaturedPosts(limit = 1): Promise<Post[]> {
  if (!isSupabaseConfigured()) return seedPosts.filter((post) => post.featured).slice(0, limit);
  const supabase = createCachedPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as PostRow[] ?? []).map(mapPost);
}
/**
 * When the newest update went live - a published post or a published announcement, whichever is
 * later - for the nav's "New" highlight. It runs in the root layout, so it must not read cookies
 * (that would make every page dynamic) and must never throw: the nav loads without the badge
 * rather than the whole site failing on a CMS hiccup.
 */
const readLatestPublishedAt = unstable_cache(
  async (): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      return seedPosts.reduce<string | null>(
        (latest, post) => (post.publishedAt && (!latest || post.publishedAt > latest) ? post.publishedAt : latest),
        null
      );
    }
    const [posts, latestAnnouncement] = await Promise.all([
      createStaticClient()
        .from("posts")
        .select("published_at")
        .eq("status", "published")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      readLatestAnnouncementAt(),
    ]);
    // Thrown, not swallowed here, so a failed read is never cached as "no posts".
    if (posts.error) throw posts.error;
    return newestOf(posts.data?.published_at, latestAnnouncement);
  },
  ["blog-latest-published-at"],
  // The tag is expired on every publish/unpublish/delete (posts and announcements); the hour is only a backstop.
  { tags: [LATEST_UPDATE_TAG], revalidate: 3600 }
);

export async function getLatestPublishedAt(): Promise<string | null> {
  try {
    return await readLatestPublishedAt();
  } catch (error) {
    console.error("getLatestPublishedAt failed", error);
    return null;
  }
}


export async function getPostBySlug(
  slug: string,
  options: { includeDraft?: boolean } = {}
): Promise<Post | null> {
  if (!isSupabaseConfigured()) return seedPosts.find((post) => post.slug === slug) ?? null;
  // Drafts are only visible to a signed-in admin, so that path needs their cookies; published reads are cached.
  const supabase = options.includeDraft ? await createClient() : createCachedPublicClient();
  let query = supabase.from("posts").select(POST_SELECT).eq("slug", slug);

  if (!options.includeDraft) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? mapPost(data as PostRow) : null;
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  if (!post.category) return [];
  if (!isSupabaseConfigured()) return seedPosts.filter((related) => related.category?.id === post.category?.id && related.id !== post.id).slice(0, limit);
  const supabase = createCachedPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("category_id", post.category.id)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as PostRow[] ?? []).map(mapPost);
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [...seedData.categories].sort((a, b) => a.name.localeCompare(b.name));
  const supabase = createCachedPublicClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAllAuthors(): Promise<Author[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("authors").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

const ADMIN_SORT_ORDER: Record<AdminPostSort, { column: string; ascending: boolean }> = {
  updated: { column: "updated_at", ascending: false },
  oldest: { column: "updated_at", ascending: true },
  views: { column: "views", ascending: false },
  title: { column: "title", ascending: true },
};

export async function getAdminPosts(options: {
  page?: number;
  pageSize?: number;
  status?: PostStatus | "all";
  q?: string;
  /** A category id (not a slug). */
  category?: string;
  sort?: AdminPostSort;
} = {}): Promise<PaginatedPosts> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? 20;
  const supabase = await createClient();

  let query = supabase.from("posts").select(POST_SELECT, { count: "exact" });

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }
  if (options.category) {
    query = query.eq("category_id", options.category);
  }
  if (options.q) {
    query = query.or(`title.ilike.%${options.q}%,excerpt.ilike.%${options.q}%`);
  }

  const order = ADMIN_SORT_ORDER[options.sort ?? "updated"];
  const from = (page - 1) * pageSize;
  const { data, count, error } = await query
    .order(order.column, { ascending: order.ascending })
    .range(from, from + pageSize - 1);

  // A page past the end (say, after deleting the last post on it) is a 416; show the first page instead.
  if (error?.code === "PGRST103" && page > 1) return getAdminPosts({ ...options, page: 1 });
  if (error) throw error;

  return {
    posts: (data as PostRow[] ?? []).map(mapPost),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select(POST_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapPost(data as PostRow) : null;
}

type LinkPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  keywords: string[] | null;
  status: PostStatus;
  category: { name: string } | null;
};

function mapLinkDestination(row: LinkPostRow): LinkDestination {
  return {
    kind: "post",
    href: postHref(row.slug),
    title: row.title.trim(),
    description: row.excerpt,
    keywords: row.keywords ?? [],
    status: row.status,
    id: row.id,
    group: row.category?.name ?? "Uncategorized",
  };
}

/** Public rendering must never use drafts, even for a signed-in reader. */
export async function getPublishedLinkDestinations(): Promise<LinkDestination[]> {
  if (!isSupabaseConfigured()) {
    return seedPosts.filter((post) => post.status === "published").map(mapLinkDestination);
  }
  const supabase = createCachedPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, keywords, status, category:categories(name)")
    .eq("status", "published")
    .order("title");
  if (error) throw error;
  return ((data ?? []) as unknown as LinkPostRow[]).map(mapLinkDestination);
}

/**
 * Everything the editor can link to: every real site page, then every post
 * (drafts included but flagged, so the editor can show and refuse them),
 * minus the post being edited.
 */
export async function getLinkDestinations(excludeId?: string): Promise<LinkDestination[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("id, title, slug, excerpt, keywords, status, category:categories(name)")
    .order("title");
  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw error;

  const posts = ((data ?? []) as unknown as LinkPostRow[]).map(mapLinkDestination);
  return [...getSitePageDestinations(), ...posts];
}

/**
 * All published post slugs — for the sitemap and generateStaticParams,
 * neither of which run with request cookies available. Not paginated like
 * the listing page.
 */
export async function getAllPublishedPostSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!isSupabaseConfigured()) return seedPosts.map(({ slug, updatedAt }) => ({ slug, updatedAt }));
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
}

/**
 * Published-article count and latest edit per category slug, for the sitemap (no request cookies,
 * same as getAllPublishedPostSlugs). Categories with no published post are simply absent.
 */
export async function getCategorySitemapStats(): Promise<CategoryStat[]> {
  let rows: { slug: string | null; updatedAt: string }[];
  if (!isSupabaseConfigured()) {
    rows = seedPosts.map((post) => ({ slug: post.category?.slug ?? null, updatedAt: post.updatedAt }));
  } else {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("posts")
      .select("updated_at, category:categories(slug)")
      .eq("status", "published");
    if (error) throw error;
    rows = ((data ?? []) as unknown as { updated_at: string; category: { slug: string } | null }[]).map((row) => ({
      slug: row.category?.slug ?? null,
      updatedAt: row.updated_at,
    }));
  }

  const stats = new Map<string, CategoryStat>();
  for (const { slug, updatedAt } of rows) {
    if (!slug) continue;
    const stat = stats.get(slug) ?? { slug, count: 0, updatedAt };
    stat.count += 1;
    if (updatedAt > (stat.updatedAt ?? "")) stat.updatedAt = updatedAt;
    stats.set(slug, stat);
  }
  return [...stats.values()];
}

/** Read-only aggregates for the admin dashboard cards and charts. */
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const supabase = await createClient();
  const PAGE = 1000; // PostgREST's default row cap, so page through anything larger.

  const fetchPostRows = async (from: number) => {
    const { data, error } = await supabase
      .from("posts")
      .select("status, views, created_at, published_at, category_id")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    return (data ?? []) as AnalyticsRow[];
  };

  // Categories load alongside the first page of posts instead of after it.
  const [firstPage, categoriesResult] = await Promise.all([
    fetchPostRows(0),
    supabase.from("categories").select("id, name, created_at"),
  ]);
  if (categoriesResult.error) throw categoriesResult.error;

  const rows = [...firstPage];
  for (let from = PAGE; rows.length === from; from += PAGE) {
    rows.push(...(await fetchPostRows(from)));
  }

  return buildDashboardAnalytics(rows, (categoriesResult.data ?? []) as CategoryRow[]);
}

/** Published posts with the most views, for the dashboard's "Top performing" list. */
export async function getTopPosts(limit = 5): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .gt("views", 0)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as PostRow[] ?? []).map(mapPost);
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const [published, draft, viewsResult] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("views"),
  ]);

  const totalViews = (viewsResult.data ?? []).reduce((sum, row) => sum + (row.views ?? 0), 0);

  return {
    publishedCount: published.count ?? 0,
    draftCount: draft.count ?? 0,
    totalViews,
  };
}
