/** A short notice the admin posts on the public Updates page. Independent of blog posts. */
export type Announcement = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  /** When it went live; null while hidden. */
  publishedAt: string | null;
  createdAt: string;
};

/** Cache tag for the public announcement list; every admin change expires it. */
export const ANNOUNCEMENTS_TAG = "announcements";

/** How many announcements the public page shows, newest first. */
export const PUBLIC_ANNOUNCEMENT_LIMIT = 6;
