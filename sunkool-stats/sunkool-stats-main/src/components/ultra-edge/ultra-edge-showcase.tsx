"use client";
import { VisibleLoopSpan } from "@/components/ui/visible-loop";

import { motion } from "motion/react";
import { Layers } from "lucide-react";
import {
  PRODUCT_FEATURES,
  ULTRA_EDGE_LINES,
  type UltraEdgeLine,
} from "@/lib/ultra-edge-content";
import { ULTRA_EDGE_MEDIA } from "@/lib/ultra-edge-media";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/common/count-up";
import { MediaSlot } from "@/components/media/media-slot";
import { EASE_OUT as ease } from "@/lib/motion";
import { groupUvWithClarity } from "@/lib/feature-chips";
import { signatureNameFont } from "@/lib/fonts";

/** Sections whose heading uses the squared, slanted Audiowide face (same as the window-film Signature names). */
const SIGNATURE_FONT_LINES = new Set(["sunroof", "moonroof"]);

const SHIMMER_CLASS: Record<UltraEdgeLine["shimmer"], string> = {
  silver:
    "bg-gradient-to-r from-transparent via-white/25 to-transparent",
  gold: "bg-gradient-to-r from-transparent via-sun/30 to-transparent",
  violet:
    "bg-gradient-to-r from-transparent via-violet-300/25 to-transparent",
  sky: "bg-gradient-to-r from-transparent via-sky-200/25 to-transparent",
  indigo:
    "bg-gradient-to-r from-transparent via-indigo-200/25 to-transparent",
};

function VariantCard({
  variant,
  accent,
  index,
  className,
}: {
  variant: UltraEdgeLine["variants"][number];
  accent: string;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.08, ease }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-black/50 p-6 backdrop-blur-sm ${className ?? ""}`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl opacity-40 transition-opacity group-hover:opacity-80"
        style={{ background: accent }}
      />
      <p className="relative font-display text-lg font-bold text-white">
        {variant.name}
      </p>
      <p className="relative mt-1 text-xs text-white">{variant.tagline}</p>
      {/* All four solar values get the same big stat tile. */}
      <div className="relative mt-5 grid grid-cols-2 gap-3">
        {(
          [
            ["VLT", variant.vlt],
            ["TSER", variant.tser],
            ["IR", variant.ir],
            ["UV", variant.uv],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/8 bg-black/40 p-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-white">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              <CountUp target={value} suffix="%" />
            </p>
          </div>
        ))}
      </div>
      {variant.thickness && (
        <p className="relative mt-4 text-xs text-white">
          Thickness:{" "}
          <span className="text-silver-soft">{variant.thickness}</span>
        </p>
      )}
    </motion.div>
  );
}

function ShowcaseSection({
  line,
  reversed,
  first,
  last,
}: {
  line: UltraEdgeLine;
  reversed?: boolean;
  first: boolean;
  last: boolean;
}) {
  const media = ULTRA_EDGE_MEDIA.lines[line.mediaKey];
  const heroBelowTitle = "heroBelowTitle" in media && media.heroBelowTitle;
  const hero = (
    <MediaSlot
      src={media.hero}
      alt={media.heroAlt}
      aspect={"heroAspect" in media ? media.heroAspect : "4/5"}
      accent={line.accent}
      label={`${line.name} hero`}
      fileHint={`public${media.hero}`}
      className="rounded-3xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)]"
    />
  );

  return (
    <section
      id={line.slug}
      // The showcases are stacked back to back, so each keeps only half padding on the
      // sides that face another showcase: the gap between two is one full step, not two.
      className={`relative overflow-hidden ${first ? "pt-20 sm:pt-28" : "pt-10 sm:pt-14"} ${last ? "pb-20 sm:pb-28" : "pb-10 sm:pb-14"}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(55% 45% at ${reversed ? "85%" : "15%"} 0%, ${line.accent}18, transparent 65%)`,
        }}
      />
      <div className="container-lux relative">
        <div
          className={
            heroBelowTitle
              ? "max-w-4xl"
              : `grid gap-10 lg:grid-cols-2 lg:gap-16 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`
          }
        >
          {!heroBelowTitle && (
            <div className="lg:sticky lg:top-36 lg:self-start">{hero}</div>
          )}

          <div>
            <Reveal>
              <span
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] isolate"
                style={{
                  borderColor: `${line.accent}55`,
                  color: line.accentGlow,
                  background: `${line.accent}12`,
                }}
              >
                <VisibleLoopSpan
                  className={`pointer-events-none absolute inset-0 ${SHIMMER_CLASS[line.shimmer]}`}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Layers className="relative h-3 w-3" />
                <span className="relative">{line.materialLabel}</span>
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className={
                  SIGNATURE_FONT_LINES.has(line.slug)
                    ? `${signatureNameFont.variable} mt-5 font-[family-name:var(--font-signature-name)] text-4xl font-normal italic text-white sm:text-5xl`
                    : "mt-5 font-display text-4xl font-bold text-white sm:text-5xl"
                }
              >
                {line.name}
              </h2>
            </Reveal>
            {heroBelowTitle && (
              <Reveal delay={0.08}>
                <div className="mt-6">{hero}</div>
              </Reveal>
            )}

            <div className="mt-6 space-y-4">
              {line.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.04}>
                  <p className="text-sm leading-relaxed text-white sm:text-base">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-wrap gap-2">
                {/* "99% UV Block" and "Crystal Clear Vision" stay side by side when the chips wrap. */}
                {groupUvWithClarity(PRODUCT_FEATURES).map((group) => (
                  <span key={group.join("|")} className="flex gap-2">
                    {group.map((f) => (
                      <span
                        key={f}
                        className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white"
                      >
                        {f}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </Reveal>

            {line.applyNote && (
              <Reveal delay={0.24}>
                <p className="mt-4 text-xs italic text-sun/90">
                  {line.applyNote}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <p
                className="mb-5 mt-10 text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: line.accentGlow }}
              >
                {line.cta}
              </p>
            </Reveal>
            <div
              className={
                line.variants.length > 1
                  ? "grid gap-4 sm:grid-cols-2"
                  : "max-w-md"
              }
            >
              {line.variants.map((v, i) => (
                <VariantCard
                  key={v.slug}
                  variant={v}
                  accent={line.accent}
                  index={i}
                  className={
                    line.variants.length === 3 && i === 0 ? "sm:col-span-2" : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function UltraEdgeShowcases() {
  return (
    <>
      {ULTRA_EDGE_LINES.map((line, i) => (
        <ShowcaseSection
          key={line.slug}
          line={line}
          reversed={i % 2 === 1}
          first={i === 0}
          last={i === ULTRA_EDGE_LINES.length - 1}
        />
      ))}
    </>
  );
}
