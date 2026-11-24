"use client";

import { FloatingParticles } from "@/components/graphics/particles";
import { UltraEdgeBenefits } from "./ultra-edge-benefits";
import { UltraEdgeCta } from "./ultra-edge-cta";
import { UltraEdgeFilmBlock } from "./ultra-edge-film-block";
import { UltraEdgeFilmStack } from "./ultra-edge-film-stack";
import { UltraEdgeGallery } from "./ultra-edge-gallery";
import { UltraEdgeHero } from "./ultra-edge-hero";
import { UltraEdgeNav } from "./ultra-edge-nav";
import { UltraEdgeShowcases } from "./ultra-edge-showcase";
import { UltraEdgeSpectrum } from "./ultra-edge-spectrum";

export function UltraEdgeView() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingParticles />
      <UltraEdgeHero />
      <UltraEdgeNav />
      <UltraEdgeSpectrum />
      <UltraEdgeFilmStack />
      <UltraEdgeBenefits />
      <UltraEdgeFilmBlock />
      <UltraEdgeShowcases />
      <UltraEdgeGallery />
      <UltraEdgeCta />
    </div>
  );
}
