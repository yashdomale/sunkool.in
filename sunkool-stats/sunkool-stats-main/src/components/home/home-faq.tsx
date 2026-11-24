import { FaqSection } from "@/components/ui/faq-section";
import { HOME_FAQS } from "@/lib/home-faqs";

export function HomeFaq() {
  return <FaqSection items={HOME_FAQS} />;
}
