"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Droplets, Sparkles, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function SelfHealing() {
  const [scratched, setScratched] = useState(false);

  const heal = () => {
    setScratched(true);
    setTimeout(() => setScratched(false), 1500);
  };

  return (
    <section className="py-24">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Self-Healing Technology"
          title={
            <>
              Scratches vanish.{" "}
              <span className="text-gradient-electric">Gloss stays.</span>
            </>
          }
          description="SUNKOOL PPF uses an elastomeric top coat that re-flows with heat — light swirls and scratches disappear on their own. Tap the panel to test it."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <button
            onClick={heal}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 20%, #3a3f4a, #0c0d10 70%)",
            }}
          >
            {/* glossy paint highlight */}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.18)_50%,transparent_60%)]" />
            {/* water beads */}
            {[
              [20, 30],
              [60, 22],
              [78, 60],
              [35, 70],
              [50, 48],
            ].map(([l, t], i) => (
              <span
                key={i}
                className="absolute h-3 w-3 rounded-full bg-white/30 shadow-[inset_0_-2px_3px_rgba(0,0,0,0.4),0_1px_2px_rgba(255,255,255,0.4)]"
                style={{ left: `${l}%`, top: `${t}%` }}
              />
            ))}

            {/* scratches */}
            <AnimatePresence>
              {scratched && (
                <>
                  {[30, 45, 58].map((top, i) => (
                    <motion.span
                      key={top}
                      initial={{ scaleX: 0, opacity: 0.9 }}
                      animate={{ scaleX: 1, opacity: 0 }}
                      transition={{ duration: 1.4, delay: i * 0.05 }}
                      className="absolute left-[20%] h-px w-[60%] origin-left bg-white/70"
                      style={{ top: `${top}%`, rotate: `${-8 + i * 4}deg` }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full glass-strong px-4 py-1.5 text-xs text-silver-soft">
              {scratched ? "Healing…" : "Tap to scratch & heal"}
            </span>
          </button>

          <div className="space-y-5">
            {[
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Impact Absorption",
                desc: "Thick TPU layer absorbs rock chips and road debris before they ever reach your paint.",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Self-Healing Top Coat",
                desc: "Swirls and light scratches re-flow and disappear with ambient or applied heat.",
              },
              {
                icon: <Droplets className="h-5 w-5" />,
                title: "Hydrophobic Finish",
                desc: "Water, dirt and contaminants bead off — keeping your finish cleaner, longer.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass flex gap-4 rounded-2xl p-5"
              >
                <span className="text-electric">{f.icon}</span>
                <div>
                  <p className="font-display font-semibold text-white">
                    {f.title}
                  </p>
                  <p className="mt-1 text-sm text-white">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
