"use client";
import { VisibleLoop } from "@/components/ui/visible-loop";

import { motion } from "motion/react";
import { Eye, Radio, Shield, Thermometer } from "lucide-react";
import {
  PERFORMANCE_PILLARS,
  WINDOW_FILM_ADVANTAGES,
} from "@/lib/window-film-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { EASE_OUT as ease } from "@/lib/motion";

const ICONS = [Thermometer, Eye, Radio, Shield] as const;
export function WindowFilmBenefits() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Why SUNKOOL Window Film"
            title={
              <>
                <span className="text-gradient-kool">Cooler cabins.</span>{" "}
                Clearer drives.
              </>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WINDOW_FILM_ADVANTAGES.map((item, i) => {
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
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-electric/10 text-electric">
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
          {[...PERFORMANCE_PILLARS, ...PERFORMANCE_PILLARS].map((pill, i) => (
            <span
              key={`${pill}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-silver-soft"
            >
              {pill}
            </span>
          ))}
        </VisibleLoop>
      </section>
    </>
  );
}
