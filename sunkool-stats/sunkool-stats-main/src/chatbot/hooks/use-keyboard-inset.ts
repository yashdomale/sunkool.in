"use client";

import { useSyncExternalStore } from "react";

// Anything smaller than this is the browser's own bars (address bar collapsing), not a keyboard.
const MIN_KEYBOARD_PX = 80;

function subscribe(onChange: () => void) {
  const viewport = window.visualViewport;
  if (!viewport) return () => {};
  viewport.addEventListener("resize", onChange);
  viewport.addEventListener("scroll", onChange);
  return () => {
    viewport.removeEventListener("resize", onChange);
    viewport.removeEventListener("scroll", onChange);
  };
}

function read(): number {
  const viewport = window.visualViewport;
  if (!viewport) return 0;
  const covered = Math.round(window.innerHeight - viewport.height - viewport.offsetTop);
  return covered >= MIN_KEYBOARD_PX ? covered : 0;
}

/**
 * How many pixels, from the bottom of the page, the on-screen keyboard covers (0 when there is none).
 * The chat popup on a phone sits at the bottom of the screen, so without this the keyboard would open
 * on top of the message box; the popup lifts by this much instead. Browsers that resize the page for
 * the keyboard themselves report 0 here, and need nothing.
 */
export function useKeyboardInset(): number {
  return useSyncExternalStore(subscribe, read, () => 0);
}
