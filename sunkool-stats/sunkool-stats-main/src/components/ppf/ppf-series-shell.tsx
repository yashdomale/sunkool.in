"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

type PpfSeriesShellProps = {
  id: string;
  accent: string;
  glowSide?: "left" | "right";
  children: ReactNode;
  className?: string;
};

export function PpfSeriesShell({
  id,
  accent,
  glowSide = "left",
  children,
  className,
}: PpfSeriesShellProps) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden py-12 sm:py-16", className)}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            glowSide === "left"
              ? `radial-gradient(50% 40% at 12% 8%, ${accent}20, transparent 62%)`
              : `radial-gradient(50% 40% at 88% 8%, ${accent}20, transparent 62%)`,
        }}
      />
      <div className="container-lux relative">{children}</div>
    </section>
  );
}

export function PpfSeriesMedia({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, -20]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduced ? [1, 1, 1] : [0.98, 1, 0.98]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
      className={cn("lg:sticky lg:top-28 lg:self-start", className)}
    >
      {children}
    </motion.div>
  );
}

export function PpfSectionDivider() {
  return (
    <div className="container-lux py-2" aria-hidden>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE_OUT }}
        className="h-px origin-center bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
}

export function PpfCallout({
  title,
  body,
  variant = "silver",
}: {
  title: string;
  body: string;
  variant?: "silver" | "sun";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-[1.5rem] border border-white/10 p-5 sm:p-7",
        variant === "sun"
          ? "bg-gradient-to-br from-sun/8 via-black/30 to-black/50"
          : "bg-gradient-to-br from-white/[0.06] via-black/30 to-black/50"
      )}
    >
      <h3
        className={cn(
          "font-display text-lg font-bold sm:text-xl",
          variant === "sun" ? "text-gradient-sun" : "text-gradient-silver"
        )}
      >
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white sm:text-base">{body}</p>
    </motion.div>
  );
}
