"use client";

import { AlertTriangle } from "lucide-react";
import { REGULATIONS_DISCLAIMER, REGULATIONS_PAGE } from "@/lib/regulations-content";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { RegulationsCertificates } from "./regulations-certificates";
import { RegulationsSideWindows } from "./regulations-side-windows";
import { RegulationsTransparencyCheck } from "./regulations-transparency-check";

export function RegulationsView() {
  return (
    <>
      <PageHeader
        eyebrow={REGULATIONS_PAGE.eyebrow}
        title={
          <>
            {REGULATIONS_PAGE.titleLead}{" "}
            <span className="text-gradient-electric">
              {REGULATIONS_PAGE.titleAccent}
            </span>
          </>
        }
        description={REGULATIONS_PAGE.description}
        accent="rgba(246,177,26,0.18)"
      />

      <div className="relative border-t border-white/5 bg-gradient-to-b from-black via-white/[0.015] to-black">
        <RegulationsCertificates />
        <RegulationsSideWindows />
        <RegulationsTransparencyCheck />

        <section className="pb-16 pt-4 sm:pb-20">
          <div className="container-lux max-w-3xl">
            <Reveal delay={0.1}>
              <div className="flex gap-4 rounded-2xl border border-sun/25 bg-sun/5 p-6">
                <AlertTriangle className="h-5 w-5 shrink-0 text-sun" />
                <p className="text-sm leading-relaxed text-silver-soft">
                  {REGULATIONS_DISCLAIMER}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
