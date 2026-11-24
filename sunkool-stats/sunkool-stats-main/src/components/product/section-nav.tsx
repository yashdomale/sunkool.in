"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Sticky in-page navigation for a product page's series sections. Highlights the section in view,
 * becomes a floating pill bar once the page is scrolled past the hero, and scrolls sideways on narrow
 * screens. Each link is at least 44px tall and shows a focus ring.
 */
export function SectionNav({
  items,
  initial,
  label,
  layoutId,
  pillClass,
  widthClass = "max-w-md",
  centered = true,
  itemPadClass = "px-6",
}: {
  items: readonly { slug: string; label: string }[];
  initial: string;
  label: string;
  /** Unique per page, so the moving highlight animates between this nav's links only. */
  layoutId: string;
  /** Classes of the highlight behind the active link. */
  pillClass: string;
  widthClass?: string;
  centered?: boolean;
  itemPadClass?: string;
}) {
  const [active, setActive] = useState(initial);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let last: boolean | null = null;
    const onScroll = () => {
      const next = window.scrollY > 520;
      if (next === last) return;
      last = next;
      setStuck(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items.map((n) => document.getElementById(n.slug)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    // Vertical padding and border stay the same in both states: only colours change. If the height
    // changed when it sticks, every section below would shift ~30px right after an anchor jump
    // (e.g. /window-film#foundation) and the jump would land short.
    <div className="sticky top-[4.25rem] z-40 py-2 transition-all duration-500">
      <div
        className={cn(
          "mx-auto rounded-full border py-1.5 transition-all duration-500",
          widthClass,
          stuck
            ? "glass border-white/10 px-2 shadow-lg shadow-black/20"
            : "border-transparent px-4"
        )}
      >
        <nav
          className={cn("flex gap-1 overflow-x-auto scrollbar-none snap-x snap-mandatory", centered && "justify-center")}
          aria-label={label}
        >
          {items.map((item) => {
            const isActive = active === item.slug;
            return (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className={cn(
                  "focus-ring relative inline-flex min-h-11 shrink-0 snap-center items-center rounded-full py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                  itemPadClass,
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    className={cn("absolute inset-0 rounded-full", pillClass)}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
