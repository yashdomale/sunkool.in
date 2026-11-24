// Shown instantly while an admin page's data loads, so a sidebar click changes
// the screen right away instead of leaving the old page up until Supabase answers.
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>

      <div className="mb-7 space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-electric/25" />
        <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-white/[0.08]" />
        <div className="h-3.5 w-52 max-w-full animate-pulse rounded-full bg-white/[0.05]" />
      </div>

      <div className="rounded-2xl border border-electric/[0.18]! bg-carbon-2 p-5 sm:p-6">
        <div className="space-y-5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-12 shrink-0 animate-pulse rounded-lg bg-electric/10" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-3/5 animate-pulse rounded-full bg-white/[0.08]" />
                <div className="h-3 w-2/5 animate-pulse rounded-full bg-white/[0.05]" />
              </div>
              <div className="hidden h-6 w-20 animate-pulse rounded-full bg-electric/10 sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
