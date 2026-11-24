"use client";

import { motion } from "motion/react";
import { Gem } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function InteriorPpfWhyChoose() {
  return (
    <section id="why-choose" className="py-14 sm:py-20">
      <div className="container-lux grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
        <SectionHeading
          eyebrow="Why Choose Interior PPF?"
          title={
            <>
              Invisible protection.{" "}
              <span className="text-gradient-silver">Uncompromised style.</span>
            </>
          }
          description="Your vehicle interior experiences constant exposure to scratches, stains, sunlight, and environmental factors. Sunkool Interior PPF is engineered to provide invisible protection while maintaining the premium appearance and finish of your vehicle."
          className="max-w-none"
        />

        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-strong relative overflow-hidden rounded-[2rem] p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-silver">
                <Gem className="h-6 w-6" />
              </div>
              <p className="font-display text-2xl font-semibold text-gradient-silver">
                Preserve every surface.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white">
                Dashboards, consoles, door panels and trim — protected against
                the wear that shows up first and lasts the longest.
              </p>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
