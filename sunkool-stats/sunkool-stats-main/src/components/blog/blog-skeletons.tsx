// Placeholders that appear the instant a blog link is pressed, while the page's data loads. They mirror the
// real layout (same paddings, grid and card sizes) so nothing jumps when the content arrives.

const block = "animate-pulse rounded-full bg-white/[0.08]";

export function CategoryFilterSkeleton() {
  return (
    <div className="mb-10 flex flex-wrap gap-2" aria-hidden="true">
      {[48, 104, 76, 64, 112, 92, 84].map((width, i) => (
        <div key={i} className="h-[38px] animate-pulse rounded-full border border-white/10 bg-white/[0.04]" style={{ width }} />
      ))}
    </div>
  );
}

export function BlogResultsSkeleton({ featured = true }: { featured?: boolean }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading articles…</span>

      {featured && (
        <div className="mb-6 grid overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-2" aria-hidden="true">
          <div className="min-h-56 animate-pulse bg-white/[0.05]" />
          <div className="space-y-4 p-8 lg:p-10">
            <div className={`${block} h-3 w-32`} />
            <div className={`${block} h-8 w-4/5`} />
            <div className={`${block} h-8 w-3/5`} />
            <div className={`${block} h-3.5 w-full bg-white/[0.05]`} />
            <div className={`${block} h-3.5 w-11/12 bg-white/[0.05]`} />
            <div className={`${block} h-3 w-40 bg-white/[0.05]`} />
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-carbon-2">
            <div className="h-40 animate-pulse bg-white/[0.05]" />
            <div className="space-y-3 p-6">
              <div className={`${block} h-3 w-24 bg-electric/25`} />
              <div className={`${block} h-5 w-11/12`} />
              <div className={`${block} h-5 w-2/3`} />
              <div className={`${block} h-3.5 w-full bg-white/[0.05]`} />
              <div className={`${block} h-3.5 w-5/6 bg-white/[0.05]`} />
              <div className={`${block} mt-2 h-3 w-28 bg-white/[0.05]`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The blog index as it looks while its first response is on the way: heading, search box, chips, cards. */
export function BlogIndexSkeleton() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-36" aria-hidden="true">
        <div className="container-lux relative space-y-5">
          <div className={`${block} h-3 w-28 bg-electric/25`} />
          <div className={`${block} h-14 w-full max-w-3xl sm:h-20`} />
          <div className={`${block} h-14 w-2/3 max-w-xl sm:h-20`} />
          <div className={`${block} h-4 w-full max-w-2xl bg-white/[0.05]`} />
          <div className={`${block} h-4 w-4/5 max-w-xl bg-white/[0.05]`} />
        </div>
      </section>
      <section className="pb-28">
        <div className="container-lux">
          <div className="mb-8 h-[46px] max-w-md animate-pulse rounded-full border border-white/10 bg-black/40" aria-hidden="true" />
          <CategoryFilterSkeleton />
          <BlogResultsSkeleton />
        </div>
      </section>
    </>
  );
}

/** A post while its response is on the way: back link, category, title, byline, cover and some body text. */
export function BlogPostSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading article…</span>
      <div className="relative overflow-hidden pb-16 pt-32" aria-hidden="true">
        <div className="container-lux relative max-w-4xl">
          <div className={`${block} mb-8 h-4 w-32 bg-white/[0.05]`} />
          <div className={`${block} mb-5 h-6 w-28 bg-electric/20`} />
          <div className={`${block} mb-3 h-10 w-full sm:h-14`} />
          <div className={`${block} mb-6 h-10 w-3/5 sm:h-14`} />
          <div className="mb-8 flex flex-wrap gap-5">
            <div className={`${block} h-4 w-28 bg-white/[0.05]`} />
            <div className={`${block} h-4 w-24 bg-white/[0.05]`} />
            <div className={`${block} h-4 w-20 bg-white/[0.05]`} />
          </div>
          <div className="mb-12 aspect-[1200/630] w-full animate-pulse rounded-3xl border border-white/10 bg-white/[0.05]" />
        </div>
      </div>
      <div className="pb-28" aria-hidden="true">
        <div className="container-lux max-w-4xl space-y-4">
          {[100, 96, 92, 100, 88, 60].map((width, i) => (
            <div key={i} className={`${block} h-4 bg-white/[0.05]`} style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
