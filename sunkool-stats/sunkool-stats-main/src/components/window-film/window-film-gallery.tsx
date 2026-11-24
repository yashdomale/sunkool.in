"use client";

import { WINDOW_FILM_MEDIA } from "@/lib/window-film-media";
import { MediaSlot, MEDIA_SIZES_HERO_SIDE } from "@/components/media/media-slot";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GalleryGrid } from "@/components/product/gallery-grid";

export function WindowFilmGallery() {
  const { beforeAfter, gallery } = WINDOW_FILM_MEDIA;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Installation Gallery"
          title={
            <>
              Crafted installs.{" "}
              <span className="text-gradient-electric">Visible results.</span>
            </>
          }
          description="Professional SUNKOOL window film installs — windshields, side glass, and panoramic roofs."
        />

        <Reveal className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <MediaSlot
                src={beforeAfter.before}
                alt="Before window film install"
                aspect="16/9"
                accent="#f47521"
                label="Before"
                fileHint={beforeAfter.beforeHint}
                sizes={MEDIA_SIZES_HERO_SIDE}
                className="rounded-none border-0"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                Before
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <MediaSlot
                src={beforeAfter.after}
                alt="After window film install"
                aspect="16/9"
                accent="#58a7e8"
                label="After"
                fileHint={beforeAfter.afterHint}
                sizes={MEDIA_SIZES_HERO_SIDE}
                className="rounded-none border-0"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-electric">
                After
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-white">
            Before and after — heat and glare, then comfort
          </p>
        </Reveal>

        <GalleryGrid items={gallery} accent="#58a7e8" />
      </div>
    </section>
  );
}
