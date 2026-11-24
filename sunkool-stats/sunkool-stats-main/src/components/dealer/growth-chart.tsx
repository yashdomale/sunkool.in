"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

export function GrowthChart() {
  const bars = [38, 52, 60, 74, 88, 100];
  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8">
      <p className="eyebrow">Average dealer growth</p>
      <p className="mt-2 font-display text-3xl font-bold text-white">
        +180% <span className="text-base font-normal text-white">in 12 months</span>
      </p>

      <div className="mt-8 flex h-44 items-end gap-3">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0.4 }}
            whileInView={{ height: `${h}%`, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              delay: i * 0.1,
              ease: EASE_OUT,
            }}
            className="flex-1 rounded-t-lg"
            style={{
              background:
                i === bars.length - 1
                  ? "linear-gradient(180deg,#58a7e8,#007ea8)"
                  : "linear-gradient(180deg,#2a2a2a,#141414)",
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.15em] text-white/90">
        {["M1", "M3", "M5", "M7", "M9", "M12"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
