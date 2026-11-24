// Shared animation settings for `motion` components.

/** The site's standard ease-out curve (fast start, gentle settle). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Fade-and-rise variants: `hidden` sits `distance` px lower and transparent; `show(i)` animates in,
 * delayed by `i * stagger` seconds so siblings cascade.
 */
export function fadeUp(distance: number, stagger: number, duration = 0.65) {
  return {
    hidden: { opacity: 0, y: distance },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration, delay: i * stagger, ease: EASE_OUT },
    }),
  };
}
