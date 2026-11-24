"use client";

import { useState } from "react";
import Reveal from "@/components/cities/shared/reveal";
import { faqs } from "../lib/faqs";

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
            Frequently Asked Questions
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
        <Reveal className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="headline text-3xl text-sun sm:text-4xl">A Cooler, Clearer Drive Around Ernakulam</h2>
          <p className="mt-6 text-base leading-relaxed text-silver-soft">Ernakulam&apos;s heat and humidity aren&apos;t going anywhere, but how much of it actually reaches you inside the car is something you can control. The right film cuts down solar heat, glare and UV exposure without needing maximum darkness to do it. Base the decision on heat rejection, UV protection, visibility, VLT and installation quality.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="/contact" className="inline-flex rounded-full bg-kool px-6 py-3 font-semibold text-black hover:bg-glow">Find the Right SUNKOOL Film for Your Car &rarr;</a>
            <a href="/contact" className="inline-flex items-center px-4 py-3 font-semibold text-kool hover:text-glow">Contact SUNKOOL &rarr;</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
