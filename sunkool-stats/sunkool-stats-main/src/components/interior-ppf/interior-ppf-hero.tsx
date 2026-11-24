"use client";
import { VisibleLoopSpan } from "@/components/ui/visible-loop";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { InteriorPpfHeroImage } from "./interior-ppf-hero-image";
import { EASE_OUT } from "@/lib/motion";

const SECTIONS = [
  { slug: "features", label: "Features" },
  { slug: "protection", label: "Protection" },
  { slug: "why-choose", label: "Why Choose" },
] as const;

const STATS = [
  { value: "5", suffix: "-Yr", label: "Warranty" },
  { value: "195", suffix: "µ", label: "Thickness" },
  { value: "99", suffix: "%", label: "UV Block" },
] as const;

export function InteriorPpfHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[55vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(192,192,192,0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-grid opacity-[0.12] mask-fade-y" />

      {/* Right half — hero photo slot (desktop) */}
      <div className="absolute inset-y-0 right-0 z-0 hidden w-1/2 lg:block">
        <InteriorPpfHeroImage className="absolute inset-8 rounded-[2.5rem] border border-white/10 shadow-[0_24px_80px_-20px_rgba(192,192,192,0.25)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
      </div>

      <div className="container-lux relative z-10 flex min-h-[100svh] items-center py-28 sm:py-32">
        <div className="w-full lg:max-w-[52%] lg:pr-10">
          <Reveal>
            <p className="eyebrow mb-4">SUNKOOL PPF</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="headline text-5xl sm:text-6xl lg:text-7xl">
              <span className="text-gradient-silver">Interior PPF</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-4 text-lg font-medium text-white sm:text-xl">
              Engineered to Protect Your Vehicle&apos;s Interior
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white sm:text-lg">
              Advanced interior protection film designed to preserve your
              vehicle&apos;s original look, feel, and finish while protecting
              against daily wear and environmental damage.
            </p>
          </Reveal>

          {/* Mobile / tablet — hero photo slot below copy */}
          <Reveal delay={0.18} className="mt-8 lg:hidden">
            <InteriorPpfHeroImage className="aspect-[16/10] rounded-[1.75rem] border border-white/10 shadow-[0_24px_80px_-20px_rgba(192,192,192,0.3)]" />
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-glow">
              <VisibleLoopSpan
                className="h-2 w-2 rounded-full bg-electric"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              Coming Soon
              <Sparkles className="h-4 w-4" />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: (idx: number) => ({
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: idx * 0.08,
                        duration: 0.55,
                        ease: EASE_OUT,
                      },
                    }),
                  }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm"
                >
                  <p className="font-display text-2xl font-bold text-gradient-silver">
                    {s.value}
                    <span className="text-lg">{s.suffix}</span>
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white sm:text-[10px]">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-6 flex flex-wrap gap-2">
              {SECTIONS.map((item) => (
                <a
                  key={item.slug}
                  href={`#${item.slug}`}
                  className="focus-ring inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white/30 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
