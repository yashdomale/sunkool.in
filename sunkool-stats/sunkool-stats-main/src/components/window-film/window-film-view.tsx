"use client";

import { FloatingParticles } from "@/components/graphics/particles";
import { WindowFilmBenefits } from "./window-film-benefits";
import { WindowFilmCta } from "./window-film-cta";
import { WindowFilmFilmBlock } from "./window-film-film-block";
import { WindowFilmGallery } from "./window-film-gallery";
import { WindowFilmHero } from "./window-film-hero";
import { WindowFilmNanoStack } from "./window-film-nano-stack";
import { WindowFilmFoundationSection } from "./window-film-foundation-section";
import { WindowFilmSignatureSection } from "./window-film-signature-section";
import { FaqSection } from "@/components/ui/faq-section";
import { WINDOW_FILM_FAQS } from "@/lib/window-film-faqs";

export function WindowFilmView() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingParticles />
      <WindowFilmHero />
      <WindowFilmNanoStack />
      <WindowFilmBenefits />
      <WindowFilmFilmBlock />
      <WindowFilmFoundationSection />
      <WindowFilmSignatureSection />
      <WindowFilmGallery />
      <FaqSection items={WINDOW_FILM_FAQS} />
      <WindowFilmCta />
    </div>
  );
}
