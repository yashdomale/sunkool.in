"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./feature-timeline.css";
import {
  TIMELINE_ENTER_LINE,
  TIMELINE_LEAD,
  horizontalFrame,
  verticalFrame,
  type HorizontalLayout,
  type VerticalLayout,
} from "@/lib/scroll-timeline";

const DESKTOP = "(min-width: 900px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

type Mode = "static" | "h" | "v";

/**
 * Scroll timeline for the home feature points (markup: feature-highlights.tsx,
 * styling: globals.css "Home feature timeline", arithmetic: lib/scroll-timeline.ts).
 *
 *  - Desktop (>= 900px): the stage pins (position: sticky), the track slides
 *    sideways as you scroll, the line fills and each point lights as it is reached.
 *  - Mobile: a vertical list; points light as they pass 65% of the screen height.
 *  - Reduced motion, or before this runs / without JS: the plain static list.
 *
 * Everything is a pure function of scroll position, so it reverses on scroll up.
 * Pinning relies on sticky positioning, so no ancestor may be a scroll container
 * (`overflow-x: clip` on html/body is fine).
 *
 * The elements it drives are server-rendered and never re-rendered by React, so
 * classes and styles are applied imperatively — no state, no re-renders on scroll.
 * Work only happens while the section is within a viewport of the screen, so it
 * costs nothing during the hero scroll above it.
 *
 * `lead` is rendered inside the pinned stage, above the timeline (the home stats
 * row), so it stays on screen while the points play. Where nothing pins (mobile,
 * reduced motion) it is simply a block above the list.
 */
export function FeatureTimeline({ children, lead }: { children: ReactNode; lead?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const line = lineRef.current;
    const fill = fillRef.current;
    if (!root || !stage || !viewport || !track || !line || !fill) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".stl-item"));
    if (items.length === 0) return;

    const mqDesktop = window.matchMedia(DESKTOP);
    const mqReduced = window.matchMedia(REDUCED);
    let mode: Mode = "static";
    let raf = 0;
    let near = false;
    let cancelled = false;
    let horizontal: HorizontalLayout | null = null;
    let vertical: VerticalLayout | null = null;

    const measure = () => {
      const last = items.length - 1;
      const lefts = items.map((el) => el.offsetLeft);
      const tops = items.map((el) => el.offsetTop);
      horizontal = null;
      vertical = null;
      if (mode === "h") {
        // centre the pinned stage on screen (the CSS keeps it below the navbar);
        // must be set before stickyTop is read from the computed style below
        stage.style.setProperty(
          "--stl-center",
          `${Math.max(0, (window.innerHeight - stage.offsetHeight) / 2)}px`
        );
        const length = lefts[last] - lefts[0];
        const viewportWidth = viewport.clientWidth;
        const dist = Math.max(0, track.offsetWidth - viewportWidth);
        horizontal = {
          stickyTop: parseFloat(getComputedStyle(stage).top) || 0,
          dist,
          viewportWidth,
          firstItemWidth: items[0].offsetWidth,
          lefts,
          length,
        };
        // the scroll distance the pin lasts
        root.style.height = `${stage.offsetHeight + dist + TIMELINE_LEAD}px`;
        line.style.setProperty("--stl-len", `${length}px`);
      } else {
        const length = tops[last] - tops[0];
        if (mode === "v") vertical = { tops, length };
        root.style.height = "";
        line.style.setProperty("--stl-len", `${length}px`);
      }
    };

    const update = () => {
      raf = 0;
      if (mode === "static" || !near) return;

      if (mode === "h" && horizontal) {
        const top = root.getBoundingClientRect().top;
        const frame = horizontalFrame(top, horizontal);
        track.style.transform = `translate3d(${frame.x}px,0,0)`;
        viewport.style.setProperty("--stl-fl", `${frame.fadePercent}%`);
        fill.style.transform = `scaleX(${frame.fill})`;
        root.classList.toggle("is-in", top < window.innerHeight * TIMELINE_ENTER_LINE);
        items.forEach((el, i) => el.classList.toggle("is-on", frame.active[i]));
      } else if (mode === "v" && vertical) {
        const frame = verticalFrame(
          items[0].getBoundingClientRect().top,
          window.innerHeight,
          vertical
        );
        fill.style.transform = `scaleY(${frame.fill})`;
        items.forEach((el, i) => el.classList.toggle("is-on", frame.active[i]));
      }
    };

    const request = () => {
      if (!raf && !cancelled) raf = requestAnimationFrame(update);
    };
    const refresh = () => {
      measure();
      request();
    };

    const setMode = () => {
      mode = mqReduced.matches ? "static" : mqDesktop.matches ? "h" : "v";
      root.classList.toggle("stl--js", mode !== "static");
      root.classList.toggle("stl--h", mode === "h");
      root.classList.toggle("stl--v", mode === "v");
      root.classList.toggle("is-in", mode === "v");
      track.style.transform = "";
      fill.style.transform = "";
      viewport.style.removeProperty("--stl-fl");
      items.forEach((el) => el.classList.remove("is-on"));
      refresh();
    };

    // Only track scrolling while the section is within a screen of the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) request();
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(root);

    // The track's size depends on its content (fonts, wrapping), not on the
    // height we set on the root, so observing it cannot loop.
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(track);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", refresh);
    mqDesktop.addEventListener("change", setMode);
    mqReduced.addEventListener("change", setMode);
    void document.fonts?.ready.then(() => {
      if (!cancelled) refresh();
    });
    setMode();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", refresh);
      mqDesktop.removeEventListener("change", setMode);
      mqReduced.removeEventListener("change", setMode);
      root.classList.remove("stl--js", "stl--h", "stl--v", "is-in");
      root.style.height = "";
      stage.style.removeProperty("--stl-center");
      track.style.transform = "";
      fill.style.transform = "";
      viewport.style.removeProperty("--stl-fl");
      line.style.removeProperty("--stl-len");
      items.forEach((el) => el.classList.remove("is-on"));
    };
  }, []);

  return (
    <div ref={rootRef} className="stl">
      <div ref={stageRef} className="stl-stage">
        {lead ? <div className="stl-lead">{lead}</div> : null}
        <div ref={viewportRef} className="stl-viewport">
          <div ref={trackRef} className="stl-track">
            <div ref={lineRef} className="stl-line" aria-hidden="true">
              <div ref={fillRef} className="stl-fill" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
