"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerXRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const applyPosition = useCallback(() => {
    rafRef.current = null;
    const el = containerRef.current;
    const clientX = pointerXRef.current;
    if (!el || clientX === null) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const queuePosition = useCallback(
    (clientX: number) => {
      pointerXRef.current = clientX;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(applyPosition);
      }
    },
    [applyPosition]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      queuePosition(e.clientX);
    },
    [queuePosition]
  );

  const handleHandlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      queuePosition(e.clientX);
    },
    [queuePosition]
  );

  const handleHandlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare without and with SUNKOOL window film"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative aspect-[2048/896] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-heat/60"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
        }}
      >
        {/* With SUNKOOL — full base layer */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />

        {/* Without SUNKOOL — clipped to the left of the handle */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Corner tags */}
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:text-xs">
          Without SUNKOOL
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:text-xs">
          With SUNKOOL
        </span>

        {/* Bottom tags (desktop/tablet only) */}
        <span className="pointer-events-none absolute bottom-4 left-4 hidden whitespace-nowrap rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block sm:bottom-6 sm:left-6 sm:text-xs">
          Harsh Glare • More Heat
        </span>
        <span className="pointer-events-none absolute bottom-4 right-4 hidden whitespace-nowrap rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block sm:bottom-6 sm:right-6 sm:text-xs">
          Clearer View • Cooler Cabin
        </span>

        {/* Drag hint, anchored just below the handle (desktop/tablet only — no room on mobile without overlapping the tags above) */}
        <span className="pointer-events-none absolute top-[58%] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block">
          Drag to Compare
        </span>

        {/* Divider line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-heat shadow-[0_0_16px_rgba(255,122,31,0.55)]"
          style={{ left: `${position}%` }}
        />

        {/* Handle */}
        <div className="pointer-events-none absolute top-1/2" style={{ left: `${position}%` }}>
          <div
            onPointerDown={handleHandlePointerDown}
            onPointerMove={handleHandlePointerMove}
            onPointerUp={handleHandlePointerUp}
            onPointerCancel={handleHandlePointerUp}
            style={{ touchAction: "none" }}
            className={`pointer-events-auto flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-white/30 bg-heat text-white shadow-lg shadow-black/50 transition-transform duration-200 ease-[var(--ease-lux)] active:cursor-grabbing ${
              dragging ? "scale-110" : "hover:scale-105"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6l-6 6 6 6M15 6l6 6-6 6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Drag hint, shown below the image on mobile where there's no room to overlay it */}
      <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-wide text-silver-soft sm:hidden">
        Drag to Compare
      </p>
    </div>
  );
}
