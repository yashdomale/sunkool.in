"use client";

import dynamic from "next/dynamic";
import { FloatingParticles } from "@/components/graphics/particles";
import { PpfBenefits } from "./ppf-benefits";
import { PpfHero } from "./ppf-hero";
import { PpfLayerStack } from "./ppf-layer-stack";
import { PpfNav } from "./ppf-nav";

const PpfFilmBlock = dynamic(
  () => import("./ppf-film-block").then((m) => ({ default: m.PpfFilmBlock })),
  { ssr: true }
);
const PpfShowcases = dynamic(
  () => import("./ppf-showcase").then((m) => ({ default: m.PpfShowcases })),
  { ssr: true }
);
const PpfGallery = dynamic(
  () => import("./ppf-gallery").then((m) => ({ default: m.PpfGallery })),
  { ssr: true }
);
const PpfFaq = dynamic(
  () => import("./ppf-faq").then((m) => ({ default: m.PpfFaq })),
  { ssr: true }
);
const PpfCta = dynamic(
  () => import("./ppf-cta").then((m) => ({ default: m.PpfCta })),
  { ssr: true }
);
const SelfHealing = dynamic(
  () =>
    import("@/components/product/self-healing").then((m) => ({
      default: m.SelfHealing,
    })),
  { ssr: true }
);

export function PpfView() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingParticles />
      <PpfHero />
      <PpfNav />
      <PpfLayerStack />
      <PpfBenefits />
      <SelfHealing />
      <PpfFilmBlock />
      <PpfShowcases />
      <PpfGallery />
      <PpfFaq />
      <PpfCta />
    </div>
  );
}
