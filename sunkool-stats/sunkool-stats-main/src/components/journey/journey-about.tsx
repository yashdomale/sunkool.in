"use client";
import { VisibleLoop } from "@/components/ui/visible-loop";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Award,
  FlaskConical,
  Headphones,
  Shield,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { CountUp } from "@/components/common/count-up";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_OUT as ease } from "@/lib/motion";

const HIGHLIGHTS = [
  { value: 2005, suffix: "", label: "Year we began in India", isYear: true },
  { value: 99, suffix: ".9%", label: "UV protection across our films" },
  { value: 100, suffix: "%", label: "Commitment to our promises" },
] as const;

type Milestone = {
  marker: string;
  icon: LucideIcon;
  title: string;
  body: string;
  accent: "sun" | "kool";
};

const MILESTONES: Milestone[] = [
  {
    marker: "2005",
    icon: Sparkles,
    title: "Who we are",
    accent: "sun",
    body: `Sunkool Solution is a leading supplier of window film and paint protection solutions in India, offering high-quality films for all types of glass windows. We serve as an excellent resource for consumers looking for window film and car paint protection. We incepted our journey in 2005. With a history of quality, trust, and complete customer satisfaction, our name has become synonymous with reliability. Beyond product safety and sustainability, we emphasise understanding both the technical specifications and the day-to-day practical challenges our customers face.`,
  },
  {
    marker: "01",
    icon: Shield,
    title: "Our commitment",
    accent: "kool",
    body: `Applying the most advanced technologies and streamlined processes to meet our clients' needs is central to how we work. This delivers superior protection, comfort, and style — combined with the highest degree of service and support available.`,
  },
  {
    marker: "02",
    icon: FlaskConical,
    title: "Science of glass",
    accent: "kool",
    body: `To offer layers of comfort, luxury, and protection against external elements, our products are scientifically formulated. Glass is a special material with great potential and real limitations that must be overcome. Our goal is to ensure that the products we deliver to customers, dealers, and partners across the country meet the highest quality standards — maximising the effectiveness of every window application so people can make the best use of their glass.`,
  },
  {
    marker: "03",
    icon: Sun,
    title: "Our specialty",
    accent: "sun",
    body: `We specialise in film that is less heavily tinted — reducing glare without overly affecting vision — while delivering strong rejection of heat and infrared radiation that would otherwise create uncomfortable cabin experiences.`,
  },
  {
    marker: "04",
    icon: Headphones,
    title: "After-sales promise",
    accent: "kool",
    body: `After-sales support is designed to be straightforward from the user's perspective: a self-reporting system for hassle-free complaints and a warranty that customers can claim directly. The strength of our organisation lies in our commitment to delivering on our promises.`,
  },
];

function HighlightCard({
  item,
  index,
}: {
  item: (typeof HIGHLIGHTS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.75, delay: index * 0.1, ease }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease } }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-electric/10 via-transparent to-sun/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-electric/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
      <p className="relative font-display text-3xl font-bold text-gradient-electric sm:text-4xl">
        {"isYear" in item && item.isYear ? (
          <CountUp target={item.value} />
        ) : (
          <>
            <CountUp target={item.value} suffix={item.suffix} />
          </>
        )}
      </p>
      <p className="relative mt-2 text-sm leading-relaxed text-white">{item.label}</p>
    </motion.div>
  );
}

function MilestoneCard({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  const Icon = milestone.icon;
  const isLeft = index % 2 === 0;
  const accent =
    milestone.accent === "sun"
      ? "from-sun/20 to-transparent text-sun"
      : "from-electric/20 to-transparent text-electric";

  return (
    <motion.article
      initial={{ opacity: 0, x: isLeft ? -36 : 36, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.8, delay: 0.05, ease }}
      className="relative w-full"
    >
      <motion.span
        className={`absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black font-display text-[11px] font-bold tracking-wider text-white sm:left-1/2 ${
          milestone.marker === "2005"
            ? "border-sun/40 bg-sun/15 text-sun"
            : "border-electric/30 bg-electric/10 text-electric"
        }`}
        whileInView={{ scale: [0.6, 1.12, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease }}
      >
        {milestone.marker}
      </motion.span>

      <div
        className={`ml-14 sm:ml-0 sm:w-[calc(50%-2rem)] ${
          isLeft ? "sm:mr-auto sm:pr-6" : "sm:ml-auto sm:pl-6"
        }`}
      >
        <div
          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-500 hover:border-white/20 sm:p-7 ${
            isLeft ? "sm:text-right" : ""
          }`}
        >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
        <div
          className={`relative flex items-start gap-4 ${
            isLeft ? "sm:flex-row-reverse sm:gap-5" : "sm:gap-5"
          }`}
        >
          <motion.span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] ${
              milestone.accent === "sun" ? "text-sun" : "text-electric"
            }`}
            whileHover={{ rotate: 6, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            <Icon className="h-5 w-5" />
          </motion.span>
          <div>
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {milestone.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white sm:text-[0.95rem]">
              {milestone.body}
            </p>
          </div>
        </div>
      </div>
    </div>
    </motion.article>
  );
}

function JourneyAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <VisibleLoop
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-[8%] h-72 w-72 rounded-full bg-sun/10 blur-[100px]"
      />
      <VisibleLoop
        animate={{ x: [0, -24, 0], y: [0, 28, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-16 top-[35%] h-80 w-80 rounded-full bg-electric/10 blur-[110px]"
      />
      <VisibleLoop
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-1/3 h-56 w-56 rounded-full bg-electric/5 blur-[90px]"
      />
    </div>
  );
}

export function JourneyAbout() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.4"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    restDelta: 0.001,
  });
  const beamY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative">
      <JourneyAmbient />

      {/* stats */}
      <div className="relative grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((item, i) => (
          <HighlightCard key={item.label} item={item} index={i} />
        ))}
      </div>

      {/* scroll timeline */}
      <div ref={timelineRef} className="relative mt-24 sm:mt-32">
        <div className="mb-12 text-center sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow"
          >
            Our story unfolds
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.06, ease }}
            className="headline mt-3 text-3xl sm:text-5xl"
          >
            <span className="text-gradient-sun">Trust</span> engineered{" "}
            <span className="text-gradient-kool">over time.</span>
          </motion.h2>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10 sm:left-1/2" />
          {!reduced && (
            <>
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-sun via-electric to-electric/20 sm:left-1/2"
              />
              <motion.div
                style={{ top: beamY }}
                className="absolute left-4 h-16 w-px -translate-x-px bg-gradient-to-b from-transparent via-white/80 to-transparent sm:left-1/2"
              />
            </>
          )}

          <div className="space-y-14 sm:space-y-20">
            {MILESTONES.map((milestone, i) => (
              <MilestoneCard key={milestone.title} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* closing */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.85, ease }}
        className="relative mt-24 overflow-hidden rounded-3xl border border-white/10 sm:mt-32"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sun/10 via-black/40 to-electric/15" />
        <VisibleLoop
          className="absolute inset-0 opacity-30"
          animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
        />
        <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex items-center gap-4">
            <VisibleLoop
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Award className="h-10 w-10 text-sun" />
            </VisibleLoop>
            <div>
              <p className="eyebrow text-sun/90">Since 2005</p>
              <p className="font-display text-xl font-semibold text-white sm:text-2xl">
                Trust, quality, and protection — built into every film.
              </p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white sm:text-base">
            From window film to paint protection, Sunkool continues to set the
            standard for comfort, clarity, and confidence on Indian roads.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
