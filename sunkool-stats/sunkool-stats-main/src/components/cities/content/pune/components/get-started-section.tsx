import Link from "next/link";
import StatReveal from "@/components/cities/content/pune/components/stat-reveal";
import PSIcon from "@/components/cities/shared/ps-icon";
import { IconPSThermo, IconPSShield, IconPSSignal } from "@/components/cities/shared/protection-stat-icons";
import { Eyebrow, Paragraph } from "@/components/cities/content/pune/components/landing-blocks";
import { performanceStats } from "@/components/cities/content/pune/lib/content";

export default function GetStartedSection() {
  return (
    <>
      {/* 10. Get Started */}
      <section className="get-started-glow-bg relative w-full overflow-hidden border-y border-white/10 bg-black">
        <div className="container-lux relative z-[1] py-16 sm:py-20 lg:py-28">
          <div className="grid gap-12 md:grid-cols-[47fr_45fr] md:items-center md:gap-10 lg:gap-16">
            <div>
              <Eyebrow color="kool">Get Started</Eyebrow>
              <h2 className="reveal-fade-up headline mt-4 text-balance text-[clamp(42px,4vw,64px)]">
                <span className="text-[#f47521]">Get Car Window</span>
                <br />
                <span className="text-gradient-electric">Film in Pune</span>
              </h2>
              <Paragraph className="mt-6 max-w-[620px]">
                Don&rsquo;t choose a window film by darkness alone. SUNKOOL nano-ceramic films
                are graded by VLT, TSER, IR rejection and UV rejection, so the right pick
                depends on your car and how you drive. Tell SUNKOOL your car model and what you
                want from your film, and the team can help you select the right option.
              </Paragraph>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-kool px-8 py-3.5 font-display text-base font-semibold text-black transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-glow hover:shadow-xl hover:shadow-kool/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
                >
                  Get a Film Recommendation &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-kool bg-black/40 px-8 py-3.5 font-display text-base font-semibold text-kool transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-lux)] hover:-translate-y-0.5 hover:bg-kool/10 hover:shadow-lg hover:shadow-kool/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-kool/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
                >
                  Contact SUNKOOL &rarr;
                </Link>
              </div>
            </div>

            <div>
              <Eyebrow color="kool">Protection at a Glance</Eyebrow>
              <div className="reveal-stagger mt-8 space-y-8">
                <div className="flex items-center gap-5">
                  <PSIcon>
                    <IconPSThermo />
                  </PSIcon>
                  <div>
                    <p className="text-gradient-silver-cyan text-4xl font-extrabold sm:text-5xl">
                      <StatReveal value={performanceStats[0].value} index={0} />
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                      {performanceStats[0].label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <PSIcon>
                    <IconPSShield />
                  </PSIcon>
                  <div>
                    <p className="text-gradient-silver-cyan text-4xl font-extrabold sm:text-5xl">
                      <StatReveal value={performanceStats[1].value} index={1} />
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                      {performanceStats[1].label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <PSIcon>
                    <IconPSSignal />
                  </PSIcon>
                  <div>
                    <p className="text-gradient-silver-cyan text-4xl font-extrabold sm:text-5xl">
                      <StatReveal value={performanceStats[2].value} index={2} />
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-silver-soft sm:text-sm">
                      {performanceStats[2].label}
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
    </>
  );
}
