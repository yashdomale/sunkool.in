"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Check,
  Droplets,
  Expand,
  Eye,
  Grid3x3,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SIGNATURE_PPF_FEATURES,
  SIGNATURE_PPF_INSTALL_ADVANTAGES,
  SIGNATURE_PPF_SPEC_TABLE,
} from "@/lib/ppf-content";
import { Reveal } from "@/components/ui/reveal";
import { ppfEase, ppfFadeUp } from "./ppf-motion";

const INSTALL_ICONS: LucideIcon[] = [
  Expand,
  Grid3x3,
  Droplets,
  ThumbsUp,
  Sparkles,
  Eye,
];

export function PpfSignatureFeatures() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-6%" }}
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
    >
      {SIGNATURE_PPF_FEATURES.map((feature, i) => {
        const isWarranty = feature === "Limited Lifetime Warranty";
        return (
          <motion.div
            key={feature}
            custom={i}
            variants={ppfFadeUp}
            whileHover={{ y: -3, borderColor: "rgba(246,177,26,0.35)" }}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors sm:gap-3 sm:px-3.5 sm:py-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sun/15 text-sun sm:h-8 sm:w-8">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
            </span>
            {isWarranty ? (
              <Link
                href="/warranty"
                className="text-xs font-medium text-white underline decoration-white/30 underline-offset-2 transition-colors hover:text-sun sm:text-sm"
              >
                {feature}
              </Link>
            ) : (
              <span className="text-xs font-medium text-white sm:text-sm">
                {feature}
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function PpfSignatureInstallGrid() {
  return (
    <div>
      <Reveal>
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Installation <span className="text-gradient-sun">Advantages</span>
        </h3>
      </Reveal>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {SIGNATURE_PPF_INSTALL_ADVANTAGES.map((item, i) => {
          const Icon = INSTALL_ICONS[i] ?? Sparkles;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: i * 0.05, duration: 0.55, ease: ppfEase }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-sun/25 hover:bg-white/[0.03] sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sun transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-display text-sm font-semibold text-white sm:text-base">
                {item.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-white sm:text-sm">
                {item.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function PpfSignatureSpecTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.7, ease: ppfEase }}
      className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30"
    >
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
        <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
          Technical <span className="text-gradient-sun">Specifications</span>
        </h3>
      </div>

      <div className="divide-y divide-white/8">
        {SIGNATURE_PPF_SPEC_TABLE.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: sectionIndex * 0.08, duration: 0.5 }}
          >
            <p className="bg-sun/8 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sun sm:px-6 sm:text-[11px]">
              {section.category}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-[10px] uppercase tracking-[0.16em] text-white">
                    <th className="px-5 py-2.5 font-semibold sm:px-6">Property</th>
                    <th className="px-5 py-2.5 font-semibold sm:px-6">
                      Testing Method
                    </th>
                    <th className="px-5 py-2.5 font-semibold sm:px-6">
                      Testing Results
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, rowIndex) => (
                    <motion.tr
                      key={row.property}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: rowIndex * 0.03,
                        duration: 0.4,
                        ease: ppfEase,
                      }}
                      className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-3 font-medium text-white sm:px-6">
                        {row.property}
                      </td>
                      <td className="px-5 py-3 text-white sm:px-6">{row.method}</td>
                      <td className="px-5 py-3 text-silver sm:px-6">
                        {row.result}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
