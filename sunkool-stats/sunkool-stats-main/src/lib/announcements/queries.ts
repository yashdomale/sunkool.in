import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ANNOUNCEMENTS_TAG, PUBLIC_ANNOUNCEMENT_LIMIT, type Announcement } from "./types";

const COLUMNS = "id, title, body, published, published_at, created_at";

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

// What Postgres / PostgREST say while migration 0011 has not been applied to the project yet:
//   PGRST205  table not in the schema cache      42P01  undefined table
const NOT_SET_UP = new Set(["PGRST205", "42P01"]);

/** True when the announcements table doesn't exist yet (supabase/migrations/0011_announcements.sql). */
export function isAnnouncementsNotSetUp(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" && NOT_SET_UP.has(code);
}

const readPublishedAnnouncements = unstable_cache(
  async (): Promise<Announcement[]> => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await createStaticClient()
      .from("announcements")
      .select(COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(PUBLIC_ANNOUNCEMENT_LIMIT);
    // Thrown, not swallowed here, so a failed read is never cached as "no announcements".
    if (error) throw error;
    return ((data ?? []) as AnnouncementRow[]).map(mapAnnouncement);
  },
  ["announcements-published"],
  // Every admin change expires the tag; the hour is only a backstop.
  { tags: [ANNOUNCEMENTS_TAG], revalidate: 3600 }
);

/** Published announcements for the public Updates page. Never throws: the page renders without them. */
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  try {
    return await readPublishedAnnouncements();
  } catch (error) {
    if (!isAnnouncementsNotSetUp(error)) console.error("getPublishedAnnouncements failed", error);
    return [];
  }
}

/** Every announcement, drafts included, newest first, for the admin screen. Throws on any error. */
export async function getAdminAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as AnnouncementRow[]).map(mapAnnouncement);
}

/**
 * When the newest published announcement went live, for the nav's "New" highlight. Cookie-free so
 * it can run inside the root layout; a project without the table simply has none.
 */
export async function readLatestAnnouncementAt(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await createStaticClient()
    .from("announcements")
    .select("published_at")
    .eq("published", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    if (isAnnouncementsNotSetUp(error)) return null;
    throw error;
  }
  return data?.published_at ?? null;
}
