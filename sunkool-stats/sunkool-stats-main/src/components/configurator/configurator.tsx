"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { ALL_PRODUCTS, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

type Answers = {
  vehicle: string;
  climate: string;
  privacy: string;
  budget: string;
};

const STEPS = [
  {
    key: "vehicle" as const,
    q: "What do you drive?",
    options: ["Sedan", "SUV", "Luxury / EV", "Performance"],
  },
  {
    key: "climate" as const,
    q: "Your climate?",
    options: ["Extreme Heat", "Hot & Humid", "Moderate", "Mixed"],
  },
  {
    key: "privacy" as const,
    q: "Desired privacy?",
    options: ["Crystal Clear", "Subtle", "Private", "Blackout"],
  },
  {
    key: "budget" as const,
    q: "Your budget?",
    options: ["Essential", "Premium", "Flagship"],
  },
];

function recommend(a: Answers): Product & { category: string; series: string } {
  // score every product; pick best fit
  const wantVlt =
    a.privacy === "Crystal Clear"
      ? 72
      : a.privacy === "Subtle"
      ? 55
      : a.privacy === "Private"
      ? 35
      : 18;

  const flagship = a.budget === "Flagship";
  const premium = a.budget === "Premium";
  const hotClimate = a.climate === "Extreme Heat" || a.climate === "Hot & Humid";

  let best = ALL_PRODUCTS[0];
  let bestScore = -Infinity;

  for (const p of ALL_PRODUCTS) {
    if (p.category === "PPF") continue; // film recommendation
    let score = 0;
    score -= Math.abs(p.vlt - wantVlt) * 0.8; // privacy match
    if (hotClimate) score += p.tser * 0.5 + p.ir * 0.4;
    else score += p.tser * 0.25 + p.ir * 0.2;

    const isSignature = p.series.includes("Signature");
    const isUltraEdge = p.category === "Ultra Edge";
    if (flagship && (isSignature || isUltraEdge)) score += 30;
    if (premium && isUltraEdge) score += 12;
    if (!flagship && !premium && isSignature) score -= 18;
    if (a.vehicle === "Luxury / EV" && (isSignature || isUltraEdge)) score += 14;
    if (a.vehicle === "Performance" && isUltraEdge) score += 10;

    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

export function Configurator() {
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [step, setStep] = useState(0);

  const complete = STEPS.every((s) => answers[s.key]);
  const result = useMemo(
    () => (complete ? recommend(answers as Answers) : null),
    [complete, answers]
  );

  const choose = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* questions */}
      <div className="glass rounded-3xl p-8">
        <div className="mb-8 flex gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-electric" : "bg-white/10"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="eyebrow">
              Step {step + 1} / {STEPS.length}
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">
              {STEPS[step].q}
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STEPS[step].options.map((opt) => {
                const active = answers[STEPS[step].key] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(STEPS[step].key, opt)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      active
                        ? "border-electric bg-electric/10 text-white"
                        : "border-white/10 text-silver-soft hover:border-white/25"
                    )}
                  >
                    {opt}
                    {active && <Check className="h-4 w-4 text-electric" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* recommendation */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.slug + result.series}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="relative h-full overflow-hidden rounded-3xl border border-white/10 p-8"
              style={{
                background: `radial-gradient(120% 120% at 50% 0%, ${result.accent}26, #0a0a0a 70%)`,
              }}
            >
              <div className="flex items-center gap-2 text-electric">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.25em]">
                  Your Match
                </span>
              </div>
              <h3 className="mt-4 font-display text-4xl font-bold text-white">
                {result.name}
              </h3>
              <p className="mt-1 text-sm text-white">
                {result.category} · {result.series}
              </p>
              <p className="mt-4 text-silver-soft">{result.tagline}</p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  ["VLT", `${result.vlt}%`],
                  ["Solar Rejection", `${result.tser}%`],
                  ["IR Rejection", `${result.ir}%`],
                  ["UV Block", `${result.uv}%`],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-xl bg-white/5 p-4">
                    <p className="font-display text-2xl font-bold text-white">
                      {val}
                    </p>
                    <p className="text-xs text-white">{label}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={reset}
                className="mt-8 text-sm text-white underline-offset-4 hover:text-white hover:underline"
              >
                Start over
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 p-8 text-center"
            >
              <Sparkles className="h-8 w-8 text-white/80" />
              <p className="mt-4 max-w-xs text-sm text-white">
                Answer a few questions and we&apos;ll recommend the perfect
                SUNKOOL film for your vehicle.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
