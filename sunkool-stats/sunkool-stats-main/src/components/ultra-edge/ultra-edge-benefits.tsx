"use client";
import { VisibleLoop } from "@/components/ui/visible-loop";

import { motion } from "motion/react";
import {
  Droplets,
  Eye,
  Flame,
  Layers,
  Shield,
  Signal,
  Sun,
  Zap,
} from "lucide-react";
import {
  PERFORMANCE_PILLARS,
  ULTRA_ADVANTAGES,
  ULTRA_EDGE_CORE,
  VALUE_PILLARS,
} from "@/lib/ultra-edge-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { EASE_OUT as ease } from "@/lib/motion";

const PILLAR_ICONS = [Eye, Flame, Sun, Shield, Signal, Zap] as const;
export function UltraEdgeBenefits() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="The Ultra Edge Advantage"
            title={
              <>
                <span className="text-gradient-sun">Engineered</span> for every
                drive
              </>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ULTRA_ADVANTAGES.map((item, i) => (
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
                  {i === 0 && <Flame className="h-5 w-5" />}
                  {i === 1 && <Shield className="h-5 w-5" />}
                  {i === 2 && <Eye className="h-5 w-5" />}
                  {i === 3 && <Layers className="h-5 w-5" />}
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 py-8">
        <div className="container-lux mb-6 text-center">
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white sm:text-base">
            {ULTRA_EDGE_CORE}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />
        <VisibleLoop
          className="flex w-max gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...PERFORMANCE_PILLARS, ...PERFORMANCE_PILLARS].map((pill, i) => {
            const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
            return (
              <span
                key={`${pill}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-silver-soft"
              >
                <Icon className="h-3.5 w-3.5 text-electric" />
                {pill}
              </span>
            );
          })}
        </VisibleLoop>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-lux">
          <div className="grid gap-6 lg:grid-cols-3">
            {VALUE_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 p-7 sm:p-8"
                style={{
                  background:
                    pillar.accent === "sun"
                      ? "linear-gradient(160deg, rgba(246,177,26,0.08), transparent 55%)"
                      : pillar.accent === "kool"
                        ? "linear-gradient(160deg, rgba(88,167,232,0.1), transparent 55%)"
                        : "linear-gradient(160deg, rgba(255,255,255,0.06), transparent 55%)",
                }}
              >
                <h3
                  className={`font-display text-2xl font-bold ${
                    pillar.accent === "sun"
                      ? "text-gradient-sun"
                      : pillar.accent === "kool"
                        ? "text-gradient-electric"
                        : "text-gradient-silver"
                  }`}
                >
                  {pillar.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-white"
                    >
                      <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-electric/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
