"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedNumber from "@/components/cities/content/mumbai/components/animated-number";
import { SHIELD_PATH } from "@/components/cities/content/mumbai/components/landing-icons";

const rows = [
  {
    key: "heat",
    icon: "thermometer" as const,
    prefix: "Up to ",
    end: 95,
    suffix: "%",
    label: "IR Heat Rejection",
    ariaLabel: "Up to 95 percent IR heat rejection",
  },
  {
    key: "uv",
    icon: "shield" as const,
    prefix: "",
    end: 99,
    suffix: "–100%",
    label: "UV Protection",
    ariaLabel: "99 to 100 percent UV protection",
  },
  {
    key: "signal",
    icon: "signal" as const,
    prefix: "",
    end: 100,
    suffix: "%",
    label: "Signal Safe",
    ariaLabel: "100 percent signal safe",
  },
];

function ThermometerIcon() {
  return (
    <svg viewBox="0 0 64 64" className="ps-icon-svg" aria-hidden="true" focusable="false">
      <circle
        className="ps-arc"
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="78 100"
      />
      <path
        className="ps-draw"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={100}
        strokeDasharray="100"
        d="M29 15v20.6a6.5 6.5 0 1 0 6 0V15M26 15h9"
      />
      <circle className="ps-fill-in" cx="32" cy="46.5" r="3.2" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ps-icon-svg" aria-hidden="true" focusable="false">
      <circle className="ps-pulse" cx="12" cy="11.2" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        className="ps-draw"
        d={SHIELD_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray="100"
      />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 40 40" className="ps-icon-svg" aria-hidden="true" focusable="false">
      <circle className="ps-ring ps-ring-1" cx="12" cy="28" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle className="ps-ring ps-ring-2" cx="12" cy="28" r="15" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect className="ps-bar ps-bar-1" x="6" y="24" width="4.5" height="8" rx="1.2" fill="currentColor" />
      <rect className="ps-bar ps-bar-2" x="14.5" y="17" width="4.5" height="15" rx="1.2" fill="currentColor" />
      <rect className="ps-bar ps-bar-3" x="23" y="9" width="4.5" height="23" rx="1.2" fill="currentColor" />
    </svg>
  );
}

const ICONS = {
  thermometer: ThermometerIcon,
  shield: ShieldIcon,
  signal: SignalIcon,
};

/** Right column of the "Get Started" section: three benefit rows built from
 * real HTML/SVG (no images) — an animated count-up per row plus a small,
 * once-only entrance animation on each icon, triggered when the block
 * scrolls into view. */
export default function ProtectionStats() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setInView(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`protection-stats ${inView ? "in-view" : ""}`}>
      <p className="reveal-fade-up eyebrow text-kool">Protection at a Glance</p>

      <div className="reveal-stagger mt-8 space-y-8">
        {rows.map((row) => {
          const IconComp = ICONS[row.icon];
          return (
            <div key={row.key} className="flex items-center gap-5">
              <span className="ps-icon flex h-16 w-16 shrink-0 items-center justify-center text-kool">
                <IconComp />
              </span>
              <div>
                <p
                  className="text-gradient-silver-cyan font-display text-4xl font-extrabold sm:text-5xl"
                  aria-label={row.ariaLabel}
                >
                  {row.prefix && <span className="static-part">{row.prefix}</span>}
                  <AnimatedNumber end={row.end} />
                  <span className="static-part">{row.suffix}</span>
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                  {row.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="reveal-fade-up mt-10 border-t border-white/10 pt-8 font-display text-lg font-semibold text-white sm:text-xl">
        Cooler cabin. <span className="text-kool">Clearer drive.</span>
      </p>
    </div>
  );
}
