"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/products";
import { CountUp } from "@/components/common/count-up";
import { EASE_OUT as ease } from "@/lib/motion";
import { groupUvWithClarity } from "@/lib/feature-chips";
import { signatureNameFont } from "@/lib/fonts";

/** Only these product names use the squared, slanted Audiowide face: the Signature range and the sunroof/moonroof films. */
const SIGNATURE_FONT_SLUGS = new Set([
  "sapphire", "emerald", "onyx", "graphite",
  "topaz-70", "topaz-50",
  "diamond-90", "diamond", "diamond-40",
  "sunroof-protection", "moonroof-heat-control",
  "signature-sunroof", "signature-moonroof",
]);

function SpecCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/40 p-3 text-center">
      <p className="text-[9px] uppercase tracking-[0.14em] text-white sm:text-[10px]">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
        <CountUp target={value} suffix="%" />
      </p>
    </div>
  );
}

export function WindowFilmProductCard({
  product,
  index,
  nameOnly = false,
}: {
  product: Product;
  index: number;
  /** Show just the product name — no tagline, specs or notes. */
  nameOnly?: boolean;
}) {
  if (nameOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: index * 0.06, ease }}
        whileHover={{ y: -6 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-black/50 p-5 backdrop-blur-sm sm:p-6"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80"
          style={{ background: product.accent }}
        />
        <p className="relative font-display text-lg font-bold text-white">{product.name}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.06, ease }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-black/50 p-5 backdrop-blur-sm sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80"
        style={{ background: product.accent }}
      />
      <p
        className={
          SIGNATURE_FONT_SLUGS.has(product.slug)
            ? `${signatureNameFont.variable} relative font-[family-name:var(--font-signature-name)] text-lg font-normal italic text-white`
            : "relative font-display text-lg font-bold text-white"
        }
      >
        {product.name}
      </p>
      <p className="relative mt-1 text-xs text-white">{product.tagline}</p>
      <div className="relative mt-4 grid grid-cols-2 gap-2.5">
        <SpecCell label="VLT" value={product.vlt} />
        <SpecCell label="TSER" value={product.tser} />
        <SpecCell label="IR Rejection" value={product.ir} />
        <SpecCell label="UV Rejection" value={product.uv} />
      </div>
      {product.thickness && (
        <p className="relative mt-3 text-xs text-white">
          Thickness:{" "}
          <span className="text-silver-soft">{product.thickness}</span>
        </p>
      )}
      {product.applyNote && (
        <p className="relative mt-1 text-xs italic text-sun/90">
          {product.applyNote}
        </p>
      )}
      {product.highlightFeatures && (
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {/* "99% UV Block" and "Crystal Clear Vision" stay side by side when the chips wrap. */}
          {groupUvWithClarity(product.highlightFeatures).map((group) => (
            <span key={group.join("|")} className="flex gap-1.5">
              {group.map((f) => (
                <span
                  key={f}
                  className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-white"
                >
                  {f}
                </span>
              ))}
            </span>
          ))}
        </div>
      )}
      {product.note && !product.highlightFeatures && (
        <p className="relative mt-3 text-[11px] leading-relaxed text-white/90">
          {product.note}
        </p>
      )}
      {product.warrantyMonths && (
        <p className="relative mt-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-electric">
          <ShieldCheck className="h-3.5 w-3.5" />
          {product.warrantyMonths} months warranty
        </p>
      )}
    </motion.div>
  );
}

/**
 * The one grid every product card on the window film page sits in, so all cards
 * are the same size (full width on mobile, 2 per row on tablet, 3 on desktop).
 */
export const PRODUCT_CARD_GRID = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

/**
 * A film (or a family of variants, e.g. Diamond 90/70/40) with its description.
 * The title/description sit in a panel; the cards sit below it on the shared grid
 * (not inside the panel's padding), so they match every other card's size.
 */
export function WindowFilmFeaturedBlock({
  products,
  title,
  body,
  signatureTitleFont = false,
}: {
  products: Product[];
  title: string;
  body: string;
  /** Show the heading in the same squared, slanted face as the product names. */
  signatureTitleFont?: boolean;
}) {
  return (
    <div className="mt-12">
      <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-black/40 p-6 sm:p-8">
        <h3
          className={
            signatureTitleFont
              ? `${signatureNameFont.variable} font-[family-name:var(--font-signature-name)] text-xl font-normal italic sm:text-2xl`
              : "font-display text-xl font-bold sm:text-2xl"
          }
          style={{ color: products[0].accent }}
        >
          {title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-white sm:text-base">{body}</p>
      </div>
      <div className={`mt-4 ${PRODUCT_CARD_GRID}`}>
        {products.map((p, i) => (
          <WindowFilmProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
