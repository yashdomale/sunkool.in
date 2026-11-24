"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { setImmersiveChrome, resetImmersiveChrome } from "@/lib/immersive-store";
import { getImageProps } from "next/image";
import { motion } from "motion/react";
import { Logo } from "@/components/layout/logo";
import { REVEAL_COPY } from "@/lib/narrative-script";
import { WINDOW_FILM_BRAND } from "@/lib/window-film-content";
import { TECH_DEMO_MOBILE_HERO_IMAGE } from "@/lib/tech-demo-media";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";
import { EASE_OUT as ease } from "@/lib/motion";

const textShadow = "0 2px 20px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,1)";

/**
 * Static hero for mobile — replaces the pinned scroll-scrub video, which is
 * too heavy/janky on touch scrolling. The photo is a finished creative (its
 * own headline badge + UV/IR diagram baked in), so it's shown at its native
 * 4:5 crop rather than force-covered into 100svh — cropping would cut the
 * badge or diagram. The tagline sits just below the photo, pulled up to
 * overlap its scrimmed bottom edge, and uses the logo's own flat solid
 * colors (gold "Sun" / blue "kool") rather than a gradient. Falls back to a
 * brand-gradient placeholder if the file at
 * `TECH_DEMO_MOBILE_HERO_IMAGE.fileHint` is ever missing.
 */
export function MobileHeroPhoto() {
  const heroRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showPhoto = loaded && !failed;
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    // A native picture can finish loading before React hydrates its onLoad.
    if (image?.complete && image.naturalWidth > 0) {
      queueMicrotask(() => setLoaded(true));
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateNavigation = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      setImmersiveChrome({
        navVisible: window.scrollY <= 12 || hero.getBoundingClientRect().bottom <= 80,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateNavigation);
    };
    updateNavigation();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resetImmersiveChrome();
    };
  }, []);

  // REVEAL_COPY.line2 is "Sunkool is here." — "Sunkool" is rendered as the
  // wordmark logo, followed by the rest of the line as text.
  const brandRest = REVEAL_COPY.line2.slice(7).trim();

  return (
    <section ref={heroRef} className="relative w-full bg-black">
      {/* clears the fixed navbar so the photo's top edge (sun burst, badge) isn't covered */}
      <div className="h-20" aria-hidden />

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: showPhoto ? 0 : 1 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_8%,rgba(246,177,26,0.16),transparent_58%),radial-gradient(120%_90%_at_88%_18%,rgba(88,167,232,0.18),transparent_58%),linear-gradient(180deg,#0b0d0f_0%,#000_60%)]" />
          <div className="absolute inset-0 bg-grid opacity-[0.25] mask-fade-y" />
        </div>

        <picture>
          {/* SSR includes the mobile hero; desktop must not download its photo. */}
          <source media="(min-width: 1024px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />
          <img
          ref={imageRef}
          {...getImageProps({
            src: resolvePublicAssetSrc(TECH_DEMO_MOBILE_HERO_IMAGE.src),
            alt: "SUNKOOL nanoceramic film reflecting UV and IR rays away from a car cabin, keeping the family inside cool",
            fill: true,
            sizes: "100vw",
          }).props}
          alt="SUNKOOL nanoceramic film reflecting UV and IR rays away from a car cabin, keeping the family inside cool"
          loading="eager"
          fetchPriority="high"
          className={`object-cover object-center transition-opacity duration-700 ${
            showPhoto ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          />
        </picture>

        {failed && process.env.NODE_ENV !== "production" && (
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/50 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/90">
                Placeholder
              </p>
              <p className="mt-2 text-sm text-silver-soft/85">
                Add {TECH_DEMO_MOBILE_HERO_IMAGE.fileHint}
              </p>
              <p className="mt-1 text-[11px] text-white/80">
                Portrait crop, 4:5 · car cabin lit by direct sun
              </p>
            </div>
          </div>
        )}

        {/* scrim reaches up toward the side-mirror line — eases the photo into the copy block below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[62%] bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* pulled up further, to sit near the side mirror in the photo */}
      <div className="relative z-[10] -mt-46 px-6 pb-14 pt-4">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          // Words spread edge-to-edge (justify-between) and the font scales with
          // the viewport, so the line always spans the full text column.
          className="eyebrow mt-7 flex justify-between tracking-[0.2em] text-white/50"
          style={{ textShadow, fontSize: "clamp(0.8rem, calc((100vw - 3rem) / 22), 1.5rem)" }}
          aria-label="Built to Keep Heat Out."
        >
          {"Built to Keep Heat Out.".split(" ").map((word, i, words) => (
            <span
              key={word}
              aria-hidden
              // trim the trailing letter-spacing so the last letter sits flush right
              className={i === words.length - 1 ? "-mr-[0.2em]" : undefined}
            >
              {word}
            </span>
          ))}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease }}
          className="headline mt-5 text-[2.1rem] leading-[1.1] tracking-tight sm:text-4xl"
          style={{ textShadow }}
        >
          <span className="block text-white/92">{REVEAL_COPY.line1}</span>
          <span className="mt-1 flex items-center gap-[0.3em]">
            <Logo className="h-[1.05em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]" />
            <span className="sr-only">Sunkool</span>
            <span className="text-white/92">{brandRest}</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="mt-7 text-[0.95rem] font-semibold leading-relaxed text-white/90"
          style={{ textShadow }}
        >
          {WINDOW_FILM_BRAND.lead}
        </motion.p>
      </div>
    </section>
  );
}
