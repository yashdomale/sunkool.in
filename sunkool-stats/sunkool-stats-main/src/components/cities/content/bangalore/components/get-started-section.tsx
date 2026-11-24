import PSIcon from "@/components/cities/shared/ps-icon";
import { StatNumber } from "@/components/cities/content/bangalore/components/count-up";
import { IconPSThermo, IconPSShield, IconPSSignal } from "@/components/cities/shared/protection-stat-icons";

export default function GetStartedSection() {
  return (
    <section className="get-started-section relative w-full overflow-hidden border-y border-white/10 bg-black">
      <div className="container-lux relative z-[1] py-16 sm:py-20 lg:py-28">
        <div className="grid gap-12 md:grid-cols-[47fr_45fr] md:items-center md:gap-10 lg:gap-16">
          <div>
            <p className="reveal-fade-up eyebrow text-kool">Get Started</p>
            <h2 className="reveal-fade-up headline mt-4 text-balance text-[clamp(42px,4vw,64px)]">
              <span className="text-[#f47521]">Get Car Window</span>
              <br />
              <span className="text-gradient-electric">Film in Banglore</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-silver-soft sm:text-[18px] lg:text-[19px] mt-6 max-w-[620px]">
              Wanting to install car window film in Banglore? SUNKOOL provides nano-ceramic window films
              tailored to their heat rejection, UV blocking, visibility and signal-safety properties.
              Don&rsquo;t just choose a film by judging its darkness — go by its VLT, TSER, IR rejection, UV
              rejection and vehicle suitability. Tell SUNKOOL your car model and what you want from your
              film, and the team can help you select the right option.
            </p>
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
          </div>

          <div className="protection-stats">
            <p className="reveal-fade-up eyebrow text-kool">Protection at a Glance</p>
            <div className="reveal-stagger mt-8 space-y-8">
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
            </div>
            <p className="reveal-fade-up mt-10 border-t border-white/10 pt-8 font-display text-lg font-semibold text-white sm:text-xl">
              Cooler cabin. <span className="text-kool">Clearer drive.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
