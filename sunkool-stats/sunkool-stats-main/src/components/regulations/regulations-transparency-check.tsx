"use client";

import { motion } from "motion/react";
import { Car, Check, PanelLeft, PanelRight, X } from "lucide-react";
import {
  TRANSPARENCY_CHECK,
  type ComplianceStatus,
} from "@/lib/regulations-content";
import { REGULATIONS_MEDIA } from "@/lib/regulations-media";
import { MediaSlot } from "@/components/media/media-slot";
import { Reveal } from "@/components/ui/reveal";
import { regulationEase } from "./regulation-motion";

const COLUMN_ICONS = [Car, PanelLeft, PanelRight] as const;

function StatusBadge({
  status,
  delay,
}: {
  status: ComplianceStatus;
  delay: number;
}) {
  const pass = status === "pass";

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 22,
        delay,
      }}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
        pass
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_24px_-4px_rgba(52,211,153,0.5)]"
          : "border-red-400/40 bg-red-500/15 text-red-300"
      }`}
    >
      {pass ? (
        <Check className="h-5 w-5" strokeWidth={2.5} />
      ) : (
        <X className="h-5 w-5" strokeWidth={2.5} />
      )}
    </motion.span>
  );
}

export function RegulationsTransparencyCheck() {
  const { title, subtitle, columns, rows } = TRANSPARENCY_CHECK;
  const transparencyMedia = REGULATIONS_MEDIA.transparencyCheck;

  return (
    <section className="py-12 sm:py-14">
      <div className="container-lux">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-white sm:text-base">{subtitle}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30 sm:rounded-3xl">
            <MediaSlot
              src={transparencyMedia.src}
              alt={transparencyMedia.alt}
              aspect="16/9"
              accent="#58a7e8"
              label="Transparency Check"
              fileHint={transparencyMedia.fileHint}
              fit="contain"
              fillParent
              className="min-h-[220px] rounded-none border-0 bg-black/50 sm:min-h-[320px]"
            />
          </div>
        </Reveal>

        {/* Desktop table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.65, ease: regulationEase }}
          className="relative mt-8 hidden overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 md:block"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  Product
                </th>
                {columns.map((col, i) => {
                  const Icon = COLUMN_ICONS[i] ?? Car;
                  return (
                    <th
                      key={col.id}
                      className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
                    >
                      <span className="inline-flex flex-col items-center gap-2">
                        <Icon className="h-4 w-4 text-electric" />
                        {col.label}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-5 font-display text-base font-semibold text-white">
                    {row.label}
                  </td>
                  {row.status.map((status, i) => (
                    <td key={columns[i].id} className="px-6 py-5 text-center">
                      <StatusBadge status={status} delay={0.1 + i * 0.1} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile cards */}
        <div className="mt-8 space-y-3 md:hidden">
          {columns.map((col, colIndex) => {
            const Icon = COLUMN_ICONS[colIndex] ?? Car;
            const status = rows[0].status[colIndex];
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: colIndex * 0.08, duration: 0.55, ease: regulationEase }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-electric">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white">
                      {rows[0].label}
                    </p>
                    <p className="font-display text-sm font-semibold text-white">
                      {col.label}
                    </p>
                  </div>
                </div>
                <StatusBadge status={status} delay={0.15 + colIndex * 0.1} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
