import Link from "next/link";
import { CircleCheck, Clock, Users } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/ui";
import { isBlogLeadsNotSetUp } from "@/lib/blog/leads/errors";
import { getBlogLeadCounts, getBlogLeadSourceCounts, getBlogLeads } from "@/lib/blog/leads/queries";
import { BLOG_LEAD_SOURCES, DEFAULT_BLOG_LEAD_SOURCE, parseSourceFilter, type BlogLeadSource } from "@/lib/blog/leads/source";
import { parseStatusFilter, type LeadStatusFilter } from "@/lib/blog/leads/status";
import { cn } from "@/lib/utils";
import { requireAdminOrRedirect } from "./session";
import { BLOG_DATA_DESCRIPTION, SetupNeeded } from "./setup-needed";
import { SourceFilter } from "./source-filter";
import { COLUMNS, CHATBOT_COLUMNS, LeadRow } from "./lead-row";
import { SummaryCard } from "./summary-card";
import { Pagination } from "./pagination";

// Server-rendered end to end, like the Posts page. It lists the data the form collects, plus each
// entry's Pending / Completed status. The summary cards double as the status filter and a dropdown
// picks the source (blog form or chatbot), so the URL state is the source, the status filter and the
// page number — nothing else: no search, no other filters.

const BLOG_AND_CHATBOT_DESCRIPTION = "Enquiries from the form at the bottom of every blog post and from the website chatbot.";

const numberFormat = new Intl.NumberFormat("en-IN");
const BLOG_HEADINGS = ["Name", "Contact no.", "City", "Product", "Blog", "Date", "Status"];
const CHATBOT_HEADINGS = ["Name", "Contact no.", "Product", "Date", "Status"];

function parsePage(value: string | string[] | undefined): number {
  const text = Array.isArray(value) ? value[0] : value;
  return text && /^\d{1,6}$/.test(text) ? Math.max(1, Number(text)) : 1;
}

/**
 * The page's URL for a status filter, source and page number; the defaults (everything, the blog
 * form, page 1) stay out of it. No source means the database has no sources yet, so none is named.
 */
function hrefFor(status: LeadStatusFilter, source: BlogLeadSource | undefined, page = 1): string {
  const query = new URLSearchParams();
  if (status !== "all") query.set("status", status);
  if (source && source !== DEFAULT_BLOG_LEAD_SOURCE) query.set("source", source);
  if (page > 1) query.set("page", String(page));
  const text = query.toString();
  return text ? `/admin/blog-data?${text}` : "/admin/blog-data";
}

export default async function AdminBlogDataPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = parsePage(params.page);
  const status = parseStatusFilter(params.status);
  const requestedSource = parseSourceFilter(params.source);
  const { supabase } = await requireAdminOrRedirect();

  const loaded = await getBlogLeadSourceCounts(supabase)
    .then(async (sourceCounts) => {
      // No lead_source column yet (migration 0010 not applied): every enquiry is a blog one, so list them all, without the dropdown.
      const source = sourceCounts ? requestedSource : undefined;
      const [list, counts] = await Promise.all([getBlogLeads(supabase, requested, status, undefined, source), getBlogLeadCounts(supabase, source)]);
      return { sourceCounts, source, list, counts };
    })
    .catch((error: unknown) => {
      // The migrations haven't been applied to this database yet: explain, don't crash.
      if (isBlogLeadsNotSetUp(error)) return null;
      throw error;
    });
  if (!loaded) return <SetupNeeded />;
  const {
    sourceCounts,
    source,
    list: { leads, total, page, pageSize },
    counts,
  } = loaded;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const firstShown = (page - 1) * pageSize + 1;
  const href = (p: number) => hrefFor(status, source, p);
  const kind = status === "all" ? "" : `${status} `;
  const chatbot = source === "chatbot";
  const sourceOptions = BLOG_LEAD_SOURCES.map((option) => ({
    value: option.value,
    // The default view is the blog form and chatbot leads stay out of it until chosen, so the counts say what each holds.
    label: `${option.label} (${numberFormat.format(sourceCounts?.[option.value] ?? 0)})`,
    href: hrefFor(status, option.value),
  }));

  return (
    // The site's chat bubble and cookie bar float over the bottom of every page; this room lets the
    // last row and the pagination scroll clear of them instead of sitting underneath.
    <div className="pb-32">
      <PageHeader eyebrow="Sunkool CMS" title="Blog Data" description={sourceCounts ? BLOG_AND_CHATBOT_DESCRIPTION : BLOG_DATA_DESCRIPTION} />

      {source && (
        <div className="mb-4">
          <SourceFilter value={source} options={sourceOptions} />
        </div>
      )}

      <nav aria-label="Filter by status" className="mb-6 grid grid-cols-3 gap-2.5 sm:gap-4">
        <SummaryCard
          href={hrefFor("all", source)}
          label="Total leads"
          value={counts.total}
          icon={Users}
          iconClass="border-electric/35! text-glow"
          active={status === "all"}
        />
        <SummaryCard
          href={hrefFor("pending", source)}
          label="Pending"
          value={counts.pending}
          icon={Clock}
          iconClass="border-amber-400/40! text-amber-300"
          active={status === "pending"}
        />
        <SummaryCard
          href={hrefFor("completed", source)}
          label="Completed"
          value={counts.completed}
          icon={CircleCheck}
          iconClass="border-emerald-400/40! text-emerald-300"
          active={status === "completed"}
        />
      </nav>

      <Panel>
        <div
          className={cn(
            "hidden items-center gap-x-4 rounded-t-2xl border-b border-electric/[0.14]! bg-electric/[0.04] px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] text-fog",
            "min-[1320px]:grid",
            chatbot ? CHATBOT_COLUMNS : COLUMNS
          )}
        >
          {(chatbot ? CHATBOT_HEADINGS : BLOG_HEADINGS).map((heading) => (
            <span key={heading}>{heading}</span>
          ))}
        </div>

        {leads.length === 0 ? (
          <div className="px-6 py-14 text-center">
            {status === "all" ? (
              <p className="text-sm text-fog">
                {chatbot
                  ? "Nothing here yet — entries appear when a visitor gives their name and number to the chatbot."
                  : "Nothing here yet — entries appear when a visitor sends the form at the bottom of a blog post."}
              </p>
            ) : (
              <>
                <p className="text-sm text-fog">
                  {status === "pending"
                    ? "No pending entries — every enquiry has been marked Completed."
                    : "No completed entries yet — set an entry's Status to Completed and it will show up here."}
                </p>
                <Link prefetch={false} href={hrefFor("all", source)} className="mt-3 inline-block text-sm text-electric transition-colors hover:text-glow">
                  Show all entries
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul>
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </ul>
        )}

        {total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-b-2xl border-t border-electric/[0.14]! px-5 py-3.5 sm:flex-row">
            <p className="text-xs text-fog">
              Showing {numberFormat.format(firstShown)}–{numberFormat.format(firstShown + leads.length - 1)} of {numberFormat.format(total)}{" "}
              {kind}
              {total === 1 ? "entry" : "entries"}
            </p>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} href={href} />}
          </div>
        )}
      </Panel>
    </div>
  );
}
