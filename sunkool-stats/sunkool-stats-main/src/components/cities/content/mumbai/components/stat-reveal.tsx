"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COUNTER_DURATION_MS = 600;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Part =
  | { type: "text"; text: string }
  | { type: "number"; target: number; decimals: number; text: string };

function tokenize(value: string): Part[] {
  const regex = /\d+(\.\d+)?/g;
  const parts: Part[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value))) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: value.slice(lastIndex, match.index) });
    }
    const decimals = match[1] ? match[1].length - 1 : 0;
    parts.push({ type: "number", target: parseFloat(match[0]), decimals, text: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < value.length) {
    parts.push({ type: "text", text: value.slice(lastIndex) });
  }
  return parts;
}

export default function StatReveal({
  value,
  className = "",
  index = 0,
  from,
}: {
  value: string;
  className?: string;
  index?: number;
  from?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const parts = tokenize(value);
    const hasNumbers = parts.some((part) => part.type === "number");

    let rafId: number | null = null;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: container,
        start: "top 65%",
        toggleActions: "play none none none",
        once: true,
      };

      if (!hasNumbers) {
        gsap.fromTo(
          container,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger }
        );
        return;
      }

      // Collect every number in this value (a stat can read e.g. "99%",
      // two numbers) and fade each digit in with GSAP — unchanged from
      // before, this is just the entrance pop, not the counter itself.
      const counters: {
        el: HTMLSpanElement;
        start: number;
        target: number;
        decimals: number;
      }[] = [];

      let numberIndex = -1;
      parts.forEach((part) => {
        if (part.type !== "number") return;
        numberIndex += 1;
        const el = numberRefs.current[numberIndex];
        if (!el) return;

        let start: number;
        if (numberIndex === 0 && from !== undefined) {
          start = from;
        } else {
          const offset = Math.min(8, Math.max(3, Math.round(part.target * 0.05)));
          start = Math.max(0, part.target - offset);
        }
        el.textContent = start.toFixed(part.decimals);
        counters.push({ el, start, target: part.target, decimals: part.decimals });

        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out", scrollTrigger }
        );
      });

      // The count-up itself: one requestAnimationFrame loop, started the
      // instant this stat enters the viewport, driving every number in it
      // to its target over a fixed 600ms with no per-counter stagger.
      ScrollTrigger.create({
        trigger: container,
        start: "top 65%",
        once: true,
        onEnter: () => {
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / COUNTER_DURATION_MS);
            const eased = easeOutCubic(t);

            for (const counter of counters) {
              const current = counter.start + (counter.target - counter.start) * eased;
              counter.el.textContent = current.toFixed(counter.decimals);
            }

            if (t < 1) {
              rafId = requestAnimationFrame(tick);
              return;
            }

            rafId = null;
          };

          rafId = requestAnimationFrame(tick);
        },
      });
    }, container);

    return () => {
      ctx.revert();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [value, from]);

  const parts = tokenize(value);
  return (
    <span ref={containerRef} className={className}>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={i}>{part.text}</span>;
        }
        const ni = parts.slice(0, i).filter(item => item.type !== 'text').length;
        return (
          <span
            key={i}
            ref={(el) => {
              numberRefs.current[ni] = el;
            }}
          >
            {part.text}
          </span>
        );
      })}
    </span>
  );
}
