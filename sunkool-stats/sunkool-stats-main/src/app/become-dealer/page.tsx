import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { GrowthChart } from "@/components/dealer/growth-chart";
import { DealerForm } from "@/components/dealer/dealer-form";
import { DealerBenefits } from "@/components/dealer/benefits";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Become a Dealer",
  description:
    "Join the SUNKOOL network — exclusive territory, marketing support, training and premium product access.",
  alternates: { canonical: "/become-dealer" },
  openGraph: {
    title: "Become a SUNKOOL Dealer",
    description:
      "Join the SUNKOOL network — exclusive territory, marketing support, training and premium product access.",
    images: ["/opengraph-image"],
  },
};

export default function BecomeDealerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partnership"
        title={
          <>
            Join the{" "}
            <span className="text-gradient-electric">SUNKOOL network.</span>
          </>
        }
        description="Partner with a brand owners actively seek out. Build a premium, high-margin business backed by world-class films and full support."
      />

      <section className="pb-8">
        <div className="container-lux">
          <Reveal>
            <div className="flex flex-wrap gap-4">
              <MagneticButton href="#apply">Apply Now</MagneticButton>
              <MagneticButton href="/contact" variant="outline">
                Talk to Partnerships
              </MagneticButton>
              <MagneticButton
                href="https://w.sunkool.in/dealer.aspx"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                Check Authorised Details
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-lux">
          <DealerBenefits />
        </div>
      </section>

      <section className="py-16">
        <div className="container-lux grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <GrowthChart />
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h2 className="headline text-3xl sm:text-4xl text-gradient-silver">
                Growth, engineered in.
              </h2>
              <p className="mt-5 text-white">
                Our partners don&apos;t just sell film — they sell a category
                leader. With protected territory, qualified leads and premium
                positioning, SUNKOOL dealers consistently outgrow the market.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-silver-soft">
                {[
                  "Higher average ticket value",
                  "Repeat & referral driven demand",
                  "Lifetime-warranty trust advantage",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 py-16">
        <div className="container-lux max-w-3xl">
          <DealerForm />
        </div>
      </section>
    </>
  );
}
