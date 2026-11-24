"use client";

import { useState } from "react";
import Reveal from "@/components/cities/shared/reveal";
import { faqs } from "@/components/cities/content/vadodara/lib/faqs";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full border-t border-white/10 bg-black">
      <div className="container-lux py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal
            as="h2"
            className="headline text-gradient-silver text-balance mt-4 text-[clamp(42px,4vw,64px)]"
          >
            FAQ&apos;s
          </Reveal>
        </div>
        <Reveal className="mt-8 divide-y divide-white/10 border-t border-white/10" stagger>
          {faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left sm:gap-6 sm:py-6"
                >
                  <h3 className="text-gradient-silver font-display text-lg font-semibold sm:text-xl">{item.q}</h3>
                  <span
                    aria-hidden="true"
                    className={`relative shrink-0 text-2xl font-light text-kool transition-transform duration-300 ease-[var(--ease-lux)] ${
                      open ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[var(--ease-lux)]"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <p className="pb-5 text-[15px] leading-relaxed text-silver-soft sm:pb-6 sm:text-lg">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
