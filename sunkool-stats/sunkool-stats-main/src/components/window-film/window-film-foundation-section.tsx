"use client";

import Image from "next/image";
import { Layers } from "lucide-react";
import { WINDOW_FILM } from "@/lib/products";
import {
  FOUNDATION_GROUPS,
  FOUNDATION_PRODUCT_HIGHLIGHTS,
  FOUNDATION_SERIES,
} from "@/lib/window-film-content";
import { Reveal } from "@/components/ui/reveal";
import { TypewriterText } from "@/components/ui/typewriter-text";
import {
  SeriesAboutBlock,
  SeriesEyebrowBadge,
  SolarParametersGrid,
  SunkoolAdvantageGrid,
} from "./window-film-series-shared";
import { PRODUCT_CARD_GRID, WindowFilmProductCard } from "./window-film-product-card";
import { signatureNameFont } from "@/lib/fonts";

const ACCENT = "#58a7e8";
const ACCENT_GLOW = "#7dd3ff";

const seriesBySlug = (slug: string) => WINDOW_FILM.series.find((s) => s.slug === slug)!;
/** The shade card's main range, shown as groups in this section. */
const GROUP_SLUGS = ["legend", "elite", "sk-series"] as const;

/** A product intro that opens with its code ("HD 70: …") shows the code bold, like the card names. */
function IntroText({ text }: { text: string }) {
  const match = /^([A-Z]{2,3} ?\d{2}):\s*/.exec(text);
  if (!match) return <>{text}</>;
  return (
    <>
      <strong className="font-display font-bold text-white">{match[1]}:</strong>{" "}
      {text.slice(match[0].length)}
    </>
  );
}

export function WindowFilmFoundationSection() {
  const groups = GROUP_SLUGS.map((slug) => ({ slug, ...FOUNDATION_GROUPS[slug], products: seriesBySlug(slug).products }));
  const sunroofProducts = seriesBySlug("sunroof-special").products;
  const { sunroof } = FOUNDATION_PRODUCT_HIGHLIGHTS;

  return (
    <section
      id="foundation"
      // Negative scroll margin cancels the top padding (+ html scroll-padding 6rem) so a
      // #foundation jump lands with the image card just under the 64px header.
      // Small bottom padding: the Signature section follows directly, so no big empty gap.
      className="relative -scroll-mt-28 overflow-hidden pt-20 pb-8 sm:-scroll-mt-36 sm:pt-28 sm:pb-12"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(55% 45% at 15% 0%, ${ACCENT}18, transparent 65%)`,
        }}
      />

      <div className="container-lux relative">
        {/* Intro text only — the series hero image (HD-70 box) was removed on request. */}
        <div>
          <div className="max-w-3xl">
            <Reveal>
              <SeriesEyebrowBadge
                label={FOUNDATION_SERIES.eyebrow}
                accent={ACCENT}
                accentGlow={ACCENT_GLOW}
                shimmerClass="bg-gradient-to-r from-transparent via-sky-200/25 to-transparent"
                Icon={Layers}
              />
            </Reveal>
            <Reveal delay={0.05}>
              {/* "Window Film" in the blue gradient (like "Overview" below), the rest in white. */}
              <h2 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
                {FOUNDATION_SERIES.title.startsWith("Window Film") ? (
                  <>
                    <span className="text-gradient-electric">Window Film</span>
                    {FOUNDATION_SERIES.title.slice("Window Film".length)}
                  </>
                ) : (
                  FOUNDATION_SERIES.title
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-sm leading-relaxed text-white sm:text-base">
                {FOUNDATION_SERIES.blurb}
              </p>
            </Reveal>
            <SeriesAboutBlock aboutLabel="About SUNKOOL" />
          </div>
        </div>

        <SolarParametersGrid />
        <SunkoolAdvantageGrid />

        {groups.map((group) => (
          <div key={group.slug} id={group.slug}>
            <Reveal delay={0.1}>
              <p
                className="mb-5 mt-16 text-lg font-bold uppercase tracking-[0.2em] sm:text-xl"
                style={{ color: ACCENT_GLOW }}
              >
                <TypewriterText text={group.label} />
              </p>
            </Reveal>
            {group.headline && (
              <Reveal delay={0.05}>
                <h3 className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl">
                  {group.headline}
                </h3>
              </Reveal>
            )}
            {group.body.map((p, i) => (
              <Reveal key={i} delay={0.05}>
                <p className="mb-5 text-sm leading-relaxed text-white sm:text-base">{p}</p>
              </Reveal>
            ))}
            {group.image && (
              <Reveal delay={0.05}>
                <Image
                  src={group.image.src}
                  alt={group.image.alt}
                  width={group.image.width}
                  height={group.image.height}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="mb-6 h-auto w-full max-w-2xl rounded-3xl border border-white/10 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)]"
                />
              </Reveal>
            )}
            {group.link && (
              <p className="mb-5 text-sm leading-relaxed text-white sm:text-base">
                <a href={group.link.href} className="text-electric hover:text-white">
                  {group.link.label} →
                </a>
              </p>
            )}
            <div className={PRODUCT_CARD_GRID}>
              {group.products.map((p, i) => {
                const intro = group.productIntros?.[p.slug];
                const image = group.productImages?.[p.slug];
                const card = <WindowFilmProductCard key={p.slug} product={p} index={i} nameOnly={group.nameOnly} />;
                if (!intro && !image) return card;
                // Intro text → optional image → card, stacked in the product's own column.
                return (
                  <div key={p.slug} className="flex flex-col">
                    {intro && (
                      <Reveal delay={0.05}>
                        <p className="mb-4 text-sm leading-relaxed text-white sm:text-base">
                          <IntroText text={intro} />
                        </p>
                      </Reveal>
                    )}
                    {image && (
                      <Reveal delay={0.05}>
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          // Square crop so side-by-side product images match in height.
                          className="mb-4 aspect-square w-full rounded-3xl border border-white/10 object-cover shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)]"
                        />
                      </Reveal>
                    )}
                    {card}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-12 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-electric/5 to-black/40 p-6 sm:p-8">
          <Reveal>
            <h3
              className={`${signatureNameFont.variable} font-[family-name:var(--font-signature-name)] text-xl font-normal italic text-white sm:text-2xl`}
            >
              {sunroof.title}
            </h3>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-sm leading-relaxed text-white sm:text-base">
              {sunroof.intro}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm font-semibold text-silver-soft">
              {sunroof.specialTitle}
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
