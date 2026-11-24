"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { RevealGroup, revealItem } from "@/components/ui/reveal";

const META: Record<string, { glow: string; line: string; crown: string }> = {
  legend: { glow: "rgba(88,167,232,0.35)", line: "from-electric", crown: "#58a7e8" },
  elite: { glow: "rgba(192,192,192,0.3)", line: "from-silver", crown: "#d8d8d8" },
  "sk-series": { glow: "rgba(88,167,232,0.25)", line: "from-kool", crown: "#7dd3ff" },
  signature: { glow: "rgba(212,175,55,0.3)", line: "from-titanium", crown: "#d4af37" },
};
const DEFAULT_META = META.legend;

/** Solid five-point crown with ball tips and a base bar. */
function CrownIcon({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={color}>
      <path d="M4.2 17 3 8.6l3.4 3.9 1.3-5.3 2.5 4.6L12 5.6l1.8 6.2 2.5-4.6 1.3 5.3L21 8.6 19.8 17Z" />
      <circle cx="3" cy="7.6" r="1.4" />
      <circle cx="7.7" cy="6" r="1.4" />
      <circle cx="12" cy="4.3" r="1.4" />
      <circle cx="16.3" cy="6" r="1.4" />
      <circle cx="21" cy="7.6" r="1.4" />
      <rect x="4.2" y="18.4" width="15.6" height="2.1" rx="0.4" />
    </svg>
  );
}

export function Categories({ categories }: {
  categories: { slug: string; href: string; name: string; description: string; productCount: number }[];
}) {
  return (
    <section className="relative py-16 sm:py-28 lg:py-36">
      <div className="container-lux">
        {/* No visible heading here; this keeps the cards' h3s under a section h2. */}
        <h2 className="sr-only">The Sunkool Collection</h2>

        <RevealGroup className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {categories.map((c) => {
            const m = META[c.slug] ?? DEFAULT_META;
            const count = c.productCount;
            return (
              <motion.div key={c.slug} variants={revealItem}>
                <Link
                  href={c.href}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-carbon-2 p-6 transition-colors hover:border-white/20 sm:p-8"
                >
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: m.glow }}
                  />
                  <div className="relative">
                    <span
                      className={`block h-1 w-12 rounded-full bg-gradient-to-r ${m.line} to-transparent`}
                    />
                    <h3 className="mt-6 flex items-center gap-2.5 font-display text-xl font-semibold text-white sm:text-2xl">
                      <CrownIcon
                        color={m.crown}
                        className="h-[1.1em] w-[1.1em] shrink-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                      />
                      {c.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white">
                      {c.description}
                    </p>
                  </div>
                  <div className="relative mt-10 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-white">
                      {count} products
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover:border-electric group-hover:bg-electric group-hover:text-black">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
