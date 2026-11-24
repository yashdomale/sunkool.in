// Page links under the Blog data list.
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageWindow } from "@/lib/blog/leads/pagination";
import { cn } from "@/lib/utils";

export function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (page: number) => string }) {
  const arrow =
    "flex h-8 min-w-8 items-center justify-center rounded-lg border border-electric/20! text-fog transition-colors hover:border-electric/50! hover:text-white";
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link prefetch={false} href={href(page - 1)} aria-label="Previous page" className={arrow}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : null}
      {pageWindow(page, totalPages).map((entry, index) =>
        entry === null ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-xs text-fog/60">
            …
          </span>
        ) : (
          <Link
            prefetch={false}
            key={entry}
            href={href(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={cn(
              "min-w-8 rounded-lg px-2.5 py-1.5 text-center text-xs transition-colors",
              entry === page ? "bg-electric font-semibold text-black" : "border border-electric/20! text-fog hover:border-electric/50! hover:text-white"
            )}
          >
            {entry}
          </Link>
        )
      )}
      {page < totalPages ? (
        <Link prefetch={false} href={href(page + 1)} aria-label="Next page" className={arrow}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
