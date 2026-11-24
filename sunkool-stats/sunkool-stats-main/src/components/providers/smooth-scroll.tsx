"use client";

import { ReactNode, useEffect } from "react";

/**
 * Smooth in-page anchor jumps (`<a href="#section">`) using native scrolling.
 *
 * This used to run Lenis on the product pages. Lenis drives every scroll frame from JavaScript,
 * so on a mid-range CPU those pages scrolled at ~28 fps with half the frames janky, and the page
 * trailed behind the wheel by design. Native scrolling is composited by the browser and stays
 * smooth even while the main thread is busy.
 *
 * Landing position comes from CSS: `scroll-padding-top` on <html> (clears the fixed header) plus
 * any `scroll-margin-top` on the target — the same rule the browser and Next.js <Link> use for
 * cross-page `/page#section` links, so both kinds of link land in the same place.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
