"use client";

import { useState } from "react";

export default function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="reveal-stagger mt-8 divide-y divide-white/10 border-t border-white/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left sm:gap-6 sm:py-6"
            >
              <h3 className="text-gradient-silver font-display text-lg font-semibold sm:text-xl">
                {item.q}
              </h3>
              <span
                aria-hidden="true"
                className={`relative shrink-0 text-2xl font-light text-kool transition-transform duration-300 ease-[var(--ease-lux)] ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>
            <div
              className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[var(--ease-lux)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="min-h-0">
                <p className="pb-5 text-base leading-relaxed text-silver-soft sm:pb-6 sm:text-lg">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
