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
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingXRef = useRef<number | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(95, Math.max(5, pct)));
  }, []);

  const scheduleUpdate = useCallback(
    (clientX: number) => {
      pendingXRef.current = clientX;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingXRef.current !== null) updateFromClientX(pendingXRef.current);
      });
    },
    [updateFromClientX]
  );

  const stopDragging = useCallback(() => {
    setDragging(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingXRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare without and with SUNKOOL window film"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative aspect-[4/3] w-full min-h-[260px] select-none overflow-hidden rounded-2xl border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-heat/60 sm:aspect-[16/10] sm:min-h-0 lg:aspect-[2048/896]"
        style={{ touchAction: "pan-y" }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setHasInteracted(true);
            setPosition((p) => Math.max(5, p - 5));
          }
          if (e.key === "ArrowRight") {
            setHasInteracted(true);
            setPosition((p) => Math.min(95, p + 5));
          }
        }}
      >
        {/* With SUNKOOL — full base layer */}
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover object-center"
        />

        {/* Without SUNKOOL — clipped to the left of the handle */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Corner tags */}
        <span className="pointer-events-none absolute left-3 top-3 whitespace-nowrap rounded-full bg-black/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:px-3 sm:py-1.5 sm:text-xs">
          Without SUNKOOL
        </span>
        <span className="pointer-events-none absolute right-3 top-3 whitespace-nowrap rounded-full bg-black/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:px-3 sm:py-1.5 sm:text-xs">
          With SUNKOOL
        </span>

        {/* Bottom tags — moved to a legend below the card on mobile; kept in-image from sm+ */}
        <span className="pointer-events-none absolute bottom-6 left-6 hidden rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block">
          Harsh Glare • More Heat
        </span>
        <span className="pointer-events-none absolute bottom-6 right-6 hidden rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block">
          Clearer View • Cooler Cabin
        </span>

        {/* Drag hint, anchored just below the handle — desktop/tablet only */}
        <span className="pointer-events-none absolute top-[58%] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block">
          Drag to Compare
        </span>

        {/* Divider line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-heat shadow-[0_0_16px_rgba(255,122,31,0.55)]"
          style={{ left: `${position}%` }}
        />

        {/* Handle */}
        <div className="absolute top-1/2" style={{ left: `${position}%` }}>
          <div
            className={`flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border border-white/30 bg-heat text-white shadow-lg shadow-black/50 transition-transform duration-200 ease-[var(--ease-lux)] cursor-ew-resize ${
              dragging ? "scale-110 cursor-grabbing" : "hover:scale-105"
            }`}
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              setHasInteracted(true);
            }}
            onPointerMove={(e) => {
              if (!dragging) return;
              scheduleUpdate(e.clientX);
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              stopDragging();
            }}
            onPointerCancel={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              stopDragging();
            }}
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

      {/* Mobile-only legend + drag hint, below the card */}
      <div className="mt-3 sm:hidden">
        <div className="grid grid-cols-2 gap-2 max-[349px]:grid-cols-1">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center">
            <span aria-hidden="true" className="mx-auto mb-1.5 block h-1.5 w-1.5 rounded-full bg-heat" />
            <p className="text-[11px] font-medium leading-snug text-silver-soft">
              Harsh glare
              <br />
              More heat
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center">
            <span aria-hidden="true" className="mx-auto mb-1.5 block h-1.5 w-1.5 rounded-full bg-kool" />
            <p className="text-[11px] font-medium leading-snug text-silver-soft">
              Clearer view
              <br />
              Cooler cabin
            </p>
          </div>
        </div>

        <p
          className={`mt-3 flex items-center justify-center gap-1.5 text-[11px] text-fog transition-opacity duration-500 ${
            hasInteracted ? "opacity-0" : "opacity-100"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6l-6 6 6 6M15 6l6 6-6 6"
            />
          </svg>
          Drag the handle to compare
        </p>
      </div>
    </div>
  );
}
