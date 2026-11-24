import type { SupabaseClient } from "@supabase/supabase-js";
import { toBlogLeadsError } from "./errors";
import { BLOG_LEAD_SOURCES, toLeadSource, type BlogLeadSource } from "./source";
import { dbStatusesFor, dbStatusToWrite, LEAD_STATUSES, toLeadStatus, type LeadStatus, type LeadStatusFilter } from "./status";
import { BLOG_LEAD_PAGE_SIZE, type BlogLead, type BlogLeadCounts, type PaginatedBlogLeads } from "./types";

// Takes the signed-in admin's Supabase client (from requireAdmin()). Row Level
// Security is the real gate: a client without an admin session reads nothing,
// whatever this query asks for.
type Db = Pick<SupabaseClient, "from">;

const LEAD_COLUMNS_BASE = "id, name, mobile, city, product_name, product_category, blog_title, blog_url, status, created_at";
const LEAD_COLUMNS = `${LEAD_COLUMNS_BASE}, message`;
/** Postgres "undefined_column": the message column (migration 0008) or the lead_source column (0010) does not exist yet. */
const UNDEFINED_COLUMN = "42703";

type LeadRow = {
  id: string;
  /** Only selected when the list is filtered by source. */
  lead_source?: string | null;
  name: string;
  mobile: string;
  city: string | null;
  product_name: string;
  product_category: string | null;
  message?: string | null;
  blog_title: string | null;
  blog_url: string | null;
  status: string;
  created_at: string;
};

export function mapBlogLead(row: LeadRow): BlogLead {
  return {
    id: row.id,
    source: toLeadSource(row.lead_source),
    name: row.name,
    mobile: row.mobile,
    city: row.city,
    productName: row.product_name,
    productCategory: row.product_category,
    message: row.message ?? null,
    blogTitle: row.blog_title,
    blogUrl: row.blog_url,
    status: toLeadStatus(row.status),
    createdAt: row.created_at,
  };
}

/**
 * One page of enquiries, newest first — every enquiry, or only the Pending / Completed ones.
 * With a `source`, only the enquiries from that source; leave it out and the lead_source column is
 * neither read nor filtered on, which is what a database without migration 0010 needs.
 */
export async function getBlogLeads(
  db: Db,
  page = 1,
  status: LeadStatusFilter = "all",
  pageSize = BLOG_LEAD_PAGE_SIZE,
  source?: BlogLeadSource
): Promise<PaginatedBlogLeads> {
  const current = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const from = (current - 1) * pageSize;

  const run = (columns: string) => {
    let query = db.from("blog_leads").select(source ? `${columns}, lead_source` : columns, { count: "exact" });
    if (status !== "all") query = query.in("status", [...dbStatusesFor(status)]);
    if (source) query = query.eq("lead_source", source);
    return query
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);
  };
  let result = await run(LEAD_COLUMNS);
  // Before migration 0008 there is no message column: show the enquiries without it rather than fail the page.
  if (result.error?.code === UNDEFINED_COLUMN) result = await run(LEAD_COLUMNS_BASE);
  const { data, count, error } = result;

  // A page past the end (say, a bookmarked page after leads were removed) is a 416; show the first page instead.
  if (error?.code === "PGRST103" && current > 1) return getBlogLeads(db, 1, status, pageSize, source);
  if (error) throw toBlogLeadsError(error);

  return {
    leads: ((data ?? []) as unknown as LeadRow[]).map(mapBlogLead),
    total: count ?? 0,
    page: current,
    pageSize,
  };
}

async function countWithStatus(db: Db, status: LeadStatus, source?: BlogLeadSource): Promise<number> {
  let query = db
    .from("blog_leads")
    .select("id", { count: "exact", head: true })
    .in("status", [...dbStatusesFor(status)]);
  if (source) query = query.eq("lead_source", source);
  const { count, error } = await query;
  if (error) throw toBlogLeadsError(error);
  return count ?? 0;
}

/**
 * How many enquiries are Pending and Completed, and the two together — all of them, or only those
 * from one `source`. The total is the sum, so the three always agree.
 */
export async function getBlogLeadCounts(db: Db, source?: BlogLeadSource): Promise<BlogLeadCounts> {
  const [pending, completed] = await Promise.all(LEAD_STATUSES.map((status) => countWithStatus(db, status, source)));
  return { total: pending + completed, pending, completed };
}

/**
 * How many enquiries each source holds, for the source dropdown. Null when the lead_source column
 * does not exist yet (migration 0010 not applied): the page then lists every enquiry as before and
 * shows no dropdown, instead of failing.
 */
export async function getBlogLeadSourceCounts(db: Db): Promise<Record<BlogLeadSource, number> | null> {
  const counts = {} as Record<BlogLeadSource, number>;
  for (const { value } of BLOG_LEAD_SOURCES) {
    const { count, error } = await db.from("blog_leads").select("id", { count: "exact", head: true }).eq("lead_source", value);
    if (error?.code === UNDEFINED_COLUMN) return null;
    if (error) throw toBlogLeadsError(error);
    counts[value] = count ?? 0;
  }
  return counts;
}

/**
 * Moves one enquiry to Pending or Completed. Resolves false when no row was changed — the enquiry
 * is gone, or RLS hid it from this user — so callers can tell that apart from a database error.
 */
export async function setBlogLeadStatus(db: Db, id: string, status: LeadStatus): Promise<boolean> {
  const { data, error } = await db.from("blog_leads").update({ status: dbStatusToWrite(status) }).eq("id", id).select("id");
  if (error) throw toBlogLeadsError(error);
  return (data?.length ?? 0) > 0;
}
