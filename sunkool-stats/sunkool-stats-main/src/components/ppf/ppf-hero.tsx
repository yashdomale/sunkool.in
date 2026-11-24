"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PPF_BRAND, PPF_STATS } from "@/lib/ppf-content";
import { PPF_NAV } from "@/lib/ppf-media";
import { buildWhatsAppUrl } from "@/lib/contact";
import { MagneticButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PpfHeroVideo } from "./ppf-hero-video";
import { EASE_OUT } from "@/lib/motion";

export function PpfHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 48]);
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1, 1.04]
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[55vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(192,192,192,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-grid opacity-[0.12] mask-fade-y" />

      {/* Right half — full-height video background (desktop) */}
      <motion.div
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-y-0 right-0 z-0 hidden w-full lg:block lg:w-1/2"
      >
        <PpfHeroVideo className="h-full" />
        <div className="pointer-events-none absolute inset-y-0 -left-px w-[38%] bg-gradient-to-r from-black via-black/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent" />
      </motion.div>

      <div className="container-lux relative z-10 flex min-h-[100svh] items-center py-28 sm:py-32">
        <div className="w-full lg:max-w-[50%] lg:pr-10">
          <Reveal>
            <p className="eyebrow mb-4">{PPF_BRAND.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="headline text-5xl sm:text-6xl lg:text-7xl">
              <span className="text-gradient-silver">{PPF_BRAND.title}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white sm:text-lg">
              {PPF_BRAND.lead}
            </p>
          </Reveal>

          {/* Mobile / tablet — video block below copy */}
          <Reveal delay={0.12} className="mt-8 lg:hidden">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_24px_80px_-20px_rgba(192,192,192,0.35)]">
              <PpfHeroVideo className="absolute inset-0" />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-8 grid grid-cols-3 gap-3"
            >
              {PPF_STATS.map((s, i) => (
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

          <Reveal delay={0.18}>
            <p className="mt-2 text-[10px] leading-relaxed text-white/80">
              *Self-healing applies to light scratches and swirl marks under
              normal use; results vary with damage depth and heat exposure.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-6 flex flex-wrap gap-2">
              {PPF_NAV.map((item) => (
                <a
                  key={item.slug}
                  href={`#${item.slug}`}
                  className="focus-ring rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white/30 hover:text-white min-h-11 inline-flex items-center"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton href="#hd07">Explore PPF</MagneticButton>
              <MagneticButton href="/contact" variant="outline">
                Get a Quote
              </MagneticButton>
              <a
                href={buildWhatsAppUrl(
                  "Hi SUNKOOL, I'd like to know more about your paint protection film."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-3.5 text-sm font-medium text-[#7dffb0] transition-colors hover:bg-[#25D366]/20"
              >
                WhatsApp
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
