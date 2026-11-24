"use client";
import { CityExploreMore } from "@/components/cities/city-explore-more";

import { useState } from "react";
import AnimatedNumber from "@/components/cities/content/mumbai/components/animated-number";
import GlowCard from "@/components/cities/content/mumbai/components/glow-card";

type Film = {
  name: string;
  vlt: number;
  tser: number;
  ir: number;
  uv: number;
  tagline: string;
};

const featureIcons = [
  { label: "High Heat Rejection", icon: "sun" },
  { label: "No Signal Interference", icon: "signal" },
  { label: "High UV Protection", icon: "shield" },
  { label: "Enhanced Clarity", icon: "eye" },
] as const;

function SunRays({ cx, cy, r = 4, rayLen = 3 }: { cx: number; cy: number; r?: number; rayLen?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => 45 * i);
  return (
    <>
      <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="2" />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r + 1.5);
        const y1 = cy + Math.sin(rad) * (r + 1.5);
        const x2 = cx + Math.cos(rad) * (r + 1.5 + rayLen);
        const y2 = cy + Math.sin(rad) * (r + 1.5 + rayLen);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        );
      })}
    </>
  );
}

function FeatureIcon({ icon }: { icon: (typeof featureIcons)[number]["icon"] }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  switch (icon) {
    case "sun":
      return (
        <svg {...common}>
          <SunRays cx={12} cy={12} r={4} rayLen={3.2} />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            d="M12 2.5l8 3.2v6.3c0 5.1-3.4 8.7-8 10.5-4.6-1.8-8-5.4-8-10.5V5.7l8-3.2z"
          />
          <text x="12" y="15" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="currentColor" stroke="none">
            UV
          </text>
        </svg>
      );
    case "signal":
      return (
        <svg {...common}>
          <rect x="4" y="14" width="3.4" height="6.5" rx="1" fill="currentColor" />
          <rect x="10.3" y="9.5" width="3.4" height="11" rx="1" fill="currentColor" />
          <rect x="16.6" y="4.5" width="3.4" height="16" rx="1" fill="currentColor" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
          />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" />
        </svg>
      );
  }
}

export default function FilmSelector({ films }: { films: Film[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = films[activeIndex];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-start gap-3">
<div className="flex flex-wrap gap-3" role="tablist" aria-label="SUNKOOL film grades">
        {films.filter(film => film.name === "HD 70").map((film, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={film.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full border px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider transition-colors duration-300 ease-[var(--ease-lux)] sm:text-sm ${
                isActive
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-silver-soft hover:border-white/25 hover:text-white"
              }`}
            >
              {film.name}
            </button>
          );
        })}
      </div>
<CityExploreMore />
</div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <h3 className="-mt-[3px] text-gradient-silver font-display text-2xl font-bold leading-none sm:text-3xl">
          {active.name}
        </h3>
        <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-silver-soft sm:text-base">
          {active.tagline}
        </p>

        {/* One shared grid so each numeric card sits directly above its
            related feature card (VLT/IR, TSER/UV Rejection, Heat/Signal,
            UV Protection/Clarity) — positions come from named grid-areas in
            .cards-grid, not from source order. */}
        <div className="cards-grid reveal-stagger mt-6">
          <GlowCard
            cornerGlow
            className="vlt-card flex min-h-[128px] flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] px-3 py-5 text-center"
          >
            <p className="max-w-full text-balance text-[12px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
              Visible Light Transmission (VLT)
            </p>
            <p
              className="stat-value mt-3 justify-center font-display text-[30px] font-extrabold leading-none"
              style={{ color: "#4aabff" }}
              aria-label={`${active.vlt} percent`}
            >
              <AnimatedNumber end={active.vlt} />
              <span className="static-part">%</span>
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="tser-card flex min-h-[128px] flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] px-3 py-5 text-center"
          >
            <p className="max-w-full text-balance text-[12px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
              Total Solar Energy Rejected (TSER)
            </p>
            <p
              className="stat-value mt-3 justify-center font-display text-[30px] font-extrabold leading-none"
              style={{ color: "#4aabff" }}
              aria-label={`${active.tser} percent`}
            >
              <AnimatedNumber end={active.tser} />
              <span className="static-part">%</span>
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="heat-card flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5"
          >
            <span className="glow-card-icon text-kool">
              <FeatureIcon icon={featureIcons[0].icon} />
            </span>
            <p className="mt-3 text-[15px] font-medium leading-snug text-white sm:text-base">
              {featureIcons[0].label}
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="uv-protection-card flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5"
          >
            <span className="glow-card-icon text-kool">
              <FeatureIcon icon={featureIcons[2].icon} />
            </span>
            <p className="mt-3 text-[15px] font-medium leading-snug text-white sm:text-base">
              {featureIcons[2].label}
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="ir-card flex min-h-[128px] flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] px-3 py-5 text-center"
          >
            <p className="max-w-full text-balance text-[12px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
              Infrared Rejection (IR)
            </p>
            <p
              className="stat-value mt-3 justify-center font-display text-[30px] font-extrabold leading-none"
              style={{ color: "#4aabff" }}
              aria-label={`${active.ir} percent`}
            >
              <AnimatedNumber end={active.ir} />
              <span className="static-part">%</span>
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="uv-rejection-card flex min-h-[128px] flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] px-3 py-5 text-center"
          >
            <p className="max-w-full text-balance text-[12px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
              UV Rejection
            </p>
            <p
              className="stat-value mt-3 justify-center font-display text-[30px] font-extrabold leading-none"
              style={{ color: "#4aabff" }}
              aria-label={`${active.uv} percent`}
            >
              <AnimatedNumber end={active.uv} />
              <span className="static-part">%</span>
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="signal-card flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5"
          >
            <span className="glow-card-icon text-kool">
              <FeatureIcon icon={featureIcons[1].icon} />
            </span>
            <p className="mt-3 text-[15px] font-medium leading-snug text-white sm:text-base">
              {featureIcons[1].label}
            </p>
          </GlowCard>

          <GlowCard
            cornerGlow
            className="clarity-card flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5"
          >
            <span className="glow-card-icon text-kool">
              <FeatureIcon icon={featureIcons[3].icon} />
            </span>
            <p className="mt-3 text-[15px] font-medium leading-snug text-white sm:text-base">
              {featureIcons[3].label}
            </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
