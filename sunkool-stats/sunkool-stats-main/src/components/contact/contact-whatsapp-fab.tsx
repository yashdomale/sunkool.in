"use client";

import { motion } from "motion/react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { EASE_OUT } from "@/lib/motion";

// Position and size come from the --fab-* variables in src/chatbot/styles/floating-chat.css, which also places
// the SUNKOOL Assistant launcher above this button - change them there, not here.
export function ContactWhatsAppFab() {
  return (
    <motion.a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SUNKOOL on WhatsApp"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: EASE_OUT }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-[var(--fab-bottom)] right-[var(--fab-right)] z-50 flex h-[var(--fab-size)] w-[var(--fab-size)] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_-4px_rgba(37,211,102,0.55)] ring-2 ring-[#25D366]/30"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/30 opacity-75 motion-safe:animate-ping" />
      <WhatsAppIcon className="relative h-7 w-7 sm:h-8 sm:w-8" />
    </motion.a>
  );
}
