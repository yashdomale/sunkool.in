import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

export type FaqItem = { q: string; a: string };

/**
 * FAQ accordion section with FAQPage structured data. Native <details> so it
 * works without JS and stays crawlable. The heading is centred on every screen size.
 */
export function FaqSection({
  items,
  // The heading is just "FAQs"; no eyebrow by default so the word isn't shown twice.
  eyebrow,
  title = "FAQs",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="relative border-t border-white/10 py-16 sm:py-24 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container-lux">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleClassName="headline text-balance text-3xl sm:text-4xl lg:text-6xl text-gradient-silver"
          align="center"
        />

        <div className="mt-10 max-w-4xl divide-y divide-white/10 border-y border-white/10 sm:mt-14 lg:mx-auto">
          {items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left marker:content-none sm:gap-6 sm:py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-base font-semibold text-white sm:text-xl">
                  {item.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl font-light text-kool transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-silver-soft sm:pb-6 sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
