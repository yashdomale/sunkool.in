"use client";

import { ULTRA_EDGE_MEDIA } from "@/lib/ultra-edge-media";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { BeforeAfterSlider } from "@/components/product/before-after-slider";
import { GalleryGrid } from "@/components/product/gallery-grid";

export function UltraEdgeGallery() {
  const { beforeAfter, gallery } = ULTRA_EDGE_MEDIA;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Installation Gallery"
          title={
            <>
              See the{" "}
              <span className="text-gradient-electric">difference</span>
            </>
          }
          description="Professional Ultra Edge installs across windshields, side glass, and panoramic roofs."
        />

        <Reveal className="mt-12">
          <BeforeAfterSlider
            before={{ src: beforeAfter.before, alt: "Before Ultra Edge install", fileHint: beforeAfter.beforeHint }}
            after={{ src: beforeAfter.after, alt: "After Ultra Edge install", fileHint: beforeAfter.afterHint }}
            ariaLabel="Compare before and after Ultra Edge installation"
            afterAccent="#58a7e8"
            afterLabelClass="text-electric"
          />
          <p className="mt-3 text-center text-xs text-white">Drag to compare before and after</p>
        </Reveal>

        <GalleryGrid items={gallery} accent="#58a7e8" />
      </div>
    </section>
  );
}
