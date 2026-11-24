Desktop production performance check — 17 September 2026

Local Chrome Desktop Lighthouse, using the same desktop preset before and after:

| Metric | Before | After |
| --- | ---: | ---: |
| Performance score | 96 | 100 |
| Network payload | 12,093 KiB | 566 KiB |
| LCP | 1.3 s | 0.7 s |
| FCP | 0.3 s | 0.3 s |
| Total blocking time | 20 ms | 10 ms |
| JavaScript startup | 0.6 s | 0.4 s |
| Estimated unused JavaScript | 68 KiB | 65 KiB |

Results are local lab measurements, not a guarantee of the deployed PSI score.
The original report's hashed JS filenames are absent from this build; the
current framework, Motion, and homepage chunks were inspected in Lighthouse.
Remaining unused JS is largely shared framework/animation code. The modern
browser configuration does not remove the framework's remaining legacy-code
audit estimate; no required framework polyfills were deleted.

Changes:

- Load one desktop frame before scrolling; mobile requests no sequence frames.
- Prioritize the exact scroll frame and cache remaining frames in bounded idle
  batches after interaction. IntersectionObserver gates work to the nearby
  viewport; hidden tabs pause background loading. A timer supports browsers
  without requestIdleCallback. Cached frames retain the same scroll mapping.
- Generate 1440px and 1920px AVIF variants, preserving aspect ratio and the
  original 227-frame sequence. The variants total 6.41 and 7.25 MiB respectively,
  versus 10.58 MiB of original JPEGs. JPEGs remain as source and decode fallback.
  Regenerate with `node scripts/optimize-hero-frames.mjs`.
- Split the canvas component into a desktop-only dynamic import, remove unused
  navigation catalogue imports, and prepare homepage catalogue summaries on
  the server instead of shipping the full product data to the homepage.
- Prevent desktop from requesting the mobile hero photo. Preserve the desktop
  hero DOM across hydration, including very early scroll input.
- Load the original Maps poster near the footer instead of on page entry.
- Retain critical global CSS and scope Tailwind scanning to application/MDX
  sources. No blanket CSS deferral, added preconnects, routing, or canonical changes.
- Use Next.js's documented browser targets: Chrome/Edge/Firefox 111+, Safari 16.4+.

Validation:

- Production build, TypeScript, and targeted lint passed.
- `node scripts/qa/hero-performance-check.mjs` passed: first-frame-only loading,
  all 227 progressively loaded frames, forward/reverse scrubbing, stable
  stationary canvas, mobile responsiveness, and no runtime errors.
- Separate checks passed for the idle timer fallback, 1440px variant, JPEG
  decode fallback, and deliberately delayed hydration with early scrolling.
- Desktop/mobile opening viewport screenshot comparisons matched the original
  within three color levels per channel. Sample compressed frames were also
  inspected visually; sample 1440px conversion PSNR was 39–41 dB.
- Existing production smoke checks passed across 15 public routes on desktop
  and mobile, including footer lazy loading, once-only Maps playback, and
  offscreen video pausing.

Saved evidence: `performance-before.json`, `performance-after.json`,
`performance-after.html`, and desktop/mobile network JSON reports.

The public Desktop PageSpeed Insights API returned HTTP 429 (quota exceeded).
These changes are local and have not been deployed. A deployed PSI re-test
requires the updated build to be published first.
