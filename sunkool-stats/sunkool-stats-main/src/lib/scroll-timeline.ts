/**
 * Scroll-timeline maths for the home feature points.
 *
 * Every frame is a pure function of the measured layout and the current scroll
 * position — nothing is accumulated — so the timeline reverses on scroll up
 * exactly as it advanced. The component (feature-timeline.tsx) measures the DOM
 * and applies the result; this file only does the arithmetic.
 */

/** Desktop: px of scrolling spent revealing the first points before the track starts sliding. */
export const TIMELINE_LEAD = 320;
/** Mobile: a dot's centre sits ~10px below the top of its item. */
export const TIMELINE_DOT_OFFSET = 10;
/** Mobile: a point lights up once it passes this fraction of the viewport height. */
export const TIMELINE_READ_LINE = 0.65;
/** Desktop: the section counts as "entered" once its top passes this fraction of the viewport. */
export const TIMELINE_ENTER_LINE = 0.75;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export type HorizontalLayout = {
  /** Distance from the viewport top at which the stage pins (the fixed header height). */
  stickyTop: number;
  /** How far the track must slide for its last item to come into view. */
  dist: number;
  viewportWidth: number;
  firstItemWidth: number;
  /** Left offset of each item inside the track. */
  lefts: readonly number[];
  /** Line length: first item's dot to last item's dot. */
  length: number;
  lead?: number;
};

export type HorizontalFrame = {
  /** translateX of the track, in px (0 or negative). */
  x: number;
  /** Width of the left-edge mask fade, as a percentage (0–4). */
  fadePercent: number;
  /** Fill of the progress line, 0–1. */
  fill: number;
  /** Which items are lit. */
  active: boolean[];
};

/** `rootTop` is the section root's `getBoundingClientRect().top`. */
export function horizontalFrame(rootTop: number, layout: HorizontalLayout): HorizontalFrame {
  const lead = layout.lead ?? TIMELINE_LEAD;
  // px scrolled inside the pin, clamped to the pinned range
  const scrolled = Math.min(Math.max(layout.stickyTop - rootTop, 0), layout.dist + lead);
  // the track only starts sliding after the lead-in
  const x = -Math.max(scrolled - lead, 0) || 0;
  // "reading edge": opens up over the lead-in, then holds while the track moves under it
  const reading =
    (layout.viewportWidth - layout.firstItemWidth * 0.95) * clamp01(scrolled / lead) - x;
  const first = layout.lefts[0] ?? 0;
  return {
    x,
    fadePercent: clamp01(-x / 80) * 4,
    fill: layout.length > 0 ? clamp01((reading - first) / layout.length) : 0,
    active: layout.lefts.map((left) => left <= reading),
  };
}

export type VerticalLayout = {
  /** Top offset of each item inside the list. */
  tops: readonly number[];
  /** Line length: first item's dot to last item's dot. */
  length: number;
};

export type VerticalFrame = { fill: number; active: boolean[] };

/** `firstItemTop` is the first item's `getBoundingClientRect().top`. */
export function verticalFrame(
  firstItemTop: number,
  viewportHeight: number,
  layout: VerticalLayout
): VerticalFrame {
  const firstDotY = firstItemTop + TIMELINE_DOT_OFFSET;
  const readY = viewportHeight * TIMELINE_READ_LINE;
  const firstTop = layout.tops[0] ?? 0;
  return {
    fill: layout.length > 0 ? clamp01((readY - firstDotY) / layout.length) : 0,
    active: layout.tops.map((top) => firstDotY + top - firstTop <= readY),
  };
}
