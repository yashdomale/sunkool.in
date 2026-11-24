"use client";

import { CityExploreMore } from "@/components/cities/shared/explore-more-external";

import { useState } from "react";
import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconHeatThermo, IconSignalBars, IconUVShield, IconEye } from "@/components/cities/shared/icons";

const films = [
  {
    id: "hd70",
    name: "HD 70",
    description:
      "A lighter, high-clarity grade for Hyderabad drivers who want strong heat rejection without a heavily tinted look, even during peak summer afternoons.",
    vlt: 70,
    ir: 95,
    tser: 58,
    uv: 99,
  },

];

export default function FilmSelector() {
  const [activeId, setActiveId] = useState(films[0].id);
  const active = films.find((f) => f.id === activeId) ?? films[0];

  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-kool">
          Choose Your Film
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-[#f47521]">Choose the Right Window</span>{" "}
          <span className="text-gradient-electric">{"Film for Your Car in Hyderabad"}</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">{"The best film for your vehicle depends on its original glass, your preferred visibility, driving conditions and desired level of heat rejection."}</p>

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

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h3 className="-mt-[3px] text-gradient-silver font-display text-2xl font-bold leading-none sm:text-3xl">
              {active.name}
            </h3>
            <p className="mt-2 max-w-[640px] text-[15px] font-bold leading-relaxed text-silver-soft sm:text-base">
              {active.description}
            </p>

            <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger>
              <GlowCard className="order-1 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  Visible Light Transmission (VLT)
                </p>
                <StatNumber target={active.vlt} suffix="%" ariaLabel={`${active.vlt} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
              </GlowCard>
              <GlowCard className="order-2 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  Total Solar Energy Rejected (TSER)
                </p>
                <StatNumber target={active.tser} suffix="%" ariaLabel={`${active.tser} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
              </GlowCard>
              <GlowCard className="order-5 flex min-h-[92px] flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:min-h-[112px] sm:items-start sm:py-4 sm:text-left lg:order-none">
                <span className="glow-card-icon text-kool">
                  <IconHeatThermo size={22} />
                </span>
                <p className="mt-2 text-[14px] font-medium leading-snug text-white sm:text-[15px]">High Heat Rejection</p>
              </GlowCard>
              <GlowCard className="order-6 flex min-h-[92px] flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:min-h-[112px] sm:items-start sm:py-4 sm:text-left lg:order-none">
                <span className="glow-card-icon text-kool">
                  <IconUVShield size={22} />
                </span>
                <p className="mt-2 text-[14px] font-medium leading-snug text-white sm:text-[15px]">High UV Protection</p>
              </GlowCard>

              <GlowCard className="order-3 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  Infrared Rejection (IR)
                </p>
                <StatNumber target={active.ir} suffix="%" ariaLabel={`${active.ir} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
              </GlowCard>
              <GlowCard className="order-4 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  UV Rejection
                </p>
                <StatNumber target={active.uv} suffix="%" ariaLabel={`${active.uv} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
              </GlowCard>
              <GlowCard className="order-7 flex min-h-[92px] flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:min-h-[112px] sm:items-start sm:py-4 sm:text-left lg:order-none">
                <span className="glow-card-icon text-kool">
                  <IconSignalBars size={22} />
                </span>
                <p className="mt-2 text-[14px] font-medium leading-snug text-white sm:text-[15px]">No Signal Interference</p>
              </GlowCard>
              <GlowCard className="order-8 flex min-h-[92px] flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:min-h-[112px] sm:items-start sm:py-4 sm:text-left lg:order-none">
                <span className="glow-card-icon text-kool">
                  <IconEye size={22} />
                </span>
                <p className="mt-2 text-[14px] font-medium leading-snug text-white sm:text-[15px]">Enhanced Clarity</p>
              </GlowCard>
            </Reveal>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-fog">{"These are SUNKOOL's published product-level specifications and may vary between batches."}</p>

          <div className="mt-14 sm:mt-16 lg:mt-20">
            <h3 className="text-gradient-silver font-display text-xl font-bold sm:text-2xl">
              Looking for maximum clarity?
            </h3>
            <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-3">{"Hyderabad drivers often prioritise heat rejection, but choosing the darkest possible film isn't necessarily the best solution. The right balance depends on Heat Rejection + IR Rejection + UV Protection + Visibility + VLT. HD 70 may be preferable when visibility is a priority, subject to applicable requirements."}</p>
          </div>
          

          <Reveal className="mt-8 rounded-2xl border border-sun/30 bg-gradient-to-r from-black via-sun/10 to-sun/25 p-6 sm:p-7">
            <p className="text-[15px] leading-loose text-silver-soft sm:text-base sm:leading-loose">
              <span className="font-semibold text-sun">Is Car Window Tint Legal in Hyderabad?</span>{" Before applying any window film on your vehicle, there are things you need to know about vehicle glass and visible light transmission requirements. SUNKOOL's information on regulations involves CMVR Rule 100 and IS 2553 (Part 2): 2019 (Revision 1) concerning vehicle glass and VLT requirements. The final VLT of the vehicle glass will depend on both the original glass as well as the film applied. That means a film with a given VLT percentage does not mean that the VLT of the final glass will be the same. Important: Vehicle-glass regulations and enforcement requirements may change. Confirm the current applicable requirements and final VLT before installation."}
            </p>
          </Reveal>
          <a
            href="https://www.sunkool.in/window-film"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center text-base font-semibold text-kool transition-colors hover:text-glow"
          >
            View SUNKOOL&apos;s Window Film Regulations →
          </a>
        </div>
      </div>
    </section>
  );
}
