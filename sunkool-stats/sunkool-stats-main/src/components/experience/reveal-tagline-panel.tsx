"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { REVEAL_COPY } from "@/lib/narrative-script";
import { HOME_HERO_CTAS } from "@/lib/home-hero-content";
import { EASE_OUT as ease } from "@/lib/motion";

export function RevealTaglinePanel({ local }: { local: number }) {
  const headlineEnter = Math.min(1, Math.max(0, (local - 0.06) * 2.4));
  const bodyEnter = Math.min(1, Math.max(0, (local - 0.14) * 2.2));
  const ctaEnter = Math.min(1, Math.max(0, (local - 0.22) * 2));

  return (
    <>
      <motion.aside
        aria-label="SUNKOOL reveal message"
        className="pointer-events-none absolute right-5 top-[34vh] z-[12] hidden w-[min(30vw,17.5rem)] sm:right-8 xl:right-10 xl:w-[min(28vw,20rem)] lg:block"
        initial={false}
      >
        <motion.div
          style={{ opacity: headlineEnter, y: (1 - headlineEnter) * 18 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="absolute -left-4 top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />

          <p className="eyebrow text-[0.58rem] tracking-[0.38em] text-white/35">
            Built to Keep Heat Out.
          </p>

          <h2 className="headline mt-3 text-[1.85rem] leading-[1.12] tracking-tight xl:text-[2.1rem]">
            <span className="block text-gradient-sun">{REVEAL_COPY.line1}</span>
            <span className="mt-0.5 block text-gradient-kool">
              {REVEAL_COPY.line2}
            </span>
          </h2>
        </motion.div>

        <motion.p
          className="mt-4 text-[0.88rem] leading-relaxed text-silver-soft/72"
          style={{ opacity: bodyEnter, y: (1 - bodyEnter) * 14 }}
          transition={{ duration: 0.65, ease }}
        >
          Crystal-clear visibility. Exceptional heat rejection — on every pane.
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-5 flex flex-col gap-2"
          style={{ opacity: ctaEnter, y: (1 - ctaEnter) * 12 }}
          transition={{ duration: 0.6, ease }}
        >
          {HOME_HERO_CTAS.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={`group inline-flex w-full items-center justify-between rounded-full px-4 py-2.5 text-[0.82rem] font-semibold tracking-wide transition-all duration-300 ${
                cta.accent === "sun"
                  ? "bg-white text-black hover:bg-white/92"
                  : "border border-white/12 bg-white/[0.03] text-white backdrop-blur-sm hover:border-white/28 hover:bg-white/[0.07]"
              }`}
            >
              <span>{cta.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-55 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </motion.div>
      </motion.aside>

      <div
        aria-label="SUNKOOL reveal message"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] bg-gradient-to-t from-black via-black/95 to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 lg:hidden"
      >
        <motion.div
          style={{ opacity: headlineEnter, y: (1 - headlineEnter) * 18 }}
          transition={{ duration: 0.7, ease }}
          initial={false}
        >
          <p className="eyebrow text-center text-[0.58rem] tracking-[0.32em] text-white/40">
            Built to Keep Heat Out.
          </p>

          <h2 className="headline mt-3 text-center text-[1.5rem] leading-[1.12] tracking-tight sm:text-[1.85rem]">
            <span className="block text-gradient-sun">{REVEAL_COPY.line1}</span>
            <span className="mt-0.5 block text-gradient-kool">
              {REVEAL_COPY.line2}
            </span>
          </h2>
        </motion.div>

        <motion.p
          className="mt-3 text-center text-sm text-silver-soft/80"
          style={{ opacity: bodyEnter, y: (1 - bodyEnter) * 14 }}
          transition={{ duration: 0.65, ease }}
        >
          Crystal-clear visibility. Exceptional heat rejection — on every pane.
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-4 flex flex-col gap-2.5"
          style={{ opacity: ctaEnter, y: (1 - ctaEnter) * 12 }}
          transition={{ duration: 0.6, ease }}
        >
          {HOME_HERO_CTAS.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={`group inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                cta.accent === "sun"
                  ? "bg-white text-black hover:bg-white/92"
                  : "border border-white/12 bg-white/[0.03] text-white backdrop-blur-sm hover:border-white/28 hover:bg-white/[0.07]"
              }`}
            >
              <span>
                {cta.accent === "kool" ? (
                  <>
                    <span className="sm:hidden">PPF</span>
                    <span className="hidden sm:inline">{cta.label}</span>
                  </>
                ) : (
                  cta.label
                )}
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-55 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </motion.div>
      </div>
    </>
  );
}
