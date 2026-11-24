import type { PostStatus } from "./types";

export type AnalyticsRow = {
  status: PostStatus;
  views: number | null;
  created_at: string;
  published_at: string | null;
  category_id: string | null;
};

export type CategoryRow = {
  id: string;
  name: string;
  created_at: string;
};

export type MonthPoint = {
  key: string;
  /** Short axis label, e.g. "Sep". */
  label: string;
  /** Tooltip label, e.g. "September 2026". */
  fullLabel: string;
  /** Posts that existed by the end of this month (cumulative). */
  total: number;
  /** Posts that were published by the end of this month (cumulative). */
  published: number;
  /** Posts created during this month. */
  added: number;
  /** Views of posts published (or, for drafts, created) during this month. */
  views: number;
  /** Categories that existed by the end of this month (cumulative). */
  categories: number;
};

export type ViewsByCategory = {
  name: string;
  views: number;
  /** 0–1 share of all views. */
  share: number;
};

export type DashboardAnalytics = {
  totalPosts: number;
  publishedCount: number;
  draftCount: number;
  totalViews: number;
  categoryCount: number;
  categoriesInUse: number;
  newPostsLast30Days: number;
  newPostsPrev30Days: number;
  avgViewsPerPublished: number;
  viewsByCategory: ViewsByCategory[];
  series: MonthPoint[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MIN_MONTHS = 6;
const MAX_MONTHS = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CATEGORY_SLICES = 4;

function monthIndex(date: Date) {
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

function publishedIndex(row: AnalyticsRow) {
  return monthIndex(new Date(row.published_at ?? row.created_at));
}

/**
 * Buckets the real post rows into calendar months. The window always covers at
 * least the last 6 months and stretches back (up to 12) to include the oldest
 * post, so the charts show the whole recent history rather than empty months.
 * Posts older than the window are folded into its first month.
 */
export function buildMonthlySeries(
  rows: AnalyticsRow[],
  categories: CategoryRow[] = [],
  now = new Date()
): MonthPoint[] {
  const nowIndex = monthIndex(now);
  const createdIndexes = rows.map((row) => monthIndex(new Date(row.created_at)));
  const earliest = createdIndexes.reduce((min, index) => Math.min(min, index), nowIndex);
  const span = Math.min(MAX_MONTHS, Math.max(MIN_MONTHS, nowIndex - earliest + 1));
  const startIndex = nowIndex - span + 1;
  const categoryIndexes = categories.map((category) => monthIndex(new Date(category.created_at)));

  const points: MonthPoint[] = [];
  for (let i = 0; i < span; i++) {
    const index = startIndex + i;
    const year = Math.floor(index / 12);
    const month = index % 12;
    const showYear = i === 0 || month === 0;

    let total = 0;
    let published = 0;
    let added = 0;
    let views = 0;
    for (const row of rows) {
      const created = monthIndex(new Date(row.created_at));
      if (created <= index) total += 1;
      if (created === index) added += 1;
      const publishedAt = publishedIndex(row);
      if (row.status === "published" && publishedAt <= index) published += 1;
      if (Math.min(Math.max(publishedAt, startIndex), nowIndex) === index) views += row.views ?? 0;
    }

    points.push({
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: showYear ? `${MONTHS[month]} ’${String(year).slice(-2)}` : MONTHS[month],
      fullLabel: `${MONTHS_FULL[month]} ${year}`,
      total,
      published,
      added,
      views,
      categories: categoryIndexes.filter((created) => created <= index).length,
    });
  }
  return points;
}

/** Sums real post views per category; the smallest groups are merged into "Others". */
export function buildViewsByCategory(rows: AnalyticsRow[], categories: CategoryRow[]): ViewsByCategory[] {
  const names = new Map(categories.map((category) => [category.id, category.name]));
  const totals = new Map<string, number>();
  let allViews = 0;
  for (const row of rows) {
    const views = row.views ?? 0;
    if (views <= 0) continue;
    allViews += views;
    const name = (row.category_id && names.get(row.category_id)) || "Uncategorized";
    totals.set(name, (totals.get(name) ?? 0) + views);
  }
  if (allViews === 0) return [];

  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const head = sorted.slice(0, MAX_CATEGORY_SLICES);
  const rest = sorted.slice(MAX_CATEGORY_SLICES).reduce((sum, [, views]) => sum + views, 0);
  const slices = rest > 0 ? [...head, ["Others", rest] as [string, number]] : head;
  return slices.map(([name, views]) => ({ name, views, share: views / allViews }));
}

export function buildDashboardAnalytics(
  rows: AnalyticsRow[],
  categories: CategoryRow[],
  now = new Date()
): DashboardAnalytics {
  const publishedRows = rows.filter((row) => row.status === "published");
  const totalViews = rows.reduce((sum, row) => sum + (row.views ?? 0), 0);
  const publishedViews = publishedRows.reduce((sum, row) => sum + (row.views ?? 0), 0);
  const last30 = now.getTime() - 30 * DAY_MS;
  const prev30 = now.getTime() - 60 * DAY_MS;
  const createdAt = (row: AnalyticsRow) => new Date(row.created_at).getTime();

  return {
    totalPosts: rows.length,
    publishedCount: publishedRows.length,
    draftCount: rows.length - publishedRows.length,
    totalViews,
    categoryCount: categories.length,
    categoriesInUse: new Set(rows.map((row) => row.category_id).filter(Boolean)).size,
    newPostsLast30Days: rows.filter((row) => createdAt(row) >= last30).length,
    newPostsPrev30Days: rows.filter((row) => createdAt(row) >= prev30 && createdAt(row) < last30).length,
    avgViewsPerPublished: publishedRows.length ? Math.round(publishedViews / publishedRows.length) : 0,
    viewsByCategory: buildViewsByCategory(rows, categories),
    series: buildMonthlySeries(rows, categories, now),
  };
}
