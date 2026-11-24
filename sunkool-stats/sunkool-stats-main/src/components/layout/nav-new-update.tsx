"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { isFreshUpdate } from "@/lib/blog/latest-update";

const subscribeNever = () => () => {};

/**
 * Whether the newest post is still inside the "New" window. The server snapshot is always false
 * so the prerendered HTML matches hydration regardless of when the page was built; the badge
 * appears on the client, judged against the visitor's clock.
 */
export function useHasNewUpdate(latestUpdateAt: string | null) {
  return useSyncExternalStore(
    subscribeNever,
    () => isFreshUpdate(latestUpdateAt),
    () => false
  );
}

/**
 * Red "NEW" text after a menu label. The track fills the rest of the row and the text slides
 * from the label to the row's right edge and back, on a loop. Must sit in a flex row.
 */
export function NewBadge() {
  return (
    <span className="flex flex-1 items-center">
      <span className="animate-slide-to-end relative text-xs font-bold uppercase tracking-wider text-red-500">
        New
      </span>
    </span>
  );
}

/** A small orange dot on a closed menu button, so the new item inside it is noticed without opening it. */
export function NewDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("absolute flex h-2.5 w-2.5", className)}>
      <span className="absolute inline-flex h-full w-full rounded-full bg-sun opacity-70 motion-safe:animate-ping" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sun ring-2 ring-black" />
    </span>
  );
}
