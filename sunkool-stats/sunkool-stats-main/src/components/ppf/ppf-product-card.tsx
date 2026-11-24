"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/products";
import { CountUp } from "@/components/common/count-up";
import { ppfEase } from "./ppf-motion";

function SpecCell({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: ppfEase }}
      className="rounded-2xl border border-white/8 bg-black/40 p-3 text-center"
    >
      <p className="text-[9px] uppercase tracking-[0.14em] text-white sm:text-[10px]">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
        <CountUp target={value} suffix="%" />
      </p>
    </motion.div>
  );
}

function TextSpecCell({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: ppfEase }}
      className="rounded-2xl border border-white/8 bg-black/40 p-3 text-center"
    >
      <p className="text-[9px] uppercase tracking-[0.14em] text-white sm:text-[10px]">
        {label}
      </p>
      <p className="mt-1 font-display text-sm font-bold text-white sm:text-base">
        {value}
      </p>
    </motion.div>
  );
}

export function PpfProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: ppfEase }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-black/50 p-5 backdrop-blur-sm sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80"
        style={{ background: product.accent }}
      />
      <p className="relative font-display text-lg font-bold text-white">
        {product.name}
      </p>
      <p className="relative mt-1 text-xs text-white">{product.tagline}</p>
      <div className="relative mt-4 grid grid-cols-2 gap-2.5">
        <SpecCell label="UV Rejection" value={product.uv} />
        {product.thickness ? (
          <TextSpecCell label="Thickness" value={product.thickness} />
        ) : (
          <SpecCell label="Clarity" value={product.vlt} />
        )}
        <TextSpecCell
          label="Self-Healing"
          value={product.slug === "signature" ? "Heat restorative" : "Active"}
        />
        <TextSpecCell label="Film Type" value="Aliphatic TPU" />
      </div>
      {product.highlightFeatures && product.highlightFeatures.length > 0 && (
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {product.highlightFeatures.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
      {product.note && (
        <p className="relative mt-3 text-[11px] leading-relaxed text-white/90">
          {product.note}
        </p>
      )}
      <p className="relative mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-silver">
        <ShieldCheck className="h-3.5 w-3.5" />
        Premium PPF
      </p>
    </motion.div>
  );
}
