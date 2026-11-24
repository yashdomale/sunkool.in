"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
}: {
  value: string;
  className?: string;
  index?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const stagger = index * 0.08;
    const parts = tokenize(value);
    const hasNumbers = parts.some((part) => part.type === "number");

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: container,
        start: "top 88%",
        toggleActions: "play none none none",
        once: true,
      };

      if (!hasNumbers) {
        gsap.fromTo(
          container,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, delay: stagger, ease: "power2.out", scrollTrigger }
        );
        return;
      }

      let numberIndex = -1;
      parts.forEach((part) => {
        if (part.type !== "number") return;
        numberIndex += 1;
        const el = numberRefs.current[numberIndex];
        if (!el) return;

        const offset = Math.min(8, Math.max(3, Math.round(part.target * 0.05)));
        const start = Math.max(0, part.target - offset);
        const proxy = { val: start };
        el.textContent = start.toFixed(part.decimals);

        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.4, delay: stagger, ease: "power2.out", scrollTrigger }
        );

        gsap.to(proxy, {
          val: part.target,
          duration: 0.45,
          delay: stagger,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = proxy.val.toFixed(part.decimals);
          },
          scrollTrigger,
        });
      });
    }, container);

    return () => ctx.revert();
  }, [value, index]);

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
