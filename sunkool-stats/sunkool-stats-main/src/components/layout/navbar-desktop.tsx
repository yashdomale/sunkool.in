"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { MORE, PRIMARY, isActive, navSpring } from "./nav-items";
import { NewBadge, NewDot } from "./nav-new-update";

function NavPill({
  href,
  label,
  active,
  icon,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-ring",
        active ? "text-black" : "text-white/85 hover:text-white",
        className
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-white shadow-[0_0_24px_-4px_rgba(255,255,255,0.45)]"
          transition={navSpring}
        />
      )}
      {!active && (
        <span className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.04] opacity-100 transition-all duration-300 group-hover:border-white/35 group-hover:bg-white/10" />
      )}
      <span className="relative z-10 flex items-center gap-1">{label}</span>
      {icon && <span className="relative z-10 opacity-70">{icon}</span>}
    </Link>
  );
}

/** The desktop (lg and up) menu: product pills with hover dropdowns, then "More". */
export function NavbarDesktop({ pathname, hasNewUpdate }: { pathname: string; hasNewUpdate: boolean }) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div
      className="hidden items-center gap-1.5 lg:flex"
      onMouseLeave={() => setHover(null)}
    >
      {PRIMARY.map((item, i) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, ...navSpring }}
          className="relative"
          onMouseEnter={() => setHover(item.href)}
        >
          <NavPill
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
            icon={
              "seriesLinks" in item && item.seriesLinks ? (
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    hover === item.href && "rotate-180"
                  )}
                />
              ) : undefined
            }
          />

          <AnimatePresence>
            {"seriesLinks" in item && item.seriesLinks && hover === item.href && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="absolute left-0 top-full z-50 pt-3"
              >
                <div className="w-56 overflow-hidden rounded-2xl border border-white/10 bg-black p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
                  {item.seriesLinks.map((s, j) => (
                    <motion.div
                      key={s.slug}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.04 }}
                    >
                      <Link
                        href={`${item.href}#${s.slug}`}
                        className="focus-ring block rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white hover:text-black"
                      >
                        {s.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <div
        className="relative"
        onMouseEnter={() => setHover("more")}
      >
        <button
          type="button"
          aria-expanded={hover === "more"}
          aria-haspopup="true"
          onClick={() => setHover((h) => (h === "more" ? null : "more"))}
          className="focus-ring group relative inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
        >
          More
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 opacity-70 transition-transform duration-300",
              hover === "more" && "rotate-180"
            )}
          />
          {hasNewUpdate && hover !== "more" && (
            <>
              <NewDot className="-right-0.5 -top-0.5" />
              <span className="sr-only">(new update)</span>
            </>
          )}
        </button>
        <AnimatePresence>
          {hover === "more" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="absolute right-0 top-full z-50 pt-3"
            >
              <div className="w-56 overflow-hidden rounded-2xl border border-white/10 bg-black p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
                {MORE.map((m, j) => (
                  <motion.div
                    key={m.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.04 }}
                  >
                    <Link
                      href={m.href}
                      className="focus-ring flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white hover:text-black"
                    >
                      {m.label}
                      {m.showsNewBadge && hasNewUpdate && <NewBadge />}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
