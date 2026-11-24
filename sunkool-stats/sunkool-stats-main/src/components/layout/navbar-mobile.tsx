"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { MORE, PRIMARY, isActive, navSpring } from "./nav-items";
import { NewBadge } from "./nav-new-update";

/**
 * The slide-down mobile menu (below lg). Which product's sub-menu is expanded lives in the navbar,
 * so it survives closing and reopening the menu and resets only on navigation.
 */
export function NavbarMobile({
  open,
  onClose,
  pathname,
  hasNewUpdate,
  subOpenHref,
  setSubOpenHref,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  hasNewUpdate: boolean;
  subOpenHref: string | null;
  setSubOpenHref: (update: (current: string | null) => string | null) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="overflow-hidden bg-black lg:hidden"
        >
          <div
            className="container-lux flex flex-col gap-1.5 py-5"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) onClose();
            }}
          >
            {PRIMARY.map((item, i) => {
              const hasSubLinks =
                "seriesLinks" in item && !!item.seriesLinks?.length;
              const subOpen = subOpenHref === item.href;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, ...navSpring }}
                >
                  {hasSubLinks ? (
                    <div
                      className={cn(
                        "overflow-hidden border transition-colors",
                        subOpen ? "rounded-3xl" : "rounded-full",
                        subOpen || isActive(pathname, item.href)
                          ? "border-white/30 bg-white/[0.06]"
                          : "border-white/15"
                      )}
                    >
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={cn(
                            "focus-ring flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            isActive(pathname, item.href)
                              ? "text-white"
                              : "text-white/85 hover:text-white"
                          )}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={subOpen}
                          aria-label={`${subOpen ? "Hide" : "Show"} ${item.label} series`}
                          className="focus-ring flex h-9 w-11 shrink-0 items-center justify-center text-white/70 hover:text-white"
                          onClick={() =>
                            setSubOpenHref((current) =>
                              current === item.href ? null : item.href
                            )
                          }
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-300",
                              subOpen && "rotate-180"
                            )}
                          />
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {subOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: EASE_OUT }}
                            className="overflow-hidden border-t border-white/10"
                          >
                            {item.seriesLinks!.map((s) => (
                              <Link
                                key={s.slug}
                                href={`${item.href}#${s.slug}`}
                                className="focus-ring block rounded-sm py-2.5 pl-8 pr-4 text-sm text-white/60 hover:text-white"
                              >
                                {s.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "focus-ring block rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        isActive(pathname, item.href)
                          ? "border-white bg-white text-black"
                          : "border-white/15 text-white/85 hover:border-white/30 hover:bg-white/10"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              );
            })}
            {MORE.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * (PRIMARY.length + i), ...navSpring }}
              >
                <Link
                  href={item.href}
                  className="focus-ring flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/85 hover:border-white/30 hover:bg-white/10"
                >
                  {item.label}
                  {item.showsNewBadge && hasNewUpdate && <NewBadge />}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
