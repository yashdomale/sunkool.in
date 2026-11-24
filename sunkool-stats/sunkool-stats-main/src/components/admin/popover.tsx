"use client";

import { useEffect, useLayoutEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { adminTheme } from "./theme";

const GAP = 8;
const MARGIN = 12;

export const menuItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-fog transition-colors hover:bg-electric/10 hover:text-white focus-visible:bg-electric/10 focus-visible:text-white focus-visible:outline-none disabled:opacity-50";

/**
 * A popover anchored under (or over, if there's no room) its trigger. It is
 * portalled to <body> with fixed positioning so a table wrapper's
 * `overflow-x-auto` can't clip it, and it closes on outside click, Escape,
 * scroll and resize.
 */
export function Popover({
  anchorRef,
  open,
  onClose,
  label,
  role = "menu",
  className,
  children,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  label: string;
  role?: "menu" | "dialog";
  className?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Positioned imperatively before paint so the panel never flashes at 0,0.
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!open || !anchor || !panel) return;
    const rect = anchor.getBoundingClientRect();
    const fitsBelow = rect.bottom + GAP + panel.offsetHeight <= window.innerHeight - MARGIN;
    panel.style.top = `${fitsBelow ? rect.bottom + GAP : Math.max(MARGIN, rect.top - GAP - panel.offsetHeight)}px`;
    panel.style.right = `${Math.max(MARGIN, window.innerWidth - rect.right)}px`;
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || anchor?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onClose();
      anchor?.focus();
    };
    const onViewportChange = (event: Event) => {
      if (event.target instanceof Node && panelRef.current?.contains(event.target)) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    if (role === "menu") panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open, onClose, anchorRef, role]);

  function onPanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (role !== "menu") return;
    if (event.key === "Tab") {
      onClose();
      return;
    }
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "ArrowDown" ? (current + 1) % items.length
      : event.key === "ArrowUp" ? (current - 1 + items.length) % items.length
      : event.key === "Home" ? 0
      : event.key === "End" ? items.length - 1
      : -1;
    if (next < 0) return;
    event.preventDefault();
    items[next]?.focus();
  }

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      role={role}
      aria-label={label}
      onKeyDown={onPanelKeyDown}
      style={{ ...adminTheme, position: "fixed", top: 0, right: 0 }}
      className={cn(
        "z-[60] min-w-44 rounded-xl border border-electric/25! bg-carbon-3 p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.9),0_0_0_1px_rgba(88,167,232,0.06)]",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
}
