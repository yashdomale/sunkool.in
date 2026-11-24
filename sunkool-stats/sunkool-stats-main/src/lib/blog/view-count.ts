/**
 * Whether a request for an article should add a view. Counting is the default; set SKIP_VIEW_COUNT=1
 * when testing against a server connected to the real database (a local `next start`, a Preview
 * deployment), so verification runs do not inflate the counts the admin dashboard shows.
 */
export function shouldCountView(
  post: { status: string },
  env: Record<string, string | undefined> = process.env
): boolean {
  return post.status === "published" && env.SKIP_VIEW_COUNT !== "1";
}
