"use client";

import { Gem } from "lucide-react";
import { PPF } from "@/lib/products";
import { SIGNATURE_PPF_SERIES } from "@/lib/ppf-content";
import { PPF_MEDIA } from "@/lib/ppf-media";
import { MediaSlot, MEDIA_SIZES_HERO_SIDE } from "@/components/media/media-slot";
import { Reveal } from "@/components/ui/reveal";
import { SeriesEyebrowBadge } from "@/components/window-film/window-film-series-shared";
import { PpfProductCard } from "./ppf-product-card";
import {
  PpfSignatureFeatures,
  PpfSignatureInstallGrid,
  PpfSignatureSpecTable,
} from "./ppf-signature-details";
import {
  PpfCallout,
  PpfSeriesMedia,
  PpfSeriesShell,
} from "./ppf-series-shell";

const ACCENT = "#f47521";
const ACCENT_GLOW = "#ffbf96";

const coreSeries = PPF.series.find((s) => s.slug === "core")!;
const signature = coreSeries.products.find((p) => p.slug === "signature")!;

export function PpfSignatureSection() {
  const media = PPF_MEDIA.series.signature;

  return (
    <PpfSeriesShell id="signature" accent={ACCENT} glowSide="right">
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-6 lg:order-1 lg:col-span-7 lg:gap-7">
          <div>
            <Reveal>
              <SeriesEyebrowBadge
                label={SIGNATURE_PPF_SERIES.eyebrow}
                accent={ACCENT}
                accentGlow={ACCENT_GLOW}
                shimmerClass="bg-gradient-to-r from-transparent via-sun/30 to-transparent"
                Icon={Gem}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
                {SIGNATURE_PPF_SERIES.title}
              </h2>
            </Reveal>
            <Reveal delay={0.07}>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
                {SIGNATURE_PPF_SERIES.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.09}>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white sm:text-base">
                {SIGNATURE_PPF_SERIES.blurb}
              </p>
            </Reveal>
          </div>

          <PpfSignatureFeatures />

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <PpfProductCard product={signature} index={0} />
            <PpfCallout
              title={SIGNATURE_PPF_SERIES.specialTitle}
              body={SIGNATURE_PPF_SERIES.specialBody}
              variant="sun"
            />
          </div>
        </div>

        <PpfSeriesMedia className="lg:order-2 lg:col-span-5">
          <MediaSlot
            src={media.hero}
            alt={media.heroAlt}
            aspect="4/5"
            accent={ACCENT}
            label="Signature Ultimate PPF"
            fileHint={`public${media.hero}`}
            sizes={MEDIA_SIZES_HERO_SIDE}
            className="rounded-3xl shadow-[0_32px_80px_-24px_rgba(246,177,26,0.25)]"
          />
        </PpfSeriesMedia>
      </div>

      <div className="mt-10 space-y-10 sm:mt-12">
        <PpfSignatureInstallGrid />
        <PpfSignatureSpecTable />
      </div>
    </PpfSeriesShell>
  );
}
