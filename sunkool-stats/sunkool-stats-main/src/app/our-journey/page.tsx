import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { JourneyAbout } from "@/components/journey/journey-about";

export const metadata: Metadata = {
  title: "Our Journey",
  description:
    "About Sunkool Solution — India's trusted window film and paint protection partner since 2005.",
  alternates: { canonical: "/our-journey" },
  openGraph: {
    title: "Our Journey — SUNKOOL",
    description:
      "About Sunkool Solution — India's trusted window film and paint protection partner since 2005.",
    images: ["/opengraph-image"],
  },
};

export default function JourneyPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Sunkool"
        title={
          <>
            A name built on{" "}
            <span className="text-gradient-electric">trust since 2005.</span>
          </>
        }
        description="Sunkool Solution is a leading supplier of window film and paint protection in India — delivering quality, comfort, and protection backed by service you can rely on."
        accent="rgba(246,177,26,0.18)"
      />
      <section className="relative overflow-hidden pb-28 sm:pb-36">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18] mask-fade-y" />
        <div className="container-lux relative">
          <JourneyAbout />
        </div>
      </section>
    </>
  );
}
