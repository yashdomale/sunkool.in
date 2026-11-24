// Where the chatbot's floating button and its window go when the visitor has dragged the button
// somewhere of their own. Pure maths, no DOM, so it is easy to test. Positions are stored as
// fractions of the room the button can move in (0 = one edge, 1 = the other), so a saved position
// stays sensible when the window is resized or the same browser is used on another screen.

export type Fraction = { fx: number; fy: number };
export type Point = { left: number; top: number };

/** Space the button keeps from every screen edge while dragged. */
export const EDGE_MARGIN = 8;
// Match --chat-window-width and --chat-window-height in floating-chat.css.
const PANEL_MAX_WIDTH = 380;
const PANEL_MAX_HEIGHT = 500;
/** The window needs at least this much height to be worth opening beside the button. */
const PANEL_MIN_HEIGHT = 280;
const PANEL_GAP = 12;
const PANEL_EDGE = 16;

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

function room(viewport: number, size: number) {
  return Math.max(0, viewport - size - 2 * EDGE_MARGIN);
}

/** The button's top-left corner, in pixels, for a stored position. */
export function pointFromFraction(f: Fraction, vw: number, vh: number, size: number): Point {
  return {
    left: EDGE_MARGIN + clamp(f.fx, 0, 1) * room(vw, size),
    top: EDGE_MARGIN + clamp(f.fy, 0, 1) * room(vh, size),
  };
}

/** The stored position for a top-left corner in pixels (it is kept on screen). */
export function fractionFromPoint(p: Point, vw: number, vh: number, size: number): Fraction {
  const rx = room(vw, size);
  const ry = room(vh, size);
  return {
    fx: rx === 0 ? 0 : clamp((p.left - EDGE_MARGIN) / rx, 0, 1),
    fy: ry === 0 ? 0 : clamp((p.top - EDGE_MARGIN) / ry, 0, 1),
  };
}

/** Moves a stored position by a number of pixels (the keyboard's arrow keys). */
export function nudge(f: Fraction, dx: number, dy: number, vw: number, vh: number, size: number): Fraction {
  const p = pointFromFraction(f, vw, vh, size);
  return fractionFromPoint({ left: p.left + dx, top: p.top + dy }, vw, vh, size);
}

export type PanelPlacement = {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Which corner of the window sits next to the button, for the opening animation. */
  origin: "top left" | "top right" | "bottom left" | "bottom right";
};

/**
 * The chat window's box when the button has been moved: on whichever side of the button has more
 * room (above or below), lined up with the button's left or right edge depending on which half of
 * the screen it is in, and always inside the screen. Only used where the window floats; on phones
 * it is a small popup in the corner and ignores all of this.
 */
export function panelPlacement(button: Point, size: number, vw: number, vh: number): PanelPlacement {
  const width = Math.min(PANEL_MAX_WIDTH, Math.max(0, vw - 2 * PANEL_EDGE));
  const above = button.top - PANEL_GAP - PANEL_EDGE;
  const below = vh - (button.top + size) - PANEL_GAP - PANEL_EDGE;
  const side = above >= below ? "above" : "below";
  const available = side === "above" ? above : below;

  const alignRight = button.left + size / 2 > vw / 2;
  const x = clamp(alignRight ? button.left + size - width : button.left, EDGE_MARGIN, Math.max(EDGE_MARGIN, vw - width - EDGE_MARGIN));

  // Neither side has room for a usable window (a very short screen): use the full height and let
  // it cover the button; the window's own close control still works.
  if (available < PANEL_MIN_HEIGHT) {
    const height = Math.min(PANEL_MAX_HEIGHT, Math.max(0, vh - 2 * PANEL_EDGE));
    return { left: x, top: PANEL_EDGE, width, height, origin: alignRight ? "bottom right" : "bottom left" };
  }

  const height = Math.min(PANEL_MAX_HEIGHT, available);
  const y = side === "above" ? button.top - PANEL_GAP - height : button.top + size + PANEL_GAP;
  const vertical = side === "above" ? "bottom" : "top";
  return { left: x, top: y, width, height, origin: `${vertical} ${alignRight ? "right" : "left"}` as PanelPlacement["origin"] };
}
