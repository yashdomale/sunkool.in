"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  Camera,
  CircleCheck,
  ClipboardCheck,
  FileText,
  Package,
  QrCode,
  Send,
} from "lucide-react";
import {
  WARRANTY_PHASES,
  WARRANTY_REGISTRATION_STEPS,
} from "@/lib/warranty-content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { WarrantyRegistrationStep } from "@/lib/warranty-content";
import type { LucideIcon } from "lucide-react";
import { EASE_OUT as ease } from "@/lib/motion";

const STEP_ICONS: Record<WarrantyRegistrationStep["icon"], LucideIcon> = {
  qr: QrCode,
  badge: BadgeCheck,
  package: Package,
  form: FileText,
  camera: Camera,
  review: ClipboardCheck,
  send: Send,
  success: CircleCheck,
};

function RegistrationStepCard({
  step,
  index,
}: {
  step: WarrantyRegistrationStep;
  index: number;
}) {
  const Icon = STEP_ICONS[step.icon];

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: index * 0.03, ease }}
      className="relative"
    >
      <div
        className={cn(
          "glass h-full rounded-2xl p-4 sm:p-6",
          step.success && "ring-1 ring-kool/25"
        )}
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
              step.success
                ? "border-kool/35 bg-kool/10 text-kool"
                : "border-electric/25 bg-electric/10 text-electric"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:tracking-[0.22em]">
              Step {index + 1}
            </span>
            <h3
              className={cn(
                "mt-1 font-display text-base font-semibold sm:text-lg",
                step.success ? "text-kool" : "text-white"
              )}
            >
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white">{step.body}</p>
            {step.details && step.details.length > 0 && (
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {step.details.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-silver-soft"
                  >
                    <span
                      className={cn(
                        "mt-2 h-1 w-1 shrink-0 rounded-full",
                        step.success ? "bg-kool" : "bg-electric"
                      )}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function WarrantyRegistrationSteps() {
  return (
    <section id="register" className="scroll-mt-24 py-12 sm:scroll-mt-28 sm:py-20">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Registration"
          titleClassName="headline text-balance text-3xl sm:text-4xl lg:text-5xl text-gradient-silver"
          title={
            <>
              How to register{" "}
              <span className="text-gradient-electric">your warranty</span>
            </>
          }
          description="Follow these eight steps on the official SUNKOOL portal to activate coverage for your window film installation."
          align="center"
          className="mx-auto"
        />

        <div className="-mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-auto sm:mt-10 sm:max-w-3xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:gap-3">
          {WARRANTY_PHASES.map((phase, i) => (
            <Reveal key={phase.label} delay={i * 0.05}>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:px-4 sm:text-xs sm:tracking-[0.2em]">
                {i + 1}. {phase.label}
              </span>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-8 sm:mt-12 sm:space-y-10">
          {WARRANTY_PHASES.map((phase, phaseIndex) => (
            <div key={phase.label}>
              <Reveal delay={phaseIndex * 0.06}>
                <div className="mb-4 flex items-center gap-3 sm:mb-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/15 font-display text-xs font-bold text-electric">
                    {phaseIndex + 1}
                  </span>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-silver-soft sm:text-sm sm:tracking-[0.2em]">
                    {phase.label}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                </div>
              </Reveal>
              <ol className="space-y-3 sm:space-y-4">
                {phase.steps.map((stepIndex) => (
                  <RegistrationStepCard
                    key={WARRANTY_REGISTRATION_STEPS[stepIndex].title}
                    step={WARRANTY_REGISTRATION_STEPS[stepIndex]}
                    index={stepIndex}
                  />
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
