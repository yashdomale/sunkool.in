import Reveal from "@/components/cities/shared/reveal";
import PSIcon from "@/components/cities/shared/ps-icon";
import { StatNumber } from "@/components/cities/shared/count-up";
import { IconPSThermo, IconPSShield, IconPSSignal } from "@/components/cities/shared/protection-stat-icons";

export default function GetStartedSection() {
  return (
    <section className="get-started-section relative w-full overflow-hidden border-y border-white/10 bg-black">
      <div className="container-lux relative z-[1] py-16 sm:py-20 lg:py-28">
        <div className="grid gap-12 md:grid-cols-[47fr_45fr] md:items-center md:gap-10 lg:gap-16">
          <Reveal>
            <Reveal as="p" className="eyebrow text-kool">
              Get Started
            </Reveal>
            <h2 className="headline mt-4 text-balance text-[clamp(42px,4vw,64px)]">
              <span className="text-gradient-sun">Get Car Window</span>
              <br />
              <span className="text-gradient-electric">Film in Kozhikode</span>
            </h2>
            <p className="text-[16px] font-bold leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6 max-w-[620px]">{"Looking for car window film in Kozhikode? SUNKOOL offers nano-ceramic films for drivers who want heat control, UV protection, glare reduction and clear visibility. Compare heat rejection, IR rejection, UV protection, VLT and optical clarity. Share your car model, typical driving conditions and visibility preference so the team can help recommend a suitable grade."}</p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <a
                href="https://www.sunkool.in/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              >
                Get a Film Recommendation →
              </a>
            </div>
          </Reveal>

          <div className="protection-stats">
            <Reveal as="p" className="eyebrow text-kool">
              Protection at a Glance
            </Reveal>
            <Reveal className="mt-8 space-y-8" stagger>
              <div className="flex items-center gap-5">
                <PSIcon>
                  <IconPSThermo />
                </PSIcon>
                <div>
                  <StatNumber
                    target={95}
                    prefix="Up to "
                    suffix="%"
                    ariaLabel="Up to 95 percent IR heat rejection"
                    className="text-gradient-silver-cyan text-4xl font-extrabold sm:text-5xl"
                  />
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                    IR Heat Rejection
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <PSIcon>
                  <IconPSShield />
                </PSIcon>
                <div>
                  <StatNumber
                    target={99}
                    suffix="%"
                    ariaLabel="99 percent UV protection"
                    className="text-gradient-silver-cyan text-4xl font-extrabold sm:text-5xl"
                  />
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                    UV Protection
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <PSIcon>
                  <IconPSSignal />
                </PSIcon>
                <div>
                  <StatNumber
                    target={100}
                    suffix="%"
                    ariaLabel="100 percent signal safe"
                    minWidth="3ch"
                    className="text-gradient-silver-cyan text-4xl font-extrabold sm:text-5xl"
                  />
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                    Signal Safe
                  </p>
                </div>
              </div>
            </Reveal>
            <p className="reveal-fade-up is-visible mt-10 border-t border-white/10 pt-8 font-display text-lg font-semibold text-white sm:text-xl">
              Cooler cabin. <span className="text-kool">Clearer drive.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
