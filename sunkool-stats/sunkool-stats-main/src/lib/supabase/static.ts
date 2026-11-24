import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free client for build-time/static contexts (generateStaticParams,
 * sitemap.ts) where next/headers' cookies() isn't available. Only ever used
 * for public, published data — RLS still applies, so it can't see drafts.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Cache tag on every public blog read; the admin actions call updateTag() with it after a change. */
export const BLOG_CACHE_TAG = "blog";
const PUBLIC_READ_REVALIDATE_SECONDS = 3600;

/**
 * Cookie-free client whose reads go through Next's Data Cache (stale-while-revalidate after an hour,
 * dropped at once when an admin saves, see BLOG_CACHE_TAG). For public, published data only: the blog
 * pages are rendered per request, and without this every visitor click waited on 2-4 round trips to
 * Supabase (measured 1.2-2.4 s with no visible change). Never use it for drafts or anything per-user.
 */
export function createCachedPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            next: { revalidate: PUBLIC_READ_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] },
          }),
      },
    }
  );
}
