"use client";

import { useEffect, useRef } from "react";
import type { TechDemoState } from "@/lib/tech-demo-state";

export function TechDemoProgress({
  stateRef,
}: {
  stateRef: React.MutableRefObject<TechDemoState>;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const lastProgressRef = useRef(-1);
  const lastCoolRef = useRef(-1);

  useEffect(() => {
    const paint = () => {
      rafRef.current = 0;
      const { progress, cool } = stateRef.current;
      if (
        Math.abs(progress - lastProgressRef.current) < 0.001 &&
        Math.abs(cool - lastCoolRef.current) < 0.02
      ) {
        return;
      }
      lastProgressRef.current = progress;
      lastCoolRef.current = cool;
      const bar = barRef.current;
      if (!bar) return;
      bar.style.transform = `scaleX(${progress})`;
      bar.style.background = `linear-gradient(90deg, #f47521 0%, #f47521 ${Math.max(0, (1 - cool) * 50)}%, #58a7e8 ${cool * 100}%)`;
    };

    const wake = () => {
      paint();
      if (rafRef.current) return;
      // One extra frame so late scroll updates still land.
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        paint();
      });
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", wake);
    };
  }, [stateRef]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-0 pb-[env(safe-area-inset-bottom)]">
      <div className="h-[3px] w-full bg-white/6">
        <div
          ref={barRef}
          className="h-full w-full origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
