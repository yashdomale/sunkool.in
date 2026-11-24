"use client";

import { motion } from "motion/react";
import {
  Car,
  CloudSun,
  Droplets,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { EASE_OUT as ease } from "@/lib/motion";

const PROTECTIONS = [
  { icon: ShieldCheck, label: "Scratch Resistant" },
  { icon: Palette, label: "Anti-Yellow Coating" },
  { icon: Droplets, label: "Stain Resistant" },
  { icon: CloudSun, label: "UV & Weather Resistant" },
  { icon: Sparkles, label: "Maintains Gloss & Shine" },
  {
    icon: Car,
    label: "Protects Interior Surfaces From Daily Wear and Tear",
  },
] as const;

export function InteriorPpfProtection() {
  return (
    <section id="protection" className="relative py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08] mask-fade-y" />
      <div className="container-lux relative">
        <SectionHeading
          eyebrow="Advanced Protection Technology"
          title={
            <>
              Built to withstand{" "}
              <span className="text-gradient-silver">daily life</span>.
            </>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROTECTIONS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06, ease }}
              whileHover={{ y: -3 }}
              className="glass flex items-center gap-4 rounded-2xl p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-electric">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium leading-snug text-white sm:text-base">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
