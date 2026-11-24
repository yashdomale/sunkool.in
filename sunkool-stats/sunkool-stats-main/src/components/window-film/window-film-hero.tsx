"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  WINDOW_FILM_BRAND,
  WINDOW_FILM_STATS,
} from "@/lib/window-film-content";
import { WINDOW_FILM_MEDIA, WINDOW_FILM_NAV } from "@/lib/window-film-media";
import { buildWhatsAppUrl } from "@/lib/contact";
import { MediaSlot } from "@/components/media/media-slot";
import { MagneticButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function WindowFilmHero() {
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
      <div className="pointer-events-none absolute left-1/2 top-0 h-[55vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(88,167,232,0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[40vh] w-[45vw] bg-[radial-gradient(circle,rgba(125,211,255,0.12),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12] mask-fade-y" />

      <div className="container-lux relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">{WINDOW_FILM_BRAND.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="headline text-5xl sm:text-6xl lg:text-7xl">
                <span className="text-gradient-electric">
                  {WINDOW_FILM_BRAND.title}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white sm:text-lg">
                {WINDOW_FILM_BRAND.lead}
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {WINDOW_FILM_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-4 text-center backdrop-blur-sm"
                  >
                    <p className="font-display text-2xl font-bold text-gradient-kool">
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
              {/* All four chips on one line. On phones they stretch to fill the row edge to edge
                  (spare space shared equally, labels centred), matching the buttons below;
                  sm+ goes back to compact, left-aligned chips. */}
              <div className="mt-6 flex gap-1.5 sm:flex-wrap sm:gap-2">
                {WINDOW_FILM_NAV.map((item) => (
                  <a
                    key={item.slug}
                    href={`#${item.slug}`}
                    className="flex-auto whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:border-electric/40 hover:text-white sm:flex-none sm:px-3.5 sm:tracking-[0.16em]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              {/* All three buttons on one line. On phones they share the row equally, with
                  smaller text and padding so they fit; from sm up they return to full size. */}
              <div className="mt-8 flex gap-2 sm:gap-4">
                <div className="min-w-0 flex-1 sm:flex-none [&>a]:block">
                  <MagneticButton
                    href="#foundation"
                    className="w-full whitespace-nowrap px-2 text-xs tracking-normal sm:px-7 sm:text-sm sm:tracking-wide"
                  >
                    Explore Films
                  </MagneticButton>
                </div>
                <div className="min-w-0 flex-1 sm:flex-none [&>a]:block">
                  <MagneticButton
                    href="/contact"
                    variant="outline"
                    className="w-full whitespace-nowrap px-2 text-xs tracking-normal sm:px-7 sm:text-sm sm:tracking-wide"
                  >
                    Get a Quote
                  </MagneticButton>
                </div>
                <a
                  href={buildWhatsAppUrl(
                    "Hi SUNKOOL, I'd like to know more about your window films."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-2 py-3.5 text-xs font-medium text-[#7dffb0] transition-colors hover:bg-[#25D366]/20 sm:flex-none sm:gap-2 sm:px-6 sm:text-sm"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              </div>
            </Reveal>
</div>

          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            className="relative"
          >
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-dashed border-electric/20 motion-safe:animate-[spin_40s_linear_infinite]"
              aria-hidden
            />
            <MediaSlot
              src={WINDOW_FILM_MEDIA.hero.src}
              alt={WINDOW_FILM_MEDIA.hero.alt}
              aspect={WINDOW_FILM_MEDIA.hero.aspect}
              accent="#58a7e8"
              label="Window Film Hero"
              fileHint={WINDOW_FILM_MEDIA.hero.fileHint}
              priority
              className="rounded-[1.75rem] shadow-[0_24px_80px_-20px_rgba(88,167,232,0.4)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
