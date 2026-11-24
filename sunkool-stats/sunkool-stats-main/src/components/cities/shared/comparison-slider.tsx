"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { IconDragHandle } from "./icons";

export default function ComparisonSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    updateFromClientX(event.clientX);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };
  const stopDragging = () => setDragging(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (event.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare without and with SUNKOOL window film"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        onKeyDown={onKeyDown}
        className="relative aspect-[4/3] w-full min-h-[260px] select-none overflow-hidden rounded-2xl border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-heat/60 sm:aspect-[16/10] sm:min-h-0 lg:aspect-[2048/896]"
        style={{ touchAction: "pan-y" }}
      >
        <Image
          src="/images/windshield-after.jpg"
          alt="Reduced glare and a cooler cabin through a car windshield with SUNKOOL nano-ceramic window film"
          loading="lazy"
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src="/images/windshield-before.jpg"
            alt="Harsh sunlight and glare through a car windshield without SUNKOOL window film"
            loading="lazy"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 whitespace-nowrap rounded-full bg-black/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:px-3 sm:py-1.5 sm:text-xs">
          Without SUNKOOL
        </span>
        <span className="pointer-events-none absolute right-3 top-3 whitespace-nowrap rounded-full bg-black/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:px-3 sm:py-1.5 sm:text-xs">
          With SUNKOOL
        </span>
        <span className="pointer-events-none absolute bottom-6 left-6 hidden rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block">
          Harsh Glare • More Heat
        </span>
        <span className="pointer-events-none absolute bottom-6 right-6 hidden rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-silver-soft backdrop-blur-sm sm:block">
          Clearer View • Cooler Cabin
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-heat shadow-[0_0_16px_rgba(255,122,31,0.55)]"
          style={{ left: `${position}%` }}
        />
        <div className="absolute top-1/2" style={{ left: `${position}%` }}>
          <div className="flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border border-white/30 bg-heat text-white shadow-lg shadow-black/50 transition-transform duration-200 ease-[var(--ease-lux)] cursor-ew-resize hover:scale-105">
            <IconDragHandle />
          </div>
        </div>
      </div>

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
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-fog">
          <IconDragHandle size={14} />
          Drag the handle to compare
        </p>
      </div>
    </div>
  );
}
