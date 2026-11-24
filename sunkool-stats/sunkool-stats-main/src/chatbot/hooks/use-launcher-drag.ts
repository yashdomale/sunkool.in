"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { fractionFromPoint, nudge, pointFromFraction, type Fraction, type Point } from "@/chatbot/lib/placement";

const STORAGE_KEY = "sunkool-chat-launcher-v1";
/** Moving less than this is a click, not a drag, so a shaky tap still opens the chat. */
const DRAG_THRESHOLD_PX = 6;
const NUDGE_PX = 16;

type Viewport = { w: number; h: number };
const SERVER_VIEWPORT: Viewport = { w: 1280, h: 800 };
let viewport: Viewport = SERVER_VIEWPORT;

function readViewport(): Viewport {
  if (viewport.w !== window.innerWidth || viewport.h !== window.innerHeight) viewport = { w: window.innerWidth, h: window.innerHeight };
  return viewport;
}

function subscribeToResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/** The browser window's size, kept current on resize. */
export function useViewport(): Viewport {
  return useSyncExternalStore(subscribeToResize, readViewport, () => SERVER_VIEWPORT);
}

function load(): Fraction | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Fraction> | null;
    if (saved && Number.isFinite(saved.fx) && Number.isFinite(saved.fy)) return { fx: saved.fx as number, fy: saved.fy as number };
  } catch {
    // Storage can be blocked or hold something unreadable: use the default place.
  }
  return null;
}

function save(position: Fraction | null) {
  try {
    if (position) localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Not remembered, but it still moved.
  }
}

/**
 * Lets the visitor drag the chat button anywhere on screen. Until they do, `point` is null and the
 * button keeps its default place above WhatsApp (set in CSS). Once moved it stays where it was put:
 * the spot is remembered in this browser, kept on screen when the window is resized, and can be
 * nudged with Shift + arrow keys or sent back with a double click.
 *
 * Works for mouse, touch and pen through pointer events. A drag never counts as a click, so moving
 * the button does not open the chat.
 */
export function useLauncherDrag(size: number) {
  const { w, h } = useViewport();
  // The widget is only ever rendered in the browser (ssr: false), so reading storage here is safe.
  const [position, setPosition] = useState<Fraction | null>(load);
  const gesture = useRef<{ id: number; dx: number; dy: number; x: number; y: number; moved: boolean } | null>(null);
  const latest = useRef<Fraction | null>(position);
  const swallowClick = useRef(false);

  const point: Point | null = position ? pointFromFraction(position, w, h, size) : null;

  const move = useCallback((next: Fraction | null) => {
    latest.current = next;
    setPosition(next);
  }, []);

  const finish = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (g.moved) {
      save(latest.current);
      // The click that follows the release belongs to the drag, not to the button.
      swallowClick.current = true;
      setTimeout(() => (swallowClick.current = false), 0);
    }
  }, []);

  const handlers = {
    onPointerDown(event: React.PointerEvent<HTMLElement>) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const box = event.currentTarget.getBoundingClientRect();
      gesture.current = { id: event.pointerId, dx: event.clientX - box.left, dy: event.clientY - box.top, x: event.clientX, y: event.clientY, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: React.PointerEvent<HTMLElement>) {
      const g = gesture.current;
      if (!g || g.id !== event.pointerId) return;
      if (!g.moved && Math.hypot(event.clientX - g.x, event.clientY - g.y) < DRAG_THRESHOLD_PX) return;
      g.moved = true;
      const { w: vw, h: vh } = readViewport();
      move(fractionFromPoint({ left: event.clientX - g.dx, top: event.clientY - g.dy }, vw, vh, size));
    },
    onPointerUp: finish,
    onPointerCancel: finish,
    onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      const step = { ArrowLeft: [-NUDGE_PX, 0], ArrowRight: [NUDGE_PX, 0], ArrowUp: [0, -NUDGE_PX], ArrowDown: [0, NUDGE_PX] }[event.key];
      if (!event.shiftKey || !step) return;
      event.preventDefault();
      const { w: vw, h: vh } = readViewport();
      // From its default place there is no stored position yet: start from where it is now.
      const box = event.currentTarget.getBoundingClientRect();
      const from = latest.current ?? fractionFromPoint({ left: box.left, top: box.top }, vw, vh, size);
      const next = nudge(from, step[0], step[1], vw, vh, size);
      move(next);
      save(next);
    },
    onDoubleClick() {
      move(null);
      save(null);
    },
  };

  /** True once for the click that ends a drag, so the caller can ignore it. */
  const ignoreClick = useCallback(() => {
    const ignore = swallowClick.current;
    swallowClick.current = false;
    return ignore;
  }, []);

  return { point, handlers, ignoreClick, moved: position !== null };
}
