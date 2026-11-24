"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { Award, ImageIcon } from "lucide-react";
import { REGULATION_CERTIFICATES } from "@/lib/regulations-content";
import { REGULATIONS_MEDIA } from "@/lib/regulations-media";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { regulationEase } from "./regulation-motion";

const cert = REGULATION_CERTIFICATES[0];
const media = REGULATIONS_MEDIA.cmvr;

export function RegulationsCertificates() {
  const reduced = useReducedMotion();
  const [imgError, setImgError] = useState(false);
  const resolvedSrc = resolvePublicAssetSrc(media.src);

  return (
    <section className="relative py-8 sm:py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(246,177,26,0.1), transparent 60%)",
        }}
      />

      <div className="container-lux relative">
        <Reveal>
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sun/30 bg-sun/10 text-sun">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Official Documentation
              </p>
              <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
                {cert.title}
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white sm:text-sm">
                {cert.description}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <motion.div
            whileHover={reduced ? undefined : { y: -2 }}
            transition={{ duration: 0.35, ease: regulationEase }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:rounded-3xl"
          >
            <div className="pointer-events-none absolute left-4 top-4 z-10 h-8 w-8 border-l border-t border-sun/40 sm:h-10 sm:w-10" />
            <div className="pointer-events-none absolute right-4 top-4 z-10 h-8 w-8 border-r border-t border-sun/40 sm:h-10 sm:w-10" />
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 h-8 w-8 border-b border-l border-sun/40 sm:h-10 sm:w-10" />
            <div className="pointer-events-none absolute bottom-4 right-4 z-10 h-8 w-8 border-b border-r border-sun/40 sm:h-10 sm:w-10" />

            {!imgError ? (
              <Image
                src={resolvedSrc}
                alt={media.alt}
                width={1600}
                height={1200}
                className="h-auto w-full max-h-[min(88vh,1200px)] object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 80rem"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex min-h-[40vh] flex-col items-center justify-center p-8 text-center">
                <ImageIcon className="mb-3 h-10 w-10 text-sun/40" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {cert.title}
                </p>
                <p className="mt-2 text-xs text-white">
                  Replace:{" "}
                  <span className="text-sun/80">{media.fileHint}</span>
                </p>
              </div>
            )}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
