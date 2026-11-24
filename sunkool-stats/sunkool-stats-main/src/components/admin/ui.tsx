import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

/** Thin blue-grey hairline shared by every card, panel and table so the surfaces read as one family. */
const surfaceBorder = "border-[#9db4d6]/[0.14]!";

/** Card surface: charcoal with a whisper of gradient and a thin border. */
export const panelClass =
  "relative rounded-2xl border " + surfaceBorder + " bg-carbon-2 bg-linear-to-br from-electric/[0.06] via-transparent to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-28px_rgba(0,0,0,0.9)]";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_-10px_rgba(88,167,232,0.7)] transition-all hover:bg-glow hover:shadow-[0_10px_28px_-10px_rgba(125,211,255,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-electric/20! bg-electric/[0.04] px-3 py-1.5 text-xs font-medium text-fog transition-colors hover:border-electric/50! hover:bg-electric/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric disabled:opacity-50";

export const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent! text-fog transition-colors hover:border-electric/25! hover:bg-electric/10 hover:text-white focus-visible:outline-2 focus-visible:outline-electric disabled:opacity-50";

export const tableShellClass = "overflow-hidden rounded-2xl border " + surfaceBorder + " bg-carbon-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-28px_rgba(0,0,0,0.9)]";
export const tableHeadClass = "border-b border-electric/[0.14]! bg-electric/[0.04] text-[11px] uppercase tracking-[0.14em] text-fog";
export const tableRowClass = "border-b border-white/[0.06]! transition-colors last:border-0 hover:bg-electric/[0.04]";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn(panelClass, className)}>{children}</section>;
}

/** Icon-tile colours for a StatCard: a dark-to-light diagonal fill, a lighter hairline and a pale glyph. */
const STAT_TONES = {
  blue: "border-[#3d8be0]/45! from-[#0a3b7a] to-[#0b5299] text-[#d6e9ff] shadow-[0_0_18px_-8px_rgba(61,139,224,0.9)]",
  indigo: "border-[#7078e6]/45! from-[#1f2b78] to-[#4a54c4] text-[#e3e5ff] shadow-[0_0_18px_-8px_rgba(112,120,230,0.9)]",
  teal: "border-[#25c9bf]/40! from-[#015051] to-[#079a97] text-[#d9fffb] shadow-[0_0_18px_-8px_rgba(37,201,191,0.9)]",
  amber: "border-[#e8a560]/45! from-[#6f4526] to-[#b87a38] text-[#ffeed9] shadow-[0_0_18px_-8px_rgba(232,165,96,0.9)]",
} as const;

export type StatTone = keyof typeof STAT_TONES;

export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  trend,
  viz,
  tone = "blue",
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  note?: string;
  trend?: "up" | "down" | "flat";
  viz?: ReactNode;
  tone?: StatTone;
}) {
  // "300% vs previous 30 days": the figure is the news, so it gets the green.
  const figure = trend === "up" ? note?.match(/^(\+?[\d.,]+%?)\s+(.*)$/) : null;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#9db4d6]/[0.14]! bg-carbon-2 bg-linear-to-br from-electric/[0.05] via-transparent to-transparent p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-28px_rgba(0,0,0,0.9)] transition-all hover:border-electric/40! hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_32px_-12px_rgba(88,167,232,0.4)]">
      <div className="pointer-events-none absolute -left-10 -top-14 h-32 w-32 rounded-full bg-electric/[0.07] blur-3xl transition-colors group-hover:bg-electric/15" />
      <div className="relative flex items-center gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border bg-linear-to-br", STAT_TONES[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-fog">{label}</p>
      </div>
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <p className="font-display text-4xl font-semibold tracking-tight text-white tabular-nums">{value}</p>
        {viz}
      </div>
      {note && (
        <p
          className={cn(
            "relative mt-3 inline-flex items-center gap-1 text-xs font-medium",
            trend === "up" ? "text-glow" : "text-fog"
          )}
        >
          {trend === "up" && <ArrowUp className="h-3.5 w-3.5 text-emerald-400" />}
          {trend === "down" && <ArrowDown className="h-3.5 w-3.5" />}
          {figure ? (
            <>
              <span className="text-emerald-400">{figure[1]}</span> {figure[2]}
            </>
          ) : (
            note
          )}
        </p>
      )}
    </div>
  );
}

/** Post cover thumbnail, with a document icon when the post has no cover image. */
export function Thumb({ src, className, eager }: { src: string | null; className?: string; eager?: boolean }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" className={cn("rounded-lg border border-electric/25! object-cover", className)} />
  ) : (
    <span className={cn("flex items-center justify-center rounded-lg border border-electric/20! bg-electric/[0.05] text-fog", className)}>
      <FileText className="h-4 w-4" />
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-electric">
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_10px_2px_rgba(88,167,232,0.6)]" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-fog">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
}
