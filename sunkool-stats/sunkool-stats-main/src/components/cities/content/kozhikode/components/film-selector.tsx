"use client";

import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconHeatThermo, IconSignalBars, IconUVShield, IconEye } from "@/components/cities/shared/icons";

const films = [
  {
    id: "hd70",
    name: "HD 70",
    description:
      "A lighter, high-clarity grade for Kozhikode drivers who want strong heat rejection without a heavily tinted look, during sunny commutes and long waits in coastal traffic.",
    vlt: 70,
    ir: 95,
    tser: 58,
    uv: 99,
  },
];

export default function FilmSelector() {
  const active = films[0];

  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <Reveal as="p" className="eyebrow text-kool">
          Products
        </Reveal>
        <Reveal
          as="h2"
          className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
        >
          <span className="text-gradient-sun">Choose the Right Window</span>{" "}
          <span className="text-gradient-electric">Film for Your Car in Kozhikode</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
          HD 70 offers solar protection with a lighter, high-clarity finish. Choose based on your vehicle&apos;s existing glass, final VLT, driving conditions and heat rejection priorities.
        </p>

        <div className="mt-8">

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="-mt-[3px] text-gradient-silver font-display text-2xl font-bold leading-none sm:text-3xl">
              {active.name}
            </h3>
          <a href="https://www.sunkool.in/window-film" className="shrink-0 inline-flex items-center justify-center rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-colors hover:bg-glow">Explore More</a>
            </div>
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

          <p className="mt-4 text-sm leading-relaxed text-fog">
            SUNKOOL states that these values are based on routinely accumulated quality-control data and may vary
            between batches.
          </p>

        </div>
      </div>
    </section>
  );
}
