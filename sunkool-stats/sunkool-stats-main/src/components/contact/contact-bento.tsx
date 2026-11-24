"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Building2,
  Globe2,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { SocialLinks } from "@/components/ui/social-links";
import { EASE_OUT as ease } from "@/lib/motion";

function RegionBadge({ code, accent }: { code: string; accent: "sun" | "kool" }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold tracking-wider ${
        accent === "sun"
          ? "border border-sun/30 bg-sun/10 text-sun"
          : "border border-electric/30 bg-electric/10 text-electric"
      }`}
    >
      {code}
    </span>
  );
}

export function ContactBento() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {/* WhatsApp — featured tile */}
      <motion.a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-6%" }}
        transition={{ duration: 0.7, ease }}
        whileHover={{ y: -6 }}
        className="group relative col-span-full overflow-hidden rounded-3xl border border-[#25D366]/25 bg-gradient-to-br from-[#25D366]/12 via-black/50 to-black/70 p-7 sm:col-span-2 lg:col-span-3 lg:row-span-2 lg:p-9"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#25D366]/20 blur-3xl transition-all duration-700 group-hover:bg-[#25D366]/30" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#25D366]/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-between gap-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.5)]">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <ArrowUpRight className="h-5 w-5 text-[#25D366] opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
              WhatsApp us
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white">
              Skip the wait — message us directly for film selection, pricing
              guidance, installation queries, and dealer partnerships.
            </p>
          </div>

          <div>
            <p className="font-display text-xl font-semibold text-[#7dffb0] sm:text-2xl">
              {CONTACT.whatsappDisplay}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/90">
              {CONTACT.responseTime}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 group-hover:scale-[1.02]">
              <MessageCircle className="h-4 w-4" />
              Open WhatsApp
            </span>
          </div>
        </div>
      </motion.a>

      {/* India HQ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.08, ease }}
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sun/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <RegionBadge code={CONTACT.corporateAddress.code} accent="sun" />
            <Building2 className="h-5 w-5 text-sun/70" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-white">
            {CONTACT.corporateAddress.title}
          </h3>
          <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-white/90">
            {CONTACT.corporateAddress.region}
          </p>
          <div className="mt-4 space-y-0.5 text-sm leading-relaxed text-white">
            {CONTACT.corporateAddress.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a
            href={buildWhatsAppUrl(
              "Hello SUNKOOL, I'd like to visit / enquire about your Nagpur corporate office."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-sun transition-colors hover:text-[#ffbf96]"
          >
            Directions via WhatsApp
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.div>

      {/* US office */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.12, ease }}
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-electric/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <RegionBadge code={CONTACT.usAddress.code} accent="kool" />
            <Globe2 className="h-5 w-5 text-electric/70" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-white">
            {CONTACT.usAddress.title}
          </h3>
          <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-white/90">
            {CONTACT.usAddress.region}
          </p>
          <div className="mt-4 space-y-0.5 text-sm leading-relaxed text-white">
            {CONTACT.usAddress.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-white">
            <MapPin className="h-3.5 w-3.5 text-electric" />
            Thornton, Colorado
          </div>
        </div>
      </motion.div>

      {/* Social strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.16, ease }}
        className="col-span-full rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.04] p-6 sm:p-7"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-electric" />
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Social Media
              </h3>
              <p className="mt-0.5 text-xs text-white">
                Follow SUNKOOL for installs, film tech, and product drops.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <SocialLinks size="sm" showLabels />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
