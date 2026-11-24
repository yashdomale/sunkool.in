"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CountUp({
  target,
  suffix = "",
  duration = 1.2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduced = useReducedMotion();
  // Server/initial render always shows the final value — crawlers and
  // no-JS clients see the real number. The count-from-0 animation is a
  // post-mount enhancement layered on top once the element scrolls into view.
  const [value, setValue] = useState(target);
  const hasAnimated = useRef(false);
  const seenMount = useRef(false);

  useEffect(() => {
    if (reduced || hasAnimated.current) return;

    // Already in the viewport on first paint: keep the SSR target — resetting
    // to 0 here is what caused the visible 99 → 0 → 99 flicker.
    if (inView && !seenMount.current) {
      hasAnimated.current = true;
      seenMount.current = true;
      return;
    }

    seenMount.current = true;
    if (!inView) return;

    hasAnimated.current = true;
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);

  const digits = String(target).length + suffix.length;

  return (
    <span
      ref={ref}
      className="inline-block tabular-nums"
      style={{ minWidth: `${digits}ch` }}
    >
      {value}
      {suffix}
    </span>
  );
}
