"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TechDemoState } from "@/lib/tech-demo-state";
import {
  frameSrcAt,
  scrubFrameIndexFromProgress,
  TECH_DEMO_FRAMES,
} from "@/lib/tech-demo-media";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";
import { cn } from "@/lib/utils";



type ScrollScrubFramesProps = {
  stateRef: React.MutableRefObject<TechDemoState>;
  sectionActiveRef?: React.MutableRefObject<boolean>;
  className?: string;
};

function loadFrame(index: number, width: 1440 | 1920): Promise<HTMLImageElement> {
  const src = resolvePublicAssetSrc(frameSrcAt(index, width));
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  const ready =
    typeof img.decode === "function"
      ? img.decode().catch(() => {
          // Older browsers can retain the exact JPEG sequence as a fallback.
          img.src = resolvePublicAssetSrc(`/frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`);
          return img.decode().catch(() => {
            console.error(`[ScrollScrubFrames] failed to load frame ${index}: ${src}`);
          });
        })
      : new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`[ScrollScrubFrames] failed to load frame ${index}: ${src}`);
            resolve();
          };
        });
  return ready.then(() => img);
}

/** Nearest frame that has finished loading, searching outward from `index`. */
function nearestLoaded(
  images: (HTMLImageElement | null)[],
  index: number
): HTMLImageElement | null {
  const isLoaded = (img: HTMLImageElement | null) =>
    !!img && img.complete && img.naturalWidth > 0;
  for (let d = 0; d < images.length; d++) {
    const before = images[index - 1 - d];
    if (isLoaded(before)) return before;
    const after = images[index - 1 + d];
    if (isLoaded(after)) return after;
  }
  return null;
}

export function ScrollScrubFrames({
  stateRef,
  sectionActiveRef,
  className,
}: ScrollScrubFramesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TECH_DEMO_FRAMES.count).fill(null)
  );
  const sizeRef = useRef({ width: 0, height: 0 });
  const lastFrameRef = useRef(0);
  const lastProgressRef = useRef(-1);
  const rafRef = useRef(0);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const loadedCountRef = useRef(0);
  const requestFrameRef = useRef<(index: number) => void>(() => {});
  const [firstFramesReady, setFirstFramesReady] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const { width, height } = sizeRef.current;
    if (!ctx || width <= 0 || height <= 0) return;

    const clamped = Math.min(TECH_DEMO_FRAMES.count, Math.max(1, index));
    let img = imagesRef.current[clamped - 1];
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = nearestLoaded(imagesRef.current, clamped);
    }
    if (!img) return;

    lastFrameRef.current = clamped;

    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Canvas backing-store sizing — cover fit + resize handling.
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d", { alpha: false });
      ctxRef.current = ctx;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(lastFrameRef.current || 1);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => {
      ro.disconnect();
    };
  }, [drawFrame]);

  // One immediate frame; demand-driven exact frames and small idle batches.
  // The opening text covers the canvas until scrolling begins, so downloading
  // the complete sequence before that interaction only competes with first paint.
  useEffect(() => {
    let cancelled = false;
    let nearViewport = false;
    let interacted = stateRef.current.progress > 0;
    let timer = 0;
    let idle = 0;
    const width = Math.max(innerWidth, innerHeight * 16 / 9) * Math.min(devicePixelRatio || 1, 2) <= 1440 ? 1440 : 1920;
    const inFlight = new Map<number, Promise<void>>();
    const load = (index: number): Promise<void> => {
      if (cancelled || imagesRef.current[index - 1]) return Promise.resolve();
      const existing = inFlight.get(index);
      if (existing) return existing;
      const task = loadFrame(index, width).then((img) => {
        if (cancelled || !img.naturalWidth) return;
        imagesRef.current[index - 1] = img;
        loadedCountRef.current++;
        setFirstFramesReady(true);
        const current = scrubFrameIndexFromProgress(stateRef.current.progress);
        // A just-loaded nearby frame improves the fallback even when scroll stops.
        if (index === current || !imagesRef.current[current - 1]) drawFrame(current);
        if (indicatorRef.current) indicatorRef.current.style.opacity = String(1 - loadedCountRef.current / TECH_DEMO_FRAMES.count);
        if (loadedCountRef.current === TECH_DEMO_FRAMES.count) setAllLoaded(true);
      }).finally(() => { inFlight.delete(index); });
      inFlight.set(index, task);
      return task;
    };
    const nextPending = () => {
      const wanted = scrubFrameIndexFromProgress(stateRef.current.progress);
      for (let distance = 0; distance < TECH_DEMO_FRAMES.count; distance++) {
        for (const index of [wanted + distance, wanted - distance]) {
          if (index >= 1 && index <= TECH_DEMO_FRAMES.count && !imagesRef.current[index - 1] && !inFlight.has(index)) return index;
        }
      }
      return 0;
    };
    const schedule = () => {
      if (cancelled || timer || idle || !nearViewport || !interacted || loadedCountRef.current === TECH_DEMO_FRAMES.count) return;
      // Yield between batches rather than running a continuous download/decode loop.
      timer = window.setTimeout(() => {
        timer = 0;
        const batch = () => {
          idle = 0;
          if (cancelled || !nearViewport || document.hidden) return;
          const tasks: Promise<void>[] = [];
          for (let slot = inFlight.size; slot < 2; slot++) {
            const index = nextPending();
            if (index) tasks.push(load(index));
          }
          void Promise.all(tasks).then(schedule);
        };
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(batch, { timeout: 500 });
        else batch();
      }, 100);
    };
    const requestCurrent = (index: number) => {
      if (!nearViewport || cancelled) return;
      if (stateRef.current.progress > 0) interacted = true;
      // The requested frame bypasses the background queue, including fast jumps.
      if (inFlight.size < 3) void load(index).then(schedule);
      if (interacted) schedule();
    };
    requestFrameRef.current = requestCurrent;
    const observer = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      if (nearViewport) requestCurrent(scrubFrameIndexFromProgress(stateRef.current.progress));
    }, { rootMargin: "300px" });
    if (containerRef.current) observer.observe(containerRef.current);
    const resume = () => { if (!document.hidden) schedule(); };
    document.addEventListener("visibilitychange", resume);
    return () => {
      cancelled = true;
      observer.disconnect();
      clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
      requestFrameRef.current = () => {};
      document.removeEventListener("visibilitychange", resume);
    };
  }, [drawFrame, stateRef]);

  // Scroll-driven redraw — mirrors the old video-scrub rAF loop: only ticks
  // while progress is still moving, and only redraws on a frame-index change.
  useEffect(() => {
    const tick = () => {
      rafRef.current = 0;

      const active = sectionActiveRef?.current ?? true;
      if (!active) return;

      const progress = stateRef.current.progress;
      const progressMoved = progress !== lastProgressRef.current;
      lastProgressRef.current = progress;

      const frameIndex = scrubFrameIndexFromProgress(progress);
      requestFrameRef.current(frameIndex);
      if (frameIndex !== lastFrameRef.current) {
        drawFrame(frameIndex);
      }

      if (progressMoved) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (rafRef.current) return;
      if (!(sectionActiveRef?.current ?? true)) return;
      rafRef.current = requestAnimationFrame(tick);
    };

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [stateRef, sectionActiveRef, drawFrame]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full bg-black", className)}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "h-full w-full transition-opacity duration-300 ease-out",
          firstFramesReady ? "opacity-100" : "opacity-0"
        )}
        style={{ transform: "translateZ(0)" }}
      />

      {!allLoaded && (
        <div
          ref={indicatorRef}
          className="pointer-events-none absolute right-4 top-4 z-10 h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-sun to-kool"
          aria-hidden
        />
      )}
    </div>
  );
}
