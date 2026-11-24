import type { createClient } from "@/lib/supabase/server";
import { collectSitePaths } from "./doc-links";
import { getSitePaths } from "./site-pages";
import { slugFromPath } from "./urls";
import { findLinkIssues, newLinkIssues, type LinkIssue } from "./validate";
import type { PostStatus } from "../types";

type Db = Awaited<ReturnType<typeof createClient>>;
type Self = { selfId?: string; selfSlug: string };

/** The shape post slugs are validated to on save, so anything else can't be a real post. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

class LookupError extends Error {}

/** Looks up the posts a document links to, then runs the same checks the editor does. */
async function issuesIn(supabase: Db, doc: unknown, self: Self): Promise<LinkIssue[]> {
  const sitePaths = getSitePaths();
  // Only well-formed slugs are sent to the database. Anything else cannot be a real post, and
  // link URLs are free text, so they must not reach the query filter as-is.
  const slugs = collectSitePaths(doc)
    .filter((path) => !sitePaths.has(path))
    .map(slugFromPath)
    .filter((slug): slug is string => slug !== null && SLUG.test(slug));

  const posts = new Map<string, { id: string; status: PostStatus }>();
  if (slugs.length > 0) {
    const { data, error } = await supabase.from("posts").select("id, slug, status").in("slug", slugs);
    if (error) throw new LookupError(error.message);
    for (const row of data ?? []) posts.set(row.slug, { id: row.id, status: row.status });
  }
  return findLinkIssues(doc, { ...self, sitePaths, posts });
}

/**
 * The server-side half of "no broken, self or draft links": run before a post
 * is written or published, so it holds even if the editor's own checks are
 * bypassed. Returns a message for the editor, or null when it may go ahead.
 *
 * Only problems that would be *newly exposed* count. What's already live is the
 * baseline, and only a **published** post has anything live: posts imported
 * from the old site can contain a stale link, and that must not stop anyone
 * fixing a typo in them. A draft has nothing live, so publishing one is judged
 * on every link it contains. Pass the stored row as `stored` (null if there is
 * none); this function picks the baseline itself so no caller can pick the wrong one.
 *
 * A link to a draft is fine while the post itself is still a draft, since it
 * only becomes a 404 once published.
 */
export async function checkInternalLinks(
  supabase: Db,
  options: {
    next: unknown;
    stored?: { status: PostStatus; content: unknown } | null;
    selfId?: string;
    selfSlug: string;
    publishing: boolean;
  }
): Promise<string | null> {
  const self = { selfId: options.selfId, selfSlug: options.selfSlug };
  try {
    let issues = await issuesIn(supabase, options.next, self);
    if (options.stored?.status === "published") {
      issues = newLinkIssues(await issuesIn(supabase, options.stored.content, self), issues);
    }
    if (!options.publishing) issues = issues.filter((issue) => issue.problem !== "draft");
    if (issues.length === 0) return null;

    const shown = issues.slice(0, 3).map((issue) => issue.message);
    const more = issues.length > shown.length ? ` (and ${issues.length - shown.length} more)` : "";
    return `Fix the internal links before saving: ${shown.join(" ")}${more}`;
  } catch (error) {
    if (error instanceof LookupError) return `Couldn't check the post's internal links: ${error.message}`;
    throw error;
  }
}
