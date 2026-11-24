"use client";

import { motion } from "motion/react";
import { Award, RefreshCw, ShieldCheck } from "lucide-react";
import { WARRANTY_PROMISES } from "@/lib/warranty-content";
import { Reveal } from "@/components/ui/reveal";
import { EASE_OUT as ease } from "@/lib/motion";

const ICONS = {
  shield: ShieldCheck,
  transfer: RefreshCw,
  network: Award,
} as const;

export function WarrantyPromiseGrid() {
  return (
    <>
      {/* Mobile: horizontal snap strip */}
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory sm:hidden">
        {WARRANTY_PROMISES.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal key={item.title} delay={index * 0.06}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                className="group flex min-w-[85%] snap-center items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-electric">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* Desktop: grid */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-3">
        {WARRANTY_PROMISES.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal key={item.title} delay={index * 0.06}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.35, ease }}
                className="group flex h-full items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-6 py-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-electric transition-colors duration-300 group-hover:border-electric/30 group-hover:bg-electric/10">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.05rem] font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
