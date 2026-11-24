"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, Phone, Sparkles } from "lucide-react";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { EASE_OUT as ease } from "@/lib/motion";

const TICKER = ["PPF", "HEAT CONTROL", "WINDOW FILM", "NANO-CERAMIC", "SUNKOOL"];

export function ContactHero() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-black/40 to-black/60 p-8 sm:p-10 lg:p-14">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(246,177,26,0.22),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(88,167,232,0.28),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.03)_50%,transparent_60%)]" />

      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-sun" />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-white">
              Let&apos;s Connect
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.06, ease }}
            className="headline text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="text-gradient-silver">Get in Touch</span>
            <br />
            <span className="text-sunkool">with</span>{" "}
            {/* The wordmark stands in for the word: its alt keeps the heading's text
                "Get in Touch with SUNKOOL". Sized in em so it scales with the heading. */}
            <Image
              src="/sunkool-wordmark.png"
              alt="SUNKOOL"
              width={480}
              height={100}
              loading="eager"
              className="inline-block h-[0.82em] w-auto align-[-0.08em]"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white sm:text-lg"
          >
            Questions about paint protection film or car heat control glazing?
            Tell us what you want for your vehicle — we&apos;ll route you to the
            right specialist on our team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {TICKER.map((item, i) => (
              <span
                key={item}
                className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="flex flex-col gap-3"
        >
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-5 transition-all duration-500 hover:border-[#25D366]/70 hover:bg-[#25D366]/15 hover:shadow-[0_0_48px_-8px_rgba(37,211,102,0.45)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#25D366]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">
                      Chat on WhatsApp
                    </p>
                    <p className="text-xs text-[#a8f0c8]">
                      {CONTACT.responseTime}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-white">
                  Fastest way to reach us — film quotes, PPF, dealer enquiries.
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-[#25D366] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={CONTACT.phoneHref}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-electric/40 hover:bg-electric/5"
            >
              <Phone className="h-4 w-4 text-electric" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white">
                  Call
                </p>
                <p className="text-xs font-medium text-white sm:text-sm">
                  {CONTACT.phone}
                </p>
              </div>
            </a>
            <a
              href={CONTACT.emailHref}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-sun/40 hover:bg-sun/5"
            >
              <Mail className="h-4 w-4 text-sun" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white">
                  Email
                </p>
                <p className="truncate text-xs font-medium text-white sm:text-sm">
                  {CONTACT.email}
                </p>
              </div>
            </a>
          </div>

          <a
            href={buildWhatsAppUrl(
              "Hi SUNKOOL, I need help choosing the right film for my car."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-xs text-white transition-colors hover:text-[#25D366]"
          >
            Prefer a quick question? Tap here to open WhatsApp →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
