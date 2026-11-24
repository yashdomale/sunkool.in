import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Configurator } from "@/components/configurator/configurator";
import { ComparisonTable } from "@/components/configurator/comparison-table";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Compare & Configure",
  description:
    "Find your perfect SUNKOOL film with the interactive configurator, then compare every grade side by side.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare & Configure — SUNKOOL Films",
    description:
      "Find your perfect SUNKOOL film with the interactive configurator, then compare every grade side by side.",
    images: ["/opengraph-image"],
  },
};

export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow="Find Your Film"
        title={
          <>
            Configure. <span className="text-gradient-electric">Compare.</span>{" "}
            Decide.
          </>
        }
        description="Answer four quick questions and our engine recommends the ideal SUNKOOL film — then compare the full lineup spec by spec."
      />

      <section className="pb-16">
        <div className="container-lux">
          <Configurator />
        </div>
      </section>

      <section className="py-20">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Full Lineup"
            title="Compare every grade"
            description="Visible Light Transmission (VLT), total solar rejection, infrared rejection and UV block across the entire SUNKOOL range."
          />
          <div className="mt-10">
            <ComparisonTable />
          </div>
        </div>
      </section>
    </>
  );
}
