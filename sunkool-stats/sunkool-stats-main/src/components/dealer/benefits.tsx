"use client";

import { motion } from "motion/react";
import { MapPinned, Megaphone, GraduationCap, PackageCheck } from "lucide-react";
import { RevealGroup, revealItem } from "@/components/ui/reveal";

const BENEFITS = [
  {
    icon: <MapPinned className="h-6 w-6" />,
    title: "Exclusive Territory",
    desc: "Protected zones so you own your market — no SUNKOOL competition next door.",
  },
  {
    icon: <Megaphone className="h-6 w-6" />,
    title: "Marketing Support",
    desc: "Co-branded campaigns, content and lead generation that fill your bay.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Certified Training",
    desc: "Hands-on installer certification and ongoing technical mastery.",
  },
  {
    icon: <PackageCheck className="h-6 w-6" />,
    title: "Premium Product Access",
    desc: "Priority supply of the full SUNKOOL range at partner pricing.",
  },
];

export function DealerBenefits() {
  return (
    <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {BENEFITS.map((b) => (
        <motion.div
          key={b.title}
          variants={revealItem}
          className="glass rounded-2xl p-7"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-electric">
            {b.icon}
          </span>
          <h3 className="mt-5 font-display text-lg font-semibold text-white">
            {b.title}
          </h3>
          <p className="mt-2 text-sm text-white">{b.desc}</p>
        </motion.div>
      ))}
    </RevealGroup>
  );
}
