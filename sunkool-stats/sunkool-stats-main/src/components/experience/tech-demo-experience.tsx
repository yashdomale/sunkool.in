"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  createTechDemoState,
  updateTechDemoState,
  uiStateChanged,
  type TechDemoState,
} from "@/lib/tech-demo-state";
import {
  setImmersiveChrome,
  resetImmersiveChrome,
} from "@/lib/immersive-store";
import { getViewportHeight, isCoarsePointer } from "@/lib/viewport";
import { ColdOpen } from "./cold-open";
import { TempHud } from "./temp-hud";
import { TechDemoProgress } from "./tech-demo-progress";
import { RevealTaglinePanel } from "./reveal-tagline-panel";
import { SceneHeadline } from "./scene-headline";
import { MobileHeroPhoto } from "./mobile-hero-photo";

/** Matches the `lg` breakpoint used across the home hero components. */
const DESKTOP_QUERY = "(min-width: 1024px)";
const ScrollScrubFrames = dynamic(
  () => import("./scroll-scrub-frames").then((module) => module.ScrollScrubFrames),
  { ssr: false }
);

export function TechDemoExperience({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionHeightRef = useRef(0);
  const sectionActiveRef = useRef(true);
  const stateRef = useRef<TechDemoState>(createTechDemoState());
  const lastChromeRef = useRef({
    navVisible: false,
    hudVisible: false,
  });
  const [ui, setUi] = useState(createTechDemoState);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsMobile(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile === null) return;
    if (isMobile) {
      resetImmersiveChrome();
      return;
    }
    setImmersiveChrome({
      navVisible: false,
      hudVisible: false,
    });
    return () => resetImmersiveChrome();
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      if (sectionRef.current) {
        sectionHeightRef.current = sectionRef.current.offsetHeight;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, [isMobile]);

  const syncProgress = useCallback((p: number, forceUi = false) => {
    const prev = stateRef.current;
    if (!forceUi && Math.abs(p - prev.progress) < 0.00015 && p < 1) return;

    const next = updateTechDemoState(prev, p);
    stateRef.current = next;

    if (!forceUi && !uiStateChanged(prev, next)) return;

    setUi(next);

    const chrome = {
      navVisible: next.progress >= 1,
      hudVisible: next.hudVisible,
    };
    const last = lastChromeRef.current;
    if (
      last.navVisible !== chrome.navVisible ||
      last.hudVisible !== chrome.hudVisible
    ) {
      lastChromeRef.current = chrome;
      setImmersiveChrome(chrome);
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const mobile = isCoarsePointer();
    if (mobile === stateRef.current.isMobile) return;
    stateRef.current = { ...stateRef.current, isMobile: mobile };
    syncProgress(stateRef.current.progress, true);
  }, [syncProgress, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    let frame = 0;
    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewport = getViewportHeight();
      sectionActiveRef.current = rect.bottom > 0 && rect.top < viewport;

      if (!sectionActiveRef.current && stateRef.current.progress >= 1) return;

      const total = (sectionHeightRef.current || el.offsetHeight) - viewport;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      syncProgress(p, frame < 2);
      frame++;
    };

    // Coalesce bursts of scroll/resize events into one layout read + update per frame.
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [syncProgress, isMobile]);

  const heroH1 = (
    <h1 className="sr-only">
      India&rsquo;s No. 1 Heat Control Glazing &amp; Paint Protection Film
    </h1>
  );

  // Keep the desktop section mounted across hydration so early scrolling
  // retains its position. CSS selects the appropriate SSR hero immediately.
  if (isMobile === true) {
    return (
      <>
        {heroH1}
        <div className="lg:hidden"><MobileHeroPhoto /></div>
        {children}
      </>
    );
  }

  return (
    <>
      {heroH1}
      {isMobile === null && <div className="lg:hidden"><MobileHeroPhoto /></div>}
      <section
        ref={sectionRef}
        className={`relative h-[250vh] w-full sm:h-[280vh] lg:h-[320vh] ${isMobile === null ? "hidden lg:block" : ""}`}
      >
        <div
          className="sticky top-0 h-[100svh] min-h-[100dvh] w-full overflow-hidden bg-black pb-[env(safe-area-inset-bottom)]"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
          <div className="absolute inset-0">
            <ColdOpen progress={ui.progress} />

            {isMobile === false && <ScrollScrubFrames
              stateRef={stateRef}
              sectionActiveRef={sectionActiveRef}
              className="absolute inset-0 z-[5]"
            />}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-20 bg-gradient-to-t from-black/60 to-transparent lg:h-[18vh] lg:from-black/50" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-28 bg-gradient-to-b from-black/50 to-transparent lg:hidden" />
          </div>

          {/* Scrim between the frame canvas (z-[5]) and the text overlays
              (z-[11]/z-[12]) — darkens toward the right where RevealTaglinePanel
              sits, so its text stays legible against bright frames. */}
          <div
            className="pointer-events-none absolute inset-0 z-[8]"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
            }}
            aria-hidden
          />

          {ui.hudVisible && (
            <TempHud
              outside={ui.outsideTemp}
              cabin={ui.cabinTemp}
            />
          )}

          {ui.scene === "protection" && (
            <SceneHeadline local={ui.sceneLocal} />
          )}

          {ui.scene === "reveal" && (
            <RevealTaglinePanel local={ui.sceneLocal} />
          )}

          <TechDemoProgress stateRef={stateRef} />
        </div>
      </section>

      {children}
    </>
  );
}
