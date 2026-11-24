"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./use-in-view";

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useAnimatedNumber(target: number, inView: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    if (!inView) return;

    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      valueRef.current = target;
      queueMicrotask(() => setValue(target));
      return;
    }

    let raf: number;
    const start = performance.now();
    const from = valueRef.current;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next = Math.round(from + (target - from) * easeOutExpo(t));
      valueRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return value;
}

type StatNumberProps = {
  target: number;
  prefix?: string;
  suffix?: string;
  /** No longer rendered: the figure itself is in the HTML as text. Kept so callers need not change. */
  ariaLabel?: string;
  minWidth?: string;
  className?: string;
};

export function StatNumber({ target, prefix, suffix, minWidth = "2ch", className = "" }: StatNumberProps) {
  const { ref, inView } = useInView<HTMLParagraphElement>(0.4);
  const value = useAnimatedNumber(target, inView);

  return (
    <p ref={ref} className={`stat-value font-display ${className}`}>
      {/* The real figure, in the server HTML for search engines and read once by screen readers; the
          visible digits below count up from 0 when the number scrolls into view. */}
      <span className="sr-only">{`${prefix ?? ""}${target}${suffix ?? ""}`}</span>
      {prefix ? <span aria-hidden="true" className="static-part">{prefix}</span> : null}
      <span aria-hidden="true" className="animated-number" style={{ minWidth }}>
        {value}
      </span>
      {suffix ? <span aria-hidden="true" className="static-part">{suffix}</span> : null}
    </p>
  );
}

type StatRangeProps = {
  from: number;
  to: number;
  suffix?: string;
  /** No longer rendered: the figure itself is in the HTML as text. Kept so callers need not change. */
  ariaLabel?: string;
  className?: string;
};

export function StatRange({ from, to, suffix = "%", className = "" }: StatRangeProps) {
  const { ref, inView } = useInView<HTMLParagraphElement>(0.4);
  const fromValue = useAnimatedNumber(from, inView);
  const toValue = useAnimatedNumber(to, inView, 1400);

  return (
    <p ref={ref} className={`stat-value font-display ${className}`}>
      <span className="sr-only">{`${from}–${to}${suffix}`}</span>
      <span aria-hidden="true" className="animated-number" style={{ minWidth: "2ch" }}>
        {fromValue}
      </span>
      <span aria-hidden="true" className="static-part">&#8211;</span>
      <span aria-hidden="true" className="animated-number" style={{ minWidth: "3ch" }}>
        {toValue}
      </span>
      <span aria-hidden="true" className="static-part">{suffix}</span>
    </p>
  );
}
