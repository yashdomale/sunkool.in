import { PPF_FAQS } from "@/lib/ppf-faqs";
import { FaqSection } from "@/components/ui/faq-section";

export function PpfFaq() {
  return <FaqSection items={PPF_FAQS} />;
}
