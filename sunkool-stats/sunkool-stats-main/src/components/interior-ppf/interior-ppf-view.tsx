import { InteriorPpfHero } from "./interior-ppf-hero";
import { InteriorPpfFeatures } from "./interior-ppf-features";
import { InteriorPpfProtection } from "./interior-ppf-protection";
import { InteriorPpfWhyChoose } from "./interior-ppf-why-choose";
import { InteriorPpfCta } from "./interior-ppf-cta";
import { FaqSection } from "@/components/ui/faq-section";
import { INTERIOR_PPF_FAQS } from "@/lib/interior-ppf-faqs";

export function InteriorPpfView() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <InteriorPpfHero />
      <InteriorPpfFeatures />
      <InteriorPpfProtection />
      <InteriorPpfWhyChoose />
      <FaqSection items={INTERIOR_PPF_FAQS} />
      <InteriorPpfCta />
    </div>
  );
}
