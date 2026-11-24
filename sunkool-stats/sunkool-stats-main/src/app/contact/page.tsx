import type { Metadata } from "next";
import { FloatingParticles } from "@/components/graphics/particles";
import { ContactBento } from "@/components/contact/contact-bento";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { Reveal } from "@/components/ui/reveal";
import { LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Contact SUNKOOL Nagpur — PPF & Window Film",
  },
  description:
    "Get in touch with SUNKOOL on WhatsApp for paint protection film, car heat control glazing, and window film solutions across India and the US.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact SUNKOOL Nagpur — PPF & Window Film",
    description:
      "Get in touch with SUNKOOL on WhatsApp for paint protection film, heat control glazing, and window film solutions.",
    images: ["/opengraph-image"],
  },
};

const TRUST = [
  { value: "2hr", label: "Avg. WhatsApp response" },
  { value: "2005", label: "Serving India since" },
  { value: "IN + US", label: "Global presence" },
];

export default function ContactPage() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-28 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <FloatingParticles />
      <div className="pointer-events-none absolute left-0 top-0 h-[50vh] w-full bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(88,167,232,0.2),transparent)]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[40vh] w-[50vw] bg-[radial-gradient(circle,rgba(246,177,26,0.12),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.1] mask-fade-y" />

      <div className="container-lux relative space-y-14 lg:space-y-20">
        <ContactHero />

        <Reveal>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {TRUST.map((item, i) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-center backdrop-blur-sm sm:px-6"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="font-display text-xl font-bold text-gradient-electric sm:text-2xl">
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white sm:text-xs">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow mb-3">Reach us anywhere</p>
            <h2 className="headline max-w-2xl text-3xl sm:text-4xl">
              <span className="text-gradient-silver">Choose your</span>{" "}
              <span className="text-gradient-sun">channel</span>
            </h2>
          </Reveal>
          <div className="mt-8">
            <ContactBento />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:gap-14 lg:items-start">
          <Reveal className="lg:sticky lg:top-32">
            <p className="eyebrow mb-3">Enquire</p>
            <h2 className="headline text-3xl sm:text-4xl">
              <span className="text-gradient-kool">Tell us</span> about your
              vehicle
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white">
              Window film, heat rejection, or full-body PPF — share your car
              model and what you&apos;re looking for. We&apos;ll connect you
              with the right specialist via WhatsApp.
            </p>
            <ul className="mt-8 space-y-4 border-t border-white/8 pt-8">
              {[
                "Film recommendation for your climate",
                "PPF coverage & package options",
                "Dealer & fleet partnership enquiries",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-silver-soft"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
