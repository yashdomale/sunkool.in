"use client";
import { useEffect, useRef } from "react";

/**
 * Deterministic floating particle field (SSR-safe, no Math.random at render).
 *
 * Each dot is a plain CSS keyframe animation of transform + opacity (`particle-float`
 * in globals.css), which runs on the compositor and costs the main thread nothing
 * once started. It used to be 36 Motion animations: every frame they wrote 36 inline
 * transforms from JS and repainted the layers underneath, which kept the main thread
 * 50-90% busy on a mid-range phone and queued every tap behind that work.
 *
 * The field spans the whole page (often 10,000px+), so only 2-3 dots are on screen at a time,
 * yet every running animation is its own GPU layer and forces the content painted above it
 * onto layers too: 36 always-on dots doubled the page's layer count and halved scroll fps
 * on a throttled CPU. So each dot only animates while it is near the viewport (`data-on`);
 * the rest sit still and cost nothing. The tab being hidden pauses everything.
 */
export function FloatingParticles({
  count = 36,
  color = "rgba(88,167,232,0.5)",
}: {
  count?: number;
  color?: string;
}) {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const sync = () => {
      el.dataset.paused = document.hidden ? "true" : "false";
    };
    sync();
    // Start a dot's animation a little before it scrolls into view, stop it once it is well out.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).toggleAttribute("data-on", entry.isIntersecting);
        }
      },
      { rootMargin: "300px 0px" }
    );
    el.querySelectorAll<HTMLElement>(".particle").forEach((dot) => observer.observe(dot));
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const dots = Array.from({ length: count });
  return (
    <div ref={field} className="particle-field pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const left = (i * 61) % 100;
        const top = (i * 37) % 100;
        const size = 1 + (i % 3);
        const dur = 6 + (i % 7);
        const delay = (i % 5) * 0.6;
        return (
          <span
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: color,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
