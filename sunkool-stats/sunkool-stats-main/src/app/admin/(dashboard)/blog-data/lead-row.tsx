// One lead in the Blog data list: a table row on wide screens, a card below 1320px.
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/format-date";
import { formatMobile, telHref } from "@/lib/leads/phone";
import type { BlogLead } from "@/lib/blog/leads/types";
import { cn } from "@/lib/utils";
import { LeadStatusSelect } from "./lead-status-select";

// The full table needs about 990px of content width (viewport >= 1320px); below that each entry is a card.
// Class names are written out in full on purpose: Tailwind only generates classes it can read literally.
export const COLUMNS = "min-[1320px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1.25fr)_minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_6rem_7.5rem]";

// A chatbot lead has no city and no blog, so its table has five columns instead of seven.
export const CHATBOT_COLUMNS = "min-[1320px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.8fr)_6rem_7.5rem]";

export function LeadRow({ lead }: { lead: BlogLead }) {
  const chatbot = lead.source === "chatbot";
  return (
    <li
      data-lead-id={lead.id}
      data-lead-source={lead.source}
      className={cn(
        "grid grid-cols-2 items-start gap-x-4 gap-y-3 border-b border-white/[0.06]! px-4 py-4 transition-colors last:border-0 hover:bg-electric/[0.04] sm:px-6",
        "min-[1320px]:items-center",
        chatbot ? CHATBOT_COLUMNS : COLUMNS
      )}
    >
      <div className="col-start-1 row-start-1 min-w-0 min-[1320px]:col-auto min-[1320px]:row-auto">
        <span className="block truncate text-[15px] font-medium text-white" title={lead.name}>
          {lead.name}
        </span>
      </div>

      <div className="col-span-2 min-w-0 min-[1320px]:col-span-1">
        <CellLabel>Contact no.</CellLabel>
        <a
          href={telHref(lead.mobile)}
          title={`Call ${lead.name}`}
          className="whitespace-nowrap text-sm font-medium tabular-nums text-white transition-colors hover:text-electric focus-visible:outline-2 focus-visible:outline-electric"
        >
          {formatMobile(lead.mobile)}
        </a>
      </div>

      {!chatbot && (
        <div className="min-w-0">
          <CellLabel>City</CellLabel>
          <span className="block truncate text-sm text-white" title={lead.city ?? undefined}>
            {lead.city ?? "—"}
          </span>
        </div>
      )}

      {/* Without a city beside it, a chatbot lead's product takes the full card width instead of half. */}
      <div className={cn("min-w-0", chatbot && "col-span-2 min-[1320px]:col-span-1")}>
        <CellLabel>Product</CellLabel>
        <span className="block truncate text-sm text-white" title={lead.productName}>
          {lead.productName}
        </span>
        {lead.productCategory && <span className="block truncate text-xs text-fog">{lead.productCategory}</span>}
      </div>

      {!chatbot && (
        <div className="col-span-2 min-w-0 min-[1320px]:col-span-1">
          <CellLabel>Blog</CellLabel>
          {lead.blogUrl ? (
            <a
              href={lead.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={lead.blogTitle ?? undefined}
              className="group inline-flex max-w-full items-start gap-1.5 text-sm text-electric transition-colors hover:text-glow"
            >
              <span className="line-clamp-2">{lead.blogTitle ?? lead.blogUrl}</span>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
            </a>
          ) : (
            <span className="text-sm text-fog">—</span>
          )}
        </div>
      )}

      <div className="col-start-2 row-start-1 justify-self-end text-right min-[1320px]:col-auto min-[1320px]:row-auto min-[1320px]:justify-self-start min-[1320px]:text-left">
        <time dateTime={lead.createdAt} className="text-sm text-white">
          {formatShortDate(lead.createdAt)}
          <span className="block text-xs text-fog">{formatTime(lead.createdAt)}</span>
        </time>
      </div>

      <div className="col-span-2 min-w-0 min-[1320px]:col-span-1">
        <CellLabel>Status</CellLabel>
        <LeadStatusSelect id={lead.id} name={lead.name} status={lead.status} />
      </div>

      {lead.message && (
        <div className="col-span-2 min-w-0 border-t border-white/[0.06]! pt-3 min-[1320px]:col-span-full">
          <span className="mb-0.5 block text-[10px] uppercase tracking-[0.14em] text-fog/70">Message</span>
          <p className="whitespace-pre-wrap break-words text-sm text-white/90">{lead.message}</p>
        </div>
      )}
    </li>
  );
}

export function CellLabel({ children }: { children: ReactNode }) {
  return <span className={cn("mb-0.5 block text-[10px] uppercase tracking-[0.14em] text-fog/70", "min-[1320px]:hidden")}>{children}</span>;
}
