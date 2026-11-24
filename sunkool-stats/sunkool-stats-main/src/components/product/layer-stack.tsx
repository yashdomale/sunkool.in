"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { MediaAspect } from "@/lib/public-media";
import { MediaSlot } from "@/components/media/media-slot";
import { SectionHeading } from "@/components/ui/section-heading";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Layer = { name: string; desc: string; color: string };

function StackLayer({
  layer,
  index,
  total,
  progress,
  reduced,
  spread,
  tilt,
  fadeFrom,
}: {
  layer: Layer;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
  spread: number;
  tilt: number;
  fadeFrom: number;
}) {
  const offset = (index - (total - 1) / 2) * spread;
  const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, offset]);
  const rotateX = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, tilt]);
  const opacity = useTransform(progress, [0, 0.2], reduced ? [1, 1] : [fadeFrom, 1]);

  return (
    <motion.div style={{ y, rotateX, opacity }} className="relative w-full">
      <div
        className="glass-strong flex items-center gap-3 rounded-xl border p-4 sm:gap-4 sm:p-5"
        style={{
          boxShadow: `0 16px 48px -16px ${layer.color}55`,
          borderColor: `${layer.color}44`,
        }}
      >
        <span
          className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10"
          style={{ background: `linear-gradient(135deg, ${layer.color}, transparent)` }}
        />
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-white sm:text-base">{layer.name}</p>
          <p className="text-xs text-white sm:text-sm">{layer.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * A product's film layers, which separate as the visitor scrolls, next to a layer diagram.
 * The column reserves room for the separated layers so they never run into the heading or diagram.
 */
export function LayerStack({
  layers,
  eyebrow,
  title,
  description,
  diagram,
  sectionClass,
  gridClass,
  spread = 88,
  tilt = -20,
  fadeFrom = 0.45,
}: {
  layers: readonly Layer[];
  eyebrow: string;
  title: ReactNode;
  description: string;
  diagram: { src: string; alt: string; aspect: MediaAspect; accent: string; label: string; fileHint: string; className: string };
  sectionClass: string;
  gridClass: string;
  /** Pixels between neighbouring layers once fully separated. */
  spread?: number;
  /** Degrees the layers tilt back when separated. */
  tilt?: number;
  /** Opacity the layers start from before the scroll reveal. */
  fadeFrom?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end end"] });

  return (
    <section ref={ref} className={sectionClass}>
      <div className="container-lux">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />

        <div className={gridClass}>
          <div
            className="relative mx-auto flex w-full max-w-md flex-col gap-3 [perspective:1400px]"
            style={{ paddingBlock: reduced ? 0 : ((layers.length - 1) / 2) * spread }}
          >
            {layers.map((layer, i) => (
              <StackLayer
                key={layer.name}
                layer={layer}
                index={i}
                total={layers.length}
                progress={scrollYProgress}
                reduced={reduced}
                spread={spread}
                tilt={tilt}
                fadeFrom={fadeFrom}
              />
            ))}
          </div>
          <MediaSlot
            src={diagram.src}
            alt={diagram.alt}
            aspect={diagram.aspect}
            accent={diagram.accent}
            label={diagram.label}
            fileHint={diagram.fileHint}
            className={diagram.className}
          />
        </div>
      </div>
    </section>
  );
}
