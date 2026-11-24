import Link from "next/link";
import { cn } from "@/lib/utils";
import { LinkPending } from "./link-pending";

export function Pagination({
  page,
  totalPages,
  category,
  q,
}: {
  page: number;
  totalPages: number;
  category?: string;
  q?: string;
}) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mt-16 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
            p === page ? "bg-electric text-black" : "text-white hover:bg-white/10 hover:text-white"
          )}
        >
          {p}
          <LinkPending />
        </Link>
      ))}
    </div>
  );
}
