"use client";

import { Shield } from "lucide-react";
import { PPF } from "@/lib/products";
import { HD07_SERIES } from "@/lib/ppf-content";
import { PPF_MEDIA } from "@/lib/ppf-media";
import { MediaSlot, MEDIA_SIZES_HERO_SIDE } from "@/components/media/media-slot";
import { Reveal } from "@/components/ui/reveal";
import { SeriesEyebrowBadge } from "@/components/window-film/window-film-series-shared";
import { PpfProductCard } from "./ppf-product-card";
import {
  PpfCallout,
  PpfSeriesMedia,
  PpfSeriesShell,
} from "./ppf-series-shell";

const ACCENT = "#c0c0c0";
const ACCENT_GLOW = "#e8e8e8";

const coreSeries = PPF.series.find((s) => s.slug === "core")!;
const hd07 = coreSeries.products.find((p) => p.slug === "hd07")!;

export function PpfHd07Section() {
  const media = PPF_MEDIA.series.hd07;

  return (
    <PpfSeriesShell id="hd07" accent={ACCENT} glowSide="left">
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <PpfSeriesMedia className="lg:col-span-5">
          <MediaSlot
            src={media.hero}
            alt={media.heroAlt}
            aspect="4/5"
            accent={ACCENT}
            label="HD07 PPF hero"
            fileHint={`public${media.hero}`}
            sizes={MEDIA_SIZES_HERO_SIDE}
            className="rounded-3xl shadow-[0_32px_80px_-24px_rgba(192,192,192,0.35)]"
          />
        </PpfSeriesMedia>

        <div className="flex flex-col gap-6 lg:col-span-7 lg:gap-7">
          <div>
            <Reveal>
              <SeriesEyebrowBadge
                label={HD07_SERIES.eyebrow}
                accent={ACCENT}
                accentGlow={ACCENT_GLOW}
                shimmerClass="bg-gradient-to-r from-transparent via-white/20 to-transparent"
                Icon={Shield}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
                {HD07_SERIES.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white sm:text-base">
                {HD07_SERIES.blurb}
              </p>
            </Reveal>
          </div>

          <PpfProductCard product={hd07} index={0} />

          <PpfCallout
            title={HD07_SERIES.specialTitle}
            body={HD07_SERIES.specialBody}
            variant="silver"
          />
        </div>
      </div>
    </PpfSeriesShell>
  );
}
