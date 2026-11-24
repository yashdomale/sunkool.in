"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 950;

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Counts a single integer up from 0 to `end` once this element is ~30% in
 * view, then leaves the exact final number in place. Takes a number only —
 * no strings, no parsing, no per-character rendering. Each frame writes the
 * whole current value in one `textContent` assignment.
 */
export default function AnimatedNumber({
  end,
  className = "",
}: {
  end: number;
  className?: string;
}) {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.textContent = String(end);
      return;
    }

    el.textContent = "0";

    let rafId: number | null = null;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          started = true;
          observer.disconnect();

          // Capture the start time from the first rAF tick itself (not a
          // separate performance.now() call) — the two clocks can disagree
          // by a few ms, which briefly produced negative elapsed time and a
          // negative rendered number on the very first frame.
          let startTime: number | null = null;

          const tick = (now: number) => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const t = Math.max(0, Math.min(1, elapsed / DURATION_MS));
            const current = t >= 1 ? end : Math.round(end * easeOutQuart(t));
            el.textContent = String(current);

            if (t < 1) {
              rafId = requestAnimationFrame(tick);
            } else {
              rafId = null;
            }
          };

          rafId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [end]);

  return (
    <>
      {/* The real figure, in the server HTML for search engines and screen readers. */}
      <span className="sr-only">{end}</span>
      <span
        ref={elRef}
        aria-hidden="true"
        className={`animated-number ${className}`}
        style={{ minWidth: `${String(end).length}ch` }}
      >
        0
      </span>
    </>
  );
}
