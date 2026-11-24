"use client";

import { useCallback, useRef, useState } from "react";
import { MediaSlot, MEDIA_SIZES_FULL } from "@/components/media/media-slot";

/**
 * Drag (or use the arrow keys) to reveal the "before" image over the "after" one. Vertical swipes
 * still scroll the page on touch screens.
 */
export function BeforeAfterSlider({
  before,
  after,
  ariaLabel,
  afterAccent,
  afterLabelClass,
}: {
  before: { src: string; alt: string; fileHint: string };
  after: { src: string; alt: string; fileHint: string };
  ariaLabel: string;
  /** Placeholder accent of the "after" image while it is missing. */
  afterAccent: string;
  /** Text colour of the "After" tag, e.g. "text-silver". */
  afterLabelClass: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const dragging = useRef(false);

  const onMove = useCallback((clientX: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(98, Math.max(2, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    onMove(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) onMove(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSplit((s) => Math.max(2, s - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSplit((s) => Math.min(98, s + 5));
    }
  };

  return (
    <div
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={2}
      aria-valuemax={98}
      aria-valuenow={Math.round(split)}
      className="relative aspect-[16/10] cursor-ew-resize overflow-hidden rounded-3xl border border-white/10 select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0">
        <MediaSlot
          src={after.src}
          alt={after.alt}
          fillParent
          aspect="16/9"
          accent={afterAccent}
          label="After"
          fileHint={after.fileHint}
          sizes={MEDIA_SIZES_FULL}
          className="h-full rounded-none border-0"
        />
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <MediaSlot
          src={before.src}
          alt={before.alt}
          fillParent
          aspect="16/9"
          accent="#f47521"
          label="Before"
          fileHint={before.fileHint}
          sizes={MEDIA_SIZES_FULL}
          className="h-full rounded-none border-0"
        />
      </div>
      <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
        Before
      </div>
      <div className={`absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${afterLabelClass}`}>
        After
      </div>
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        style={{ left: `${split}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/70 backdrop-blur">
          <span className="text-xs text-white">↔</span>
        </div>
      </div>
    </div>
  );
}
