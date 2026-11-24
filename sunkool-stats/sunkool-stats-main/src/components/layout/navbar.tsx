"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useImmersiveChrome } from "@/lib/immersive-store";
import { EASE_OUT } from "@/lib/motion";
import { navSpring } from "./nav-items";
import { NewDot, useHasNewUpdate } from "./nav-new-update";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";

/** Site header: logo, desktop menu (navbar-desktop), mobile toggle and menu (navbar-mobile). Links are in nav-items. */
export function Navbar({ latestUpdateAt }: { latestUpdateAt: string | null }) {
  const hasNewUpdate = useHasNewUpdate(latestUpdateAt);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const immersive = useImmersiveChrome();
  const hideOnHome = pathname === "/" && scrolled && !immersive.navVisible;

  useEffect(() => {
    // Only touch React state when the value flips, not on every scroll event.
    let last: boolean | null = null;
    const onScroll = () => {
      const next = window.scrollY > 12;
      if (next === last) return;
      last = next;
      setScrolled(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close the mobile menu when the route changes — derived from navigation,
    // not something we can compute during render of the previous page.
    /* eslint-disable react-hooks/set-state-in-effect -- intentional reset on pathname change */
    setOpen(false);
    setMobileSubOpen(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  return (
    <motion.header
      initial={false}
      animate={{
        height: scrolled ? 64 : 80,
        opacity: hideOnHome ? 0 : 1,
        y: hideOnHome ? "-100%" : 0,
        pointerEvents: hideOnHome ? "none" : "auto",
        boxShadow: scrolled
          ? "0 12px 40px -12px rgba(0,0,0,0.85)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className="fixed inset-x-0 top-0 z-50 bg-black"
      inert={hideOnHome}
    >
      <nav className="container-lux flex h-full items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={navSpring}
        >
          <Link href="/" className="relative z-10 block" aria-label="SUNKOOL home">
            <Logo
              className={cn(
                "h-auto brightness-110 transition-[width] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                scrolled ? "w-20 sm:w-24" : "w-24 sm:w-28"
              )}
            />
          </Link>
        </motion.div>

        <NavbarDesktop pathname={pathname} hasNewUpdate={hasNewUpdate} />

        <button
          type="button"
          className="focus-ring relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {hasNewUpdate && !open && <NewDot className="-right-0.5 -top-0.5" />}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <NavbarMobile
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        hasNewUpdate={hasNewUpdate}
        subOpenHref={mobileSubOpen}
        setSubOpenHref={setMobileSubOpen}
      />
    </motion.header>
  );
}
