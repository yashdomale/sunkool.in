// A count card at the top of Blog data; each one also links to that status filter.
import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const numberFormat = new Intl.NumberFormat("en-IN");

/** A count that is also the link to that slice of the list. */
export function SummaryCard({
  href,
  label,
  value,
  icon: Icon,
  iconClass,
  active,
}: {
  href: string;
  label: string;
  value: number;
  icon: typeof Users;
  iconClass: string;
  active: boolean;
}) {
  return (
    <Link
      // Prefetching would run this DB-backed page's queries for all three cards on every render.
      prefetch={false}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-carbon-2 bg-linear-to-br from-electric/[0.09] via-transparent to-transparent p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-28px_rgba(0,0,0,0.9)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric sm:p-5",
        active ? "border-electric/70! ring-1 ring-electric/30" : "border-electric/[0.2]! hover:border-electric/45!"
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className={cn("hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white/[0.03] sm:flex", iconClass)}>
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-fog">{label}</span>
      </span>
      <span className="font-display text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">{numberFormat.format(value)}</span>
    </Link>
  );
}
