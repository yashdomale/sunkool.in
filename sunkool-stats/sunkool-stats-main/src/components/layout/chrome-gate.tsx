"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ContactWhatsAppFab } from "@/components/contact/contact-whatsapp-fab";
import { isCitySlug } from "@/lib/cities";

// Browser-only and loaded after the page is interactive, so the chat adds nothing to first load.
const SunkoolChatbot = dynamic(() => import("@/chatbot/components/sunkool-chatbot"), { ssr: false });

/**
 * Hides the public Navbar/Footer on /admin/* routes. Kept as a thin client
 * wrapper around the root layout rather than moving all 17 existing route
 * directories into a marketing route group.
 *
 * The floating WhatsApp button is part of the public chrome too, so it shows
 * on every public page (it used to be rendered by /contact alone).
 */
export function ChromeGate({
  children,
  latestUpdateAt,
}: {
  children: React.ReactNode;
  /** When the newest blog post was published; drives the nav's "New" badge on Updates. */
  latestUpdateAt: string | null;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const slug = pathname?.split("/")[1] ?? "";
  const city = isCitySlug(slug) ? slug : undefined;

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Navbar latestUpdateAt={latestUpdateAt} />
      <main id="main-content">{children}</main>
      <Footer city={city} />
      <ContactWhatsAppFab />
      <SunkoolChatbot />
    </>
  );
}
