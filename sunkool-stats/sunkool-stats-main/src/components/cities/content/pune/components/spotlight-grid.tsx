"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a card grid with a single shared cursor-tracking spotlight that
 * spans the whole grid (including the gaps between cards), rather than a
 * spotlight clipped to each individual card. Position is smoothed with a
 * lerp inside requestAnimationFrame so it never updates React state on
 * every pointer move.
 */
export default function SpotlightGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !overlay) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduceMotion || !canHover) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId: number | null = null;
    let hovering = false;

    const step = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      overlay.style.setProperty("--mouse-x", `${current.x}px`);
      overlay.style.setProperty("--mouse-y", `${current.y}px`);

      const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5;
      if (hovering || !settled) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    };

    const ensureLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(step);
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = wrapper.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      ensureLoop();
    };

    const handleEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = true;
      overlay.style.opacity = "1";
      ensureLoop();
    };

    const handleLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = false;
      overlay.style.opacity = "0";
    };

    wrapper.addEventListener("pointermove", handleMove);
    wrapper.addEventListener("pointerenter", handleEnter);
    wrapper.addEventListener("pointerleave", handleLeave);

    return () => {
      wrapper.removeEventListener("pointermove", handleMove);
      wrapper.removeEventListener("pointerenter", handleEnter);
      wrapper.removeEventListener("pointerleave", handleLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {children}
      <div ref={overlayRef} aria-hidden="true" className="spotlight-grid-glow pointer-events-none absolute inset-0" />
    </div>
  );
}
