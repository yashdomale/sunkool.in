"use client";
import { VisibleLoop } from "@/components/ui/visible-loop";

import { motion } from "motion/react";
import { Droplets, Eye, Shield, Sparkles } from "lucide-react";
import {
  PPF_ADVANTAGES,
  PPF_CONTENT,
  PPF_PERFORMANCE_PILLARS,
} from "@/lib/ppf-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { EASE_OUT as ease } from "@/lib/motion";

const ICONS = [Shield, Sparkles, Eye, Droplets] as const;
export function PpfBenefits() {
  return (
    <>
      <section className="py-14 sm:py-20">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Why SUNKOOL PPF"
            title={
              <>
                <span className="text-gradient-silver">Protected gloss.</span>{" "}
                <span className="text-gradient-electric">Premium finish.</span>
              </>
            }
            description={PPF_CONTENT.headline}
          />
          <div className="mt-8 max-w-3xl space-y-4">
            {PPF_CONTENT.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="text-sm leading-relaxed text-white sm:text-base">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PPF_ADVANTAGES.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.07, ease }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-silver">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />
        <VisibleLoop
          className="flex w-max gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...PPF_PERFORMANCE_PILLARS, ...PPF_PERFORMANCE_PILLARS].map(
            (pill, i) => (
              <span
                key={`${pill}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-silver-soft"
              >
                {pill}
              </span>
            )
          )}
        </VisibleLoop>
      </section>
    </>
  );
}
