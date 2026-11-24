"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SOLAR_PARAMETERS } from "@/lib/ultra-edge-content";
import { ULTRA_EDGE_MEDIA } from "@/lib/ultra-edge-media";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaSlot } from "@/components/media/media-slot";

type BandKey = "uvr" | "vlt" | "irr" | "tser";

const BANDS: {
  key: BandKey;
  label: string;
  left: string;
  width: string;
  color: string;
}[] = [
  { key: "uvr", label: "UV", left: "4%", width: "11%", color: "#8b5cf6" },
  { key: "vlt", label: "Visible", left: "16%", width: "12%", color: "#f47521" },
  { key: "irr", label: "IR", left: "30%", width: "58%", color: "#ef4444" },
];

const PARAM_TO_BAND: Record<string, BandKey> = {
  vlt: "vlt",
  uvr: "uvr",
  irr: "irr",
  tser: "tser",
};

export function UltraEdgeSpectrum() {
  const [active, setActive] = useState<BandKey>("vlt");
  const activeParam =
    SOLAR_PARAMETERS.find((p) => PARAM_TO_BAND[p.key] === active) ??
    SOLAR_PARAMETERS[0];

  return (
    <section className="relative border-y border-white/5 bg-white/[0.02] py-20 sm:py-24">
      <div className="container-lux">
        {/* Heading sits in the left column so the detail card (right) starts level with it on desktop. */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Solar Parameters Overview"
              title={
                <>
                  The science behind{" "}
                  <span className="text-gradient-electric">performance</span>
                </>
              }
              description="Every Ultra Edge film is measured against the metrics that define real-world comfort — from visible light to infrared rejection."
            />

            <div className="mb-3 mt-12 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white">
              <span>100 nm</span>
              <span>2500 nm</span>
            </div>
            <div className="relative h-14 overflow-hidden rounded-2xl border border-white/10 bg-black/50">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-sun/30 to-red-600/40" />
              {BANDS.map((band) => (
                <motion.button
                  key={band.key}
                  type="button"
                  onClick={() => setActive(band.key)}
                  className="absolute top-0 h-full rounded-lg border border-white/20"
                  style={{
                    left: band.left,
                    width: band.width,
                    background: `${band.color}33`,
                  }}
                  animate={{
                    opacity: active === band.key || active === "tser" ? 1 : 0.45,
                    scale: active === band.key ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.35 }}
                  aria-label={band.label}
                />
              ))}
              {active === "tser" && (
                <motion.div
                  layoutId="spectrum-full"
                  className="absolute inset-0 rounded-2xl ring-2 ring-electric/50"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
            </div>
            <div className="mt-2 flex gap-4 text-[10px] uppercase tracking-[0.16em] text-white">
              {BANDS.map((b) => (
                <span key={b.key} style={{ color: b.color }}>
                  {b.label}
                </span>
              ))}
              <span className="text-electric">Full spectrum (TSER)</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SOLAR_PARAMETERS.map((param) => {
                const band = PARAM_TO_BAND[param.key];
                const isOn =
                  active === band || (param.key === "tser" && active === "tser");
                return (
                  <button
                    key={param.key}
                    type="button"
                    onClick={() =>
                      setActive(param.key === "tser" ? "tser" : band)
                    }
                    className={`rounded-xl border px-3 py-3 text-left transition-all ${
                      isOn
                        ? "border-electric/50 bg-electric/10"
                        : "border-white/8 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                      {param.key.toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs font-medium text-white line-clamp-2">
                      {param.title.split("(")[0].trim()}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeParam.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-8"
          >
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {activeParam.title}
            </h3>
            <p className="mt-3 text-sm text-white">{activeParam.summary}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-sun/90">
              {activeParam.range}
            </p>
            <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-relaxed text-silver-soft">
              {activeParam.importance}
            </p>
            <div className="mt-6">
              <MediaSlot
                src={ULTRA_EDGE_MEDIA.spectrumDiagram.src}
                alt={ULTRA_EDGE_MEDIA.spectrumDiagram.alt}
                aspect="16/9"
                accent="#58a7e8"
                label="Spectrum diagram"
                fileHint={ULTRA_EDGE_MEDIA.spectrumDiagram.fileHint}
                className="rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
