"use client";

import { PpfHd07Section } from "./ppf-hd07-section";
import { PpfSignatureSection } from "./ppf-signature-section";
import { PpfSectionDivider } from "./ppf-series-shell";
import { SectionHeading } from "@/components/ui/section-heading";

export function PpfShowcases() {
  return (
    <div className="relative border-t border-white/5 bg-gradient-to-b from-black via-white/[0.015] to-black">
      <section className="pb-4 pt-14 sm:pt-16">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Product Lines"
            title={
              <>
                Two films.{" "}
                <span className="text-gradient-sun">One standard</span> of
                excellence.
              </>
            }
            description="From daily-driver HD07 to flagship Signature Ultimate — engineered aliphatic polyurethane protection for every finish."
            align="center"
            className="mx-auto"
          />
        </div>
      </section>

      <PpfHd07Section />
      <PpfSectionDivider />
      <PpfSignatureSection />
    </div>
  );
}
