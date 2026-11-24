/** Cache tag for the newest published post's timestamp; admin publish/unpublish/delete expire it. */
export const LATEST_UPDATE_TAG = "latest-update";

/** How long after publishing a post the nav shows its "New" highlight. */
export const NEW_UPDATE_WINDOW_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

/** The later of two optional timestamps; compared as instants since Postgres and JS format them differently. */
export function newestOf(a: string | null | undefined, b: string | null | undefined): string | null {
  const at = a ? Date.parse(a) : NaN;
  const bt = b ? Date.parse(b) : NaN;
  if (Number.isNaN(at)) return Number.isNaN(bt) ? null : (b ?? null);
  if (Number.isNaN(bt)) return a ?? null;
  return bt > at ? (b ?? null) : (a ?? null);
}

/** True when a post published at `publishedAt` is still inside the "New" window. */
export function isFreshUpdate(publishedAt: string | null | undefined, now: number = Date.now()): boolean {
  if (!publishedAt) return false;
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return false;
  const age = now - published;
  // A timestamp slightly in the future (clock skew) still counts as just published.
  return age < NEW_UPDATE_WINDOW_DAYS * DAY_MS;
}
