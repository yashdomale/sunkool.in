// Bumped to 6 for the 361-frame sequence: /frames/ is cached for a year, and
// frame N of the new sequence is a different picture from frame N of the old one.
export const TECH_DEMO_ASSET_VERSION = "6";

/**
 * Scroll-scrubbed hero frame sequence: every frame of public/videos/hero/hero.mp4
 * (24 fps, 15 s). Regenerate with `node scripts/generate-hero-frames.mjs`.
 */
export const TECH_DEMO_FRAMES = {
  count: 361,
  basePath: "/frames",
  fileHint: "public/frames/ezgif-frame-001.jpg … ezgif-frame-361.jpg",
} as const;

export function frameSrcAt(index: number, width: 1440 | 1920 = 1920): string {
  const n = String(index).padStart(3, "0");
  return `${TECH_DEMO_FRAMES.basePath}/avif-${width}/ezgif-frame-${n}.avif`;
}

/** Static hero photo shown on mobile in place of the scroll-scrubbed frames. */
export const TECH_DEMO_MOBILE_HERO_IMAGE = {
  src: "/images/tech-demo/hero-mobile.jpg",
  fileHint: "public/images/tech-demo/hero-mobile.jpg",
} as const;

export const SCRUB_START = 0.08;
export const SCRUB_END = 0.96;

/** Map scroll progress 0–1 to a 1-indexed frame number, clamped to [1, count]. */
export function scrubFrameIndexFromProgress(progress: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  if (p <= SCRUB_START) return 1;
  if (p >= SCRUB_END) return TECH_DEMO_FRAMES.count;
  const t = (p - SCRUB_START) / (SCRUB_END - SCRUB_START);
  const index = Math.round(1 + t * (TECH_DEMO_FRAMES.count - 1));
  return Math.min(TECH_DEMO_FRAMES.count, Math.max(1, index));
}
