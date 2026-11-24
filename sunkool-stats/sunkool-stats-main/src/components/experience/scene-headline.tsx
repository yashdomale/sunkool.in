"use client";

import { motion } from "motion/react";
import { EASE_OUT as ease } from "@/lib/motion";

export function SceneHeadline({ local }: { local: number }) {
  const enter = Math.min(1, Math.max(0, (local - 0.08) * 3));
  const exit = local > 0.88 ? Math.max(0, 1 - (local - 0.88) / 0.12) : 1;
  const opacity = enter * exit;

  return (
    <motion.div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-[4.5rem] z-[11] bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pt-10 pb-4 lg:hidden"
      style={{ opacity, y: (1 - enter) * 12 }}
      transition={{ duration: 0.5, ease }}
    >
      <p
        className="text-center font-display text-2xl font-semibold tracking-tight text-white"
        style={{
          textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 0 1px rgba(0,0,0,1)",
        }}
      >
        Here&apos;s the solution.
      </p>
    </motion.div>
  );
}
