"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ULTRA_EDGE_BRAND } from "@/lib/ultra-edge-content";
import { ULTRA_EDGE_MEDIA, NAV_ITEMS } from "@/lib/ultra-edge-media";
import { buildWhatsAppUrl } from "@/lib/contact";
import { MagneticButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { MediaSlot } from "@/components/media/media-slot";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const STATS = [
  { value: "99", suffix: "%", label: "UV rejection" },
  { value: "99", suffix: "%", label: "Peak IR rejection" },
  { value: "150", suffix: "+", label: "Prism nano layers" },
] as const;

export function UltraEdgeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 60]);
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1, 0.94]
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[55vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(246,177,26,0.2),transparent_70%)]" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[40vh] w-[45vw] bg-[radial-gradient(circle,rgba(88,167,232,0.15),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12] mask-fade-y" />

      <div className="container-lux relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">{ULTRA_EDGE_BRAND.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              {/* The title is shown as the Ultra EDGE logo; the text stays for screen readers and search. */}
              <h1 className="headline text-5xl sm:text-6xl lg:text-7xl">
                <span className="sr-only">{ULTRA_EDGE_BRAND.title}</span>
                <Image
                  src="/images/LOGO/ultra-edge-logo-light.png"
                  alt=""
                  aria-hidden
                  width={4086}
                  height={656}
                  priority
                  className="h-auto w-full max-w-[15rem] sm:max-w-[20rem] lg:max-w-[24rem]"
                />
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white sm:text-lg">
                {ULTRA_EDGE_BRAND.intro[0]}
              </p>
            </Reveal>

            {/* Mobile only: the Ultra Edge banner right under the summary (desktop shows it in the right column). */}
            <Reveal delay={0.13}>
              <div className="mt-6 lg:hidden">
                <MediaSlot
                  src={ULTRA_EDGE_MEDIA.hero.src}
                  alt={ULTRA_EDGE_MEDIA.hero.alt}
                  aspect={ULTRA_EDGE_MEDIA.hero.aspect}
                  accent="#58a7e8"
                  label="Ultra Edge Hero"
                  fileHint={ULTRA_EDGE_MEDIA.hero.fileHint}
                  priority
                  className="rounded-[1.75rem] shadow-[0_24px_80px_-20px_rgba(88,167,232,0.35)]"
                />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm"
                  >
                    <p className="font-display text-2xl font-bold text-gradient-electric">
                      {s.value}
                      <span className="text-lg">{s.suffix}</span>
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white sm:text-[10px]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-6 flex flex-wrap gap-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.slug}
                    href={`#${item.slug}`}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-electric/40 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              {/* Mobile: Explore Ultra on its own row, Get a Quote + WhatsApp side by side below.
                  sm+: all three in one wrapping row. */}
              {/* MagneticButton wraps itself in an inline-block link, so the first child is spanned
                  from the grid (it stretches there) rather than via a wrapper div. */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 [&>*:first-child]:col-span-2">
                <MagneticButton href="#ultra" className="w-full sm:w-auto">
                  Explore Ultra
                </MagneticButton>
                <MagneticButton href="/contact" variant="outline" className="w-full px-4 sm:w-auto sm:px-7">
                  Get a Quote
                </MagneticButton>
                <a
                  href={buildWhatsAppUrl(
                    "Hi SUNKOOL, I'd like to know more about Ultra Edge window films."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3.5 text-sm font-medium text-[#7dffb0] transition-colors hover:bg-[#25D366]/20 sm:px-6"
                >
                  WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Desktop only — on mobile the banner sits under the summary instead. */}
          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            className="relative hidden lg:block"
          >
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-dashed border-white/10 motion-safe:animate-[spin_40s_linear_infinite]"
              aria-hidden
            />
            <MediaSlot
              src={ULTRA_EDGE_MEDIA.hero.src}
              alt={ULTRA_EDGE_MEDIA.hero.alt}
              aspect={ULTRA_EDGE_MEDIA.hero.aspect}
              accent="#58a7e8"
              label="Ultra Edge Hero"
              fileHint={ULTRA_EDGE_MEDIA.hero.fileHint}
              priority
              className="rounded-[1.75rem] shadow-[0_24px_80px_-20px_rgba(88,167,232,0.35)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
