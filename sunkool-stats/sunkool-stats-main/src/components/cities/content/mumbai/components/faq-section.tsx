import FaqAccordion from "@/components/cities/content/bangalore/components/faq-accordion";
import { SectionHeading } from "@/components/cities/content/mumbai/components/landing-blocks";
import { faqs } from "@/components/cities/content/mumbai/lib/content";

export default function FaqSection() {
  return (
    <>
      {/* 10. FAQ */}
      <section className="relative w-full border-t border-white/10 bg-black">
        <div className="container-lux py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[720px] text-center">
            <SectionHeading>FAQ&apos;s</SectionHeading>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>
    </>
  );
}
