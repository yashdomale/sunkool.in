"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Types `text` out letter by letter (with a blinking cursor) the first time it
 * scrolls into view. An invisible copy reserves the final width so nothing
 * shifts while typing, and keeps the full text in the DOM for screen readers
 * and search engines. Shows the full text immediately for reduced motion.
 */
export function TypewriterText({
  text,
  speedMs = 75,
  className,
}: {
  text: string;
  /** Delay between letters. */
  speedMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const shown = reduced ? text.length : count;

  useEffect(() => {
    if (!inView || reduced) return;
    const typing = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(typing);
          return c;
        }
        return c + 1;
      });
    }, speedMs);
    return () => clearInterval(typing);
  }, [inView, reduced, speedMs, text.length]);

  // Hide the cursor a moment after typing finishes.
  useEffect(() => {
    if (shown < text.length) return;
    const t = setTimeout(() => setShowCaret(false), 1200);
    return () => clearTimeout(t);
  }, [shown, text.length]);

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      {/* reserves the final width; also the accessible text */}
      <span className="invisible">{text}</span>
      <span aria-hidden className="absolute inset-0 whitespace-nowrap">
        {text.slice(0, shown)}
        {!reduced && showCaret && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-pulse bg-current" />
        )}
      </span>
    </span>
  );
}
