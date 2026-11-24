"use client";

import { PPF_MEDIA } from "@/lib/ppf-media";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { BeforeAfterSlider } from "@/components/product/before-after-slider";
import { GalleryGrid } from "@/components/product/gallery-grid";

export function PpfGallery() {
  const { beforeAfter, gallery } = PPF_MEDIA;

  return (
    <section className="relative py-14 sm:py-20">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Installation Gallery"
          title={
            <>
              Crafted installs.{" "}
              <span className="text-gradient-silver">Invisible protection.</span>
            </>
          }
          description="Professional SUNKOOL PPF installs — hoods, bumpers, mirrors, and full-body coverage."
        />

        <Reveal className="mt-12">
          <BeforeAfterSlider
            before={{ src: beforeAfter.before, alt: "Before PPF install", fileHint: beforeAfter.beforeHint }}
            after={{ src: beforeAfter.after, alt: "After PPF install", fileHint: beforeAfter.afterHint }}
            ariaLabel="Compare before and after PPF installation"
            afterAccent="#c0c0c0"
            afterLabelClass="text-silver"
          />
          <p className="mt-3 text-center text-xs text-white">Drag to compare before and after</p>
        </Reveal>

        <GalleryGrid items={gallery} accent="#c0c0c0" />
      </div>
    </section>
  );
}
