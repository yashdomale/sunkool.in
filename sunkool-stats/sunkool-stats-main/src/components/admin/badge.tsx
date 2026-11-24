import { cn } from "@/lib/utils";
import type { PostStatus } from "@/lib/blog/types";

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
        status === "published"
          ? "border-electric/35! bg-electric/10 text-electric"
          : "border-white/15! bg-white/5 text-fog"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "published" ? "bg-electric shadow-[0_0_8px_1px_rgba(88,167,232,0.7)]" : "bg-fog"
        )}
      />
      {status}
    </span>
  );
}
