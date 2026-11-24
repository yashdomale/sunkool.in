"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { Gem } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { WINDOW_FILM } from "@/lib/products";
import {
  SIGNATURE_PRODUCT_HIGHLIGHTS,
  SIGNATURE_SERIES,
  SIGNATURE_SUNROOF,
} from "@/lib/window-film-content";
import { WINDOW_FILM_MEDIA } from "@/lib/window-film-media";
import { MediaSlot } from "@/components/media/media-slot";
import { Reveal } from "@/components/ui/reveal";
import {
  SeriesAboutBlock,
  SeriesEyebrowBadge,
  SunkoolAdvantageGrid,
} from "./window-film-series-shared";
import {
  PRODUCT_CARD_GRID,
  WindowFilmFeaturedBlock,
  WindowFilmProductCard,
} from "./window-film-product-card";
import { signatureNameFont } from "@/lib/fonts";

const ACCENT = "#f47521";
const ACCENT_GLOW = "#ffbf96";

const signatureSeries = WINDOW_FILM.series.find((s) => s.slug === "signature")!;
const coreSlugs = ["sapphire", "onyx", "graphite"] as const;

// The logo is a raster image, so the "pen" effect is a soft-edged left-to-right
// reveal. The mask grows past 100% so the feathered edge exits the logo and the
// final frame is fully opaque.
function SignatureLogoWrite() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const progress = useMotionValue(0);
  const maskSize = useTransform(progress, (v) => `${v}% 100%`);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(progress, 125, {
      duration: 2.6,
      delay: 0.25,
      ease: [0.5, 0.1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, reduced, progress]);

  const mask = "linear-gradient(90deg, #000 0, #000 80%, transparent 100%)";

  return (
    <motion.div
      ref={ref}
      className="w-40 shrink-0 sm:w-52"
      style={
        reduced
          ? undefined
          : {
              maskImage: mask,
              WebkitMaskImage: mask,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize,
              WebkitMaskSize: maskSize,
            }
      }
    >
      <Image
        src="/images/window-film/signature%20golden%20logo.png"
        alt=""
        aria-hidden
        width={4390}
        height={1696}
        className="h-auto w-full"
      />
    </motion.div>
  );
}

export function WindowFilmSignatureSection() {
  const coreProducts = signatureSeries.products.filter((p) =>
    (coreSlugs as readonly string[]).includes(p.slug)
  );
  const family = (name: string) => signatureSeries.products.filter((p) => p.family === name);
  const sunroofProducts = WINDOW_FILM.series.find((s) => s.slug === "signature-sunroof")!.products;
  const media = WINDOW_FILM_MEDIA.series.signature;

  return (
    <section
      id="signature"
      // Scroll margin + top padding (+ html scroll-padding 6rem) put a #signature jump's content
      // ~150px from the top, a little below the header. Top padding is small so there's no big
      // empty gap after the Legend/Elite/SK section.
      className="relative scroll-mt-6 overflow-hidden pt-8 pb-20 sm:scroll-mt-2 sm:pt-12 sm:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(55% 45% at 15% 0%, ${ACCENT}18, transparent 65%)`,
        }}
      />

      <div className="container-lux relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <MediaSlot
              src={media.hero}
              alt={media.heroAlt}
              aspect="4/5"
              accent={ACCENT}
              label="Signature Series hero"
              fileHint={`public${media.hero}`}
              className="rounded-3xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)]"
            />
            {/* About text sits directly under the product image, on every screen size. */}
            <div className="mt-6">
              <SeriesAboutBlock aboutLabel="About SUNKOOL" />
            </div>
          </div>

          {/* Mobile: badge + Signature logo come first, above the product image and About text. */}
          <div className="order-first lg:order-none">
            <Reveal>
              <SeriesEyebrowBadge
                label={SIGNATURE_SERIES.eyebrow}
                accent={ACCENT}
                accentGlow={ACCENT_GLOW}
                shimmerClass="bg-gradient-to-r from-transparent via-sun/30 to-transparent"
                Icon={Gem}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 flex items-center gap-3 sm:gap-4">
                <span className="sr-only">{SIGNATURE_SERIES.title}</span>
                <SignatureLogoWrite />
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-sun/5 to-black/40 p-6 sm:p-8">
          <Reveal>
            <h3 className="font-display text-xl font-bold text-gradient-sun sm:text-2xl">
              {SIGNATURE_SERIES.specialTitle}
            </h3>
          </Reveal>
          {SIGNATURE_SERIES.specialBody.map((p, i) => (
            <Reveal key={i} delay={0.05}>
              <p className="mt-4 text-sm leading-relaxed text-white sm:text-base">{p}</p>
            </Reveal>
          ))}
        </div>

        <SunkoolAdvantageGrid />

        <Reveal delay={0.1}>
          <p
            className="mb-5 mt-16 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: ACCENT_GLOW }}
          >
            Signature grades
          </p>
        </Reveal>
        <div className={PRODUCT_CARD_GRID}>
          {coreProducts.map((p, i) => (
            <WindowFilmProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>

        <WindowFilmFeaturedBlock
          products={family("emerald")}
          title={SIGNATURE_PRODUCT_HIGHLIGHTS.emerald.title}
          body={SIGNATURE_PRODUCT_HIGHLIGHTS.emerald.body}
        />

        <WindowFilmFeaturedBlock
          products={family("topaz")}
          title={SIGNATURE_PRODUCT_HIGHLIGHTS.topaz.title}
          body={SIGNATURE_PRODUCT_HIGHLIGHTS.topaz.body}
          signatureTitleFont
        />

        <WindowFilmFeaturedBlock
          products={family("diamond")}
          title={SIGNATURE_PRODUCT_HIGHLIGHTS.diamond.title}
          body={SIGNATURE_PRODUCT_HIGHLIGHTS.diamond.body}
          signatureTitleFont
        />

        <div className="mt-12 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-sun/5 to-black/40 p-6 sm:p-8">
          <Reveal>
            {/* "Signature" is shown as the gold logo; the rest of the title stays as text. */}
            <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-xl font-bold text-white sm:text-2xl">
              <span className="sr-only">Signature</span>
              <Image
                src="/images/window-film/signature%20golden%20logo.png"
                alt=""
                aria-hidden
                width={4390}
                height={1696}
                className="h-[2.2em] w-auto"
              />
              <span
                className={`${signatureNameFont.variable} font-[family-name:var(--font-signature-name)] font-normal italic`}
              >
                {SIGNATURE_SUNROOF.title.replace(/^Signature\s*/i, "")}
              </span>
            </h3>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-sm leading-relaxed text-white sm:text-base">
              {SIGNATURE_SUNROOF.intro}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm font-semibold text-silver-soft">
              {SIGNATURE_SUNROOF.specialTitle}
            </p>
          </Reveal>
        </div>
        {/* Cards sit outside the panel so they're the same size as every other card. */}
        <div className={`mt-4 ${PRODUCT_CARD_GRID}`}>
          {sunroofProducts.map((p, i) => (
            <WindowFilmProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
