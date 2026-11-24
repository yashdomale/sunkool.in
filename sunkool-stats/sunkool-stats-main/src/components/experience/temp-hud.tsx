"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

function cabinColor(cabin: number) {
  if (cabin <= 28) return "text-kool";
  if (cabin >= 38) return "text-heat";
  return "text-sun";
}

function TempReading({
  value,
  label,
  colorClass,
  compact = false,
}: {
  value: number;
  label: string;
  colorClass: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-baseline gap-1.5">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className={cn(
              "font-display text-xl font-bold tabular-nums",
              colorClass
            )}
          >
            {value}
            <span className={cn("ml-0.5 text-sm font-semibold", colorClass)}>
              °C
            </span>
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <AnimatePresence mode="popLayout">
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className={cn(
            "font-display text-2xl font-bold tabular-nums drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] sm:text-5xl",
            colorClass
          )}
        >
          {value}
          <span
            className={cn(
              "ml-0.5 align-top text-lg font-semibold opacity-90 sm:text-2xl",
              colorClass
            )}
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
          >
            °C
          </span>
        </motion.p>
      </AnimatePresence>
      <p
        className="mt-2.5 text-xs font-medium uppercase tracking-[0.24em] text-white/90"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 0 1px rgba(0,0,0,1)" }}
      >
        {label}
      </p>
    </div>
  );
}

export function TempHud({
  outside,
  cabin,
}: {
  outside: number;
  cabin: number;
}) {
  return (
    <>
      {/* Mobile: compact glass dock below navbar */}
      <div className="pointer-events-none absolute inset-x-4 top-[5.25rem] z-20 lg:hidden">
        <div
          className="flex items-center justify-center gap-4 rounded-2xl border border-white/12 bg-black/50 px-4 py-2.5 backdrop-blur-md"
          style={{ transform: "translateZ(0)" }}
        >
          <TempReading
            value={outside}
            label="Exterior"
            colorClass="text-sun"
            compact
          />
          <div className="h-8 w-px shrink-0 bg-white/20" aria-hidden />
          <TempReading
            value={cabin}
            label="Cabin"
            colorClass={cabinColor(cabin)}
            compact
          />
        </div>
      </div>

      {/* Desktop: centered large readings */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center lg:flex">
        <div className="flex items-center gap-16">
          <TempReading
            value={outside}
            label="Exterior"
            colorClass="text-sun"
          />
          <div className="h-14 w-px shrink-0 bg-white/30" aria-hidden />
          <TempReading
            value={cabin}
            label="Cabin"
            colorClass={cabinColor(cabin)}
          />
        </div>
      </div>
    </>
  );
}
