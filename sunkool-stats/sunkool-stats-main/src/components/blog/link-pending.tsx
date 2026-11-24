"use client";

import { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils";

/**
 * Put inside a `relative` <Link> (it fills the link's own box): pulses the moment the link is pressed and
 * stops when the page has changed. Filters and pagination stay on the same page while their data loads,
 * so without this a press shows nothing at all until the server answers. Always rendered, only its
 * opacity changes, so it can never shift the layout.
 */
export function LinkPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] bg-white/15 opacity-0 transition-opacity duration-100",
        pending && "animate-pulse opacity-100"
      )}
    />
  );
}
