import type { Faq } from "@/lib/blog/types";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-16 border-t border-white/10 pt-12">
      <h2 className="font-display text-2xl font-semibold text-white">Frequently asked questions</h2>
      <div className="mt-6 flex flex-col divide-y divide-white/10">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-white marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="shrink-0 text-white transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
