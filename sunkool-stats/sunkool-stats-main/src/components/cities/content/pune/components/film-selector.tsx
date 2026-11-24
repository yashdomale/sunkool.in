"use client";
import { CityExploreMore } from "@/components/cities/city-explore-more";

import { useState } from "react";
import StatReveal from "@/components/cities/content/pune/components/stat-reveal";
import GlowCard from "@/components/cities/content/pune/components/glow-card";

type Film = {
  name: string;
  vlt: string;
  tser: string;
  ir: string;
  uv: string;
  tagline: string;
};

const featureIcons = [
  { label: "High Heat Rejection", icon: "sun" },
  { label: "High UV Protection", icon: "shield" },
  { label: "No Signal Interference", icon: "signal" },
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
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none" } as const;
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

        <div className="reveal-stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {[
            { type: "metric" as const, label: "Visible Light Transmission (VLT)", value: active.vlt, order: "order-1 sm:order-1" },
            { type: "metric" as const, label: "Total Solar Energy Rejected (TSER)", value: active.tser, order: "order-2 sm:order-2" },
            { type: "benefit" as const, ...featureIcons[0], order: "order-5 sm:order-3" },
            { type: "benefit" as const, ...featureIcons[1], order: "order-6 sm:order-4" },
            { type: "metric" as const, label: "Infrared Rejection (IR)", value: active.ir, order: "order-3 sm:order-5" },
            { type: "metric" as const, label: "UV Rejection", value: active.uv, order: "order-4 sm:order-6" },
            { type: "benefit" as const, ...featureIcons[2], order: "order-7 sm:order-7" },
            { type: "benefit" as const, ...featureIcons[3], order: "order-8 sm:order-8" },
          ].map((item, index) =>
            item.type === "metric" ? (
              <GlowCard
                key={item.label}
                cornerGlow
                className={`flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center ${item.order}`}
              >
                <p className="text-xs uppercase tracking-wide text-fog">{item.label}</p>
                <p className="mt-2 text-gradient-electric font-display text-2xl font-extrabold">
                  <StatReveal value={item.value} index={index} />
                </p>
              </GlowCard>
            ) : (
              <GlowCard
                key={item.label}
                cornerGlow
                className={`flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center ${item.order}`}
              >
                <span className="glow-card-icon text-kool">
                  <FeatureIcon icon={item.icon} />
                </span>
                <p className="mt-3 text-[15px] font-medium leading-snug text-white sm:text-base">
                  {item.label}
                </p>
              </GlowCard>
            )
          )}
        </div>
      </div>
    </div>
  );
}
