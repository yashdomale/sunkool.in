"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { WARRANTY_HELP } from "@/lib/warranty-content";
import { Reveal } from "@/components/ui/reveal";
import { EASE_OUT as ease } from "@/lib/motion";

export function WarrantyHelpCta() {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-lux max-w-3xl">
        <Reveal>
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.35, ease }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-black/40 to-black/70 p-6 text-center sm:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(88,167,232,0.12),transparent)]" />
            <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-electric/25 bg-electric/10 text-electric">
              <MessageCircle className="h-6 w-6" />
            </span>
            <h3 className="relative mt-5 font-display text-xl font-semibold text-white sm:text-2xl">
              {WARRANTY_HELP.title}
            </h3>
            <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-white">
              {WARRANTY_HELP.body}
            </p>
            <Link
              href={WARRANTY_HELP.href}
              className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-electric/50 hover:text-electric sm:mt-7 sm:w-fit"
            >
              {WARRANTY_HELP.cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
