"use client";
import { VisibleLoopSpan } from "@/components/ui/visible-loop";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  SIGNATURE_ADVANTAGES,
  SOLAR_PARAMETERS,
} from "@/lib/window-film-content";
import { SUNKOOL_ABOUT } from "@/lib/brand";
import { Reveal } from "@/components/ui/reveal";
import { Logo } from "@/components/layout/logo";

export function SeriesAboutBlock({ aboutLabel }: { aboutLabel: string }) {
  return (
    <>
      <Reveal delay={0.08}>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          {aboutLabel}
        </p>
      </Reveal>
      <div className="mt-4 space-y-4">
        {SUNKOOL_ABOUT.map((p, i) => (
          <Reveal key={i} delay={0.1 + i * 0.04}>
            <p className="text-sm leading-relaxed text-white sm:text-base">{p}</p>
          </Reveal>
        ))}
      </div>
    </>
  );
}

export function SolarParametersGrid() {
  return (
    <div className="mt-16">
      <Reveal>
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Solar Parameters{" "}
          <span className="text-gradient-electric">Overview</span>
        </h3>
      </Reveal>
      {/* Two per row even on phones (VLT beside UV-R, TSER beside IRR), four in a row on desktop.
          Phones get slightly tighter padding and text so the narrower cards stay comfortable. */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {SOLAR_PARAMETERS.map((param, i) => (
          <motion.div
            key={param.abbr}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
          >
            <p className="font-display text-xl font-bold text-gradient-kool sm:text-2xl">
              {param.abbr}
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug text-white sm:text-sm">{param.name}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-electric/80 sm:text-[10px] sm:tracking-[0.14em]">
              {param.range}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white sm:mt-3 sm:text-xs">{param.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SunkoolAdvantageGrid() {
  return (
    <div className="mt-16">
      <Reveal>
        {/* "SUNKOOL" is shown as the wordmark logo (its alt text gives screen readers the word).
            Baseline alignment puts the logo's bottom edge on the same line as "The" and "Advantage". */}
        <h3 className="flex flex-wrap items-baseline gap-x-[0.3em] font-display text-2xl font-bold text-white sm:text-3xl">
          <span>The</span>
          <Logo className="h-[0.95em]" />
          <span className="text-gradient-sun">Advantage</span>
        </h3>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SIGNATURE_ADVANTAGES.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h4 className="font-display text-base font-semibold text-white">
              {item.title}
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-white sm:text-sm">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SeriesEyebrowBadge({
  label,
  accent,
  accentGlow,
  shimmerClass,
  Icon,
}: {
  label: string;
  accent: string;
  accentGlow: string;
  shimmerClass: string;
  Icon: LucideIcon;
}) {
  return (
    <span
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] isolate"
      style={{
        borderColor: `${accent}55`,
        color: accentGlow,
        background: `${accent}12`,
      }}
    >
      <VisibleLoopSpan
        className={`pointer-events-none absolute inset-0 ${shimmerClass}`}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <Icon className="relative h-3 w-3" />
      <span className="relative">{label}</span>
    </span>
  );
}
