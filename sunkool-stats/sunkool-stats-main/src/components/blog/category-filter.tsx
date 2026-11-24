import Link from "next/link";
import { cn } from "@/lib/utils";
import { LinkPending } from "./link-pending";
import type { Category } from "@/lib/blog/types";

export function CategoryFilter({
  categories,
  active,
  q,
}: {
  categories: Category[];
  active?: string;
  q?: string;
}) {
  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <div className="mb-10 flex flex-wrap gap-2">
      <Link
        href={`/blog${q ? `?q=${encodeURIComponent(q)}` : ""}`}
        className={cn(
          "relative rounded-full border px-4 py-2 text-sm transition-colors",
          !active ? "border-electric bg-electric/10 text-white" : "border-white/10 text-white hover:border-white/25 hover:text-white"
        )}
      >
        All
        <LinkPending />
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/blog?category=${c.slug}${qParam}`}
          className={cn(
            "relative rounded-full border px-4 py-2 text-sm transition-colors",
            active === c.slug ? "border-electric bg-electric/10 text-white" : "border-white/10 text-white hover:border-white/25 hover:text-white"
          )}
        >
          {c.name}
          <LinkPending />
        </Link>
      ))}
    </div>
  );
}
