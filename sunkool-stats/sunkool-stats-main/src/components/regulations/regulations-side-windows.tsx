"use client";

import { motion } from "motion/react";
import { Scale } from "lucide-react";
import { SIDE_WINDOWS_REGULATION } from "@/lib/regulations-content";
import { Reveal } from "@/components/ui/reveal";
import { regulationEase } from "./regulation-motion";

export function RegulationsSideWindows() {
  const { title, standard, highlight, body } = SIDE_WINDOWS_REGULATION;
  const parts = body.split(highlight);

  return (
    <section className="py-12 sm:py-14">
      <div className="container-lux">
        <Reveal>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.7, ease: regulationEase }}
            className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-black/40 to-black/60"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sun via-electric to-sun" />

            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="flex flex-wrap items-start gap-4 sm:gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric">
                  <Scale className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {title}
                    </h2>
                    <span className="rounded-full border border-sun/30 bg-sun/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sun">
                      {standard}
                    </span>
                  </div>

                  <p className="mt-5 max-w-4xl text-sm leading-relaxed text-white sm:text-base">
                    {parts[0]}
                    <motion.span
                      className="font-medium text-white underline decoration-sun/50 decoration-2 underline-offset-4"
                      initial={{ opacity: 0.6 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      {highlight}
                    </motion.span>
                    {parts[1]}
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08] mask-fade-y" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
