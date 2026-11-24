"use client";

import { motion } from "motion/react";
import { Award, Layers, SunMedium } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { EASE_OUT as ease } from "@/lib/motion";

const FEATURES = [
  {
    icon: Award,
    title: "3-Year Warranty",
    body: "Long-lasting protection backed by a 3-year warranty for complete peace of mind.",
  },
  {
    icon: Layers,
    title: "195 Micron Thickness",
    body: "Premium 195 micron film engineered for superior durability and protection.",
  },
  {
    icon: SunMedium,
    title: "99% UV Protection",
    body: "Advanced UV blocking technology helps prevent fading and interior damage caused by harmful sun exposure.",
  },
] as const;

export function InteriorPpfFeatures() {
  return (
    <section id="features" className="py-14 sm:py-20">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Highlight Features"
          title={
            <>
              <span className="text-gradient-silver">Engineered</span> for
              everyday protection.
            </>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.08, ease }}
              whileHover={{ y: -4 }}
              className="glass rounded-3xl p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-silver">
                <item.icon className="h-6 w-6" />
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
  );
}
