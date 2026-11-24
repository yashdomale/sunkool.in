"use client";
import { CityExploreMore } from "@/components/cities/city-explore-more";

import { useState } from "react";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/content/bangalore/components/count-up";
import { IconHeatThermo, IconSignalBars, IconUVShield, IconEye } from "@/components/cities/content/bangalore/components/icons";

const films = [
  {
    id: "hd70",
    name: "HD 70",
    description:
      "A lighter, high-clarity grade for Banglore drivers who want strong heat rejection without a heavily tinted look, even during peak summer afternoons.",
    vlt: 70,
    ir: 95,
    tser: 58,
    uv: 99,
  },
  {
    id: "sk70",
    name: "SK 70",
    description: "A dependable everyday grade balancing visibility, heat rejection and UV protection.",
    vlt: 70,
    ir: 93,
    tser: 55,
    uv: 99,
  },
];

export default function FilmSelector() {
  const [activeId, setActiveId] = useState(films[0].id);
  const active = films.find((f) => f.id === activeId) ?? films[0];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-start gap-3">
<div className="flex flex-wrap gap-3" role="tablist" aria-label="SUNKOOL film grades">
        {films.filter(film => film.name === "HD 70").map((film) => (
          <button
            key={film.id}
            type="button"
            role="tab"
            aria-selected={activeId === film.id}
            onClick={() => setActiveId(film.id)}
            className={`rounded-full border px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider transition-colors duration-300 ease-[var(--ease-lux)] sm:text-sm ${
              activeId === film.id
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/[0.03] text-silver-soft hover:border-white/25 hover:text-white"
            }`}
          >
            {film.name}
          </button>
        ))}
      </div>
<CityExploreMore />
</div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="-mt-[3px] text-gradient-silver font-display text-2xl font-bold leading-none sm:text-3xl">
          {active.name}
        </h3>
        <p className="mt-2 max-w-[640px] text-[15px] font-bold leading-relaxed text-silver-soft sm:text-base">
          {active.description}
        </p>

        <div className="specification-grid reveal-stagger mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:auto-rows-[96px] lg:items-start">
          <GlowCard className="specification-card order-3 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] pb-[14px] pt-0 lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <p className="w-full text-balance text-[11px] uppercase leading-[1.1] tracking-[0.04em] text-fog">
                Visible Light Transmission (VLT)
              </p>
              <StatNumber target={active.vlt} suffix="%" ariaLabel={`${active.vlt} percent`} className="text-[22px] font-extrabold leading-none sm:text-[24px]" />
            </div>
          </GlowCard>
          <GlowCard className="specification-card order-4 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <p className="w-full text-balance text-[11px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
                Total Solar Energy Rejected (TSER)
              </p>
              <StatNumber target={active.tser} suffix="%" ariaLabel={`${active.tser} percent`} className="text-[22px] font-extrabold leading-none sm:text-[24px]" />
            </div>
          </GlowCard>
          <GlowCard className="specification-card order-5 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <span className="glow-card-icon text-kool">
                <IconHeatThermo size={22} />
              </span>
              <p className="w-full text-[14px] font-medium leading-snug text-white sm:text-[15px]">High Heat Rejection</p>
            </div>
          </GlowCard>
          <GlowCard className="specification-card order-6 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <span className="glow-card-icon text-kool">
                <IconUVShield size={22} />
              </span>
              <p className="w-full text-[14px] font-medium leading-snug text-white sm:text-[15px]">High UV Protection</p>
            </div>
          </GlowCard>

          <GlowCard className="specification-card order-1 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <p className="w-full text-balance text-[11px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
                Infrared Rejection (IR)
              </p>
              <StatNumber target={active.ir} suffix="%" ariaLabel={`${active.ir} percent`} className="text-[22px] font-extrabold leading-none sm:text-[24px]" />
            </div>
          </GlowCard>
          <GlowCard className="specification-card order-2 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <p className="w-full text-balance text-[11px] uppercase leading-[1.35] tracking-[0.04em] text-fog">
                UV Rejection
              </p>
              <StatNumber target={active.uv} suffix="%" ariaLabel={`${active.uv} percent`} className="text-[22px] font-extrabold leading-none sm:text-[24px]" />
            </div>
          </GlowCard>
          <GlowCard className="specification-card order-7 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <span className="glow-card-icon text-kool">
                <IconSignalBars size={22} />
              </span>
              <p className="w-full text-[14px] font-medium leading-snug text-white sm:text-[15px]">No Signal Interference</p>
            </div>
          </GlowCard>
          <GlowCard className="specification-card order-8 lg:order-none box-border flex h-auto min-h-0 max-h-none w-full flex-col lg:self-start rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-[14px] lg:h-[96px]! lg:min-h-[96px]! lg:max-h-[96px]!">
            <div className="card-content">
              <span className="glow-card-icon text-kool">
                <IconEye size={22} />
              </span>
              <p className="w-full text-[14px] font-medium leading-snug text-white sm:text-[15px]">Enhanced Clarity</p>
            </div>
          </GlowCard>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-fog">
        The published specifications are product-level figures and may vary between batches.
      </p>

      <div className="mt-14 sm:mt-16 lg:mt-20">
        <h3 className="text-gradient-silver font-display text-xl font-bold sm:text-2xl">
          Prefer a lighter appearance?
        </h3>
        <p className="text-[16px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-3">
          HD 70 or SK 70 may be considered when visibility and a lighter appearance are important.
        </p>
      </div>
      <a
        href="https://www.sunkool.in/contact"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center text-base font-semibold text-kool transition-colors hover:text-glow"
      >
        Not sure which film suits your car? Get a recommendation from SUNKOOL →
      </a>

      <div className="reveal-fade-up mt-8 rounded-2xl border border-sun/30 bg-gradient-to-r from-black via-sun/10 to-sun/25 p-6 sm:p-7">
        <p className="text-[15px] leading-loose text-silver-soft sm:text-base sm:leading-loose">
          <span className="font-semibold text-sun">VLT &amp; Regulations:</span> SUNKOOL&rsquo;s regulations
          information references CMVR Rule 100 and IS 2553 (Part 2): 2019 (Revision 1) for vehicle glazing
          and VLT requirements. The final VLT is determined by the combination of the original vehicle glass
          and the applied film — a film labelled with a particular VLT percentage does not necessarily mean
          the finished vehicle glass will have the same VLT. Confirm current applicable requirements before
          installing window film.
        </p>
      </div>
    </div>
  );
}
