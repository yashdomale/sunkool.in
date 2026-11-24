import Reveal from "@/components/cities/shared/reveal";
import GlowCard from "@/components/cities/shared/glow-card";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconHeatThermo, IconSignalBars, IconUVShield, IconEye } from "@/components/cities/shared/icons";

const film = {
  name: "HD 70",
  description: "Final tint darkness depends on your car's original glass plus the film, not the film's VLT alone.",
  vlt: 70,
  ir: 95,
  tser: 58,
  uv: 99,
};

export default function FilmSelector() {
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
          <span className="text-gradient-electric">Film for Your Car in Surat</span>
        </Reveal>
        <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6">
          Want a lighter, more visible finish? HD 70 gives you solar protection without a heavily darkened look.
        </p>

        <div className="mt-8">
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="-mt-[3px] text-gradient-silver font-display text-2xl font-bold leading-none sm:text-3xl">
                {film.name}
              </h3>
              <a
                href="https://www.sunkool.in/window-film"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Explore More
              </a>
            </div>
            <p className="mt-2 max-w-[640px] text-[15px] font-bold leading-relaxed text-silver-soft sm:text-base">
              {film.description}
            </p>

            <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" stagger>
              <GlowCard className="order-1 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  Visible Light Transmission (VLT)
                </p>
                <StatNumber target={film.vlt} suffix="%" ariaLabel={`${film.vlt} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
              </GlowCard>
              <GlowCard className="order-2 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  Total Solar Energy Rejected (TSER)
                </p>
                <StatNumber target={film.tser} suffix="%" ariaLabel={`${film.tser} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
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
                <StatNumber target={film.ir} suffix="%" ariaLabel={`${film.ir} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
              </GlowCard>
              <GlowCard className="order-4 flex min-h-[92px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:min-h-[112px] sm:py-4 lg:order-none">
                <p className="max-w-full text-balance text-[11px] font-bold uppercase leading-[1.35] tracking-[0.04em] text-fog">
                  UV Rejection
                </p>
                <StatNumber target={film.uv} suffix="%" ariaLabel={`${film.uv} percent`} className="mt-3 justify-center text-[26px] font-extrabold leading-none sm:text-[28px]" />
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
            These are SUNKOOL&apos;s published product-level specifications and may vary between batches.
          </p>
        </div>
      </div>
    </section>
  );
}
