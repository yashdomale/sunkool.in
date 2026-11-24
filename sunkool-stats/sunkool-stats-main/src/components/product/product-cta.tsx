"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { MagneticButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * The closing call-to-action card on the product pages (PPF, window film, Ultra Edge, interior PPF).
 * Each page passes its own wording and accent; the optional parts are left out when not given.
 */
export function ProductCta({
  eyebrow,
  title,
  body,
  gradientClass,
  address,
  phone,
  primaryLabel = "Contact Us",
  showCompare = false,
  whatsappMessage,
}: {
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  /** The card's background gradient, e.g. "from-white/[0.08] via-black/50 to-sun/10". */
  gradientClass: string;
  address?: string;
  phone?: { label: string; href: string; className: string };
  primaryLabel?: string;
  showCompare?: boolean;
  /** Pre-filled WhatsApp text; without it there is no WhatsApp button. */
  whatsappMessage?: string;
}) {
  return (
    <section className="pb-24 pt-8">
      <div className="container-lux">
        <Reveal>
          <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${gradientClass} p-10 text-center sm:p-16`}>
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <p className="eyebrow mb-4">{eyebrow}</p>
              <h2 className="headline text-3xl text-gradient-silver sm:text-5xl">{title}</h2>
              <p className="mx-auto mt-5 max-w-xl text-white">{body}</p>
              {address && <p className="mx-auto mt-4 max-w-lg text-sm text-white/90">{address}</p>}
              {phone && (
                <a href={phone.href} className={`mx-auto mt-2 inline-block text-sm ${phone.className} hover:text-white`}>
                  {phone.label}
                </a>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <MagneticButton href="/contact">{primaryLabel}</MagneticButton>
                {showCompare && (
                  <MagneticButton href="/compare" variant="outline">
                    Compare Films
                  </MagneticButton>
                )}
                {whatsappMessage && (
                  <Link
                    href={buildWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/15 px-7 py-3.5 text-sm font-medium text-[#7dffb0] hover:bg-[#25D366]/25"
                  >
                    WhatsApp
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
