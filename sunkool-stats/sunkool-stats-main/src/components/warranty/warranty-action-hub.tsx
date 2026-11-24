"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, QrCode, ShieldCheck, Store } from "lucide-react";
import { WARRANTY_ACTIONS } from "@/lib/warranty-content";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { EASE_OUT as ease } from "@/lib/motion";

const ACTION_ICONS = {
  check: ShieldCheck,
  register: QrCode,
  dealer: Store,
} as const;

export function WarrantyActionHub() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {WARRANTY_ACTIONS.map((action, index) => {
        const Icon = ACTION_ICONS[action.id];

        if (action.id === "dealer") {
          return (
            <Reveal
              key={action.id}
              delay={index * 0.08}
              className="lg:col-span-2"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease }}
                className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 lg:flex-row lg:items-center lg:gap-8"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-electric">
                  <Icon className="h-6 w-6" />
                </span>

                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:tracking-[0.2em]">
                    {action.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                    {action.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white">
                    {action.description}
                  </p>
                </div>

                <Link
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-electric/50 hover:text-electric sm:w-fit"
                >
                  {action.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </Reveal>
          );
        }

        return (
          <Reveal key={action.id} delay={index * 0.08}>
            <motion.div
              id={action.id === "register" ? "register-portal" : undefined}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease }}
              className={cn(
                "group relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border p-5 sm:scroll-mt-28 sm:p-8",
                action.featured
                  ? "border-electric/25 bg-gradient-to-br from-electric/10 via-black/40 to-black/60"
                  : "border-white/10 bg-white/[0.03]"
              )}
            >
              {action.featured && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-electric/15 blur-3xl transition-all duration-700 group-hover:bg-electric/25" />
              )}

              <div className="relative flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl",
                    action.featured
                      ? "bg-electric text-black shadow-[0_8px_24px_-6px_rgba(88,167,232,0.5)]"
                      : "border border-white/15 bg-white/5 text-electric"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-white/80 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-electric sm:block" />
              </div>

              <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:mt-6 sm:tracking-[0.2em]">
                {action.eyebrow}
              </p>
              <h3 className="relative mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                {action.title}
              </h3>
              <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white">
                {action.description}
              </p>

              <Link
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 sm:mt-8 sm:w-fit",
                  action.featured
                    ? "bg-electric text-black hover:bg-[#7dd3ff] hover:shadow-[0_8px_32px_-6px_rgba(88,167,232,0.6)]"
                    : "border border-white/20 text-white hover:border-electric/50 hover:text-electric"
                )}
              >
                {action.cta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </Reveal>
        );
      })}
    </div>
  );
}
