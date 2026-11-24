import type { MediaAspect } from "@/lib/public-media";

/** Drop-in asset paths — add files under public/ to replace placeholders automatically. */

const IMG = "/images/ultra-edge";
const VID = "/videos/ultra-edge";

/**
 * Bump this when you replace images/videos in public/.../ultra-edge/
 * so the browser picks up the new file without a stale cache.
 */
export const ULTRA_EDGE_ASSET_VERSION = "2";

export type LineMediaKey =
  | "ultra"
  | "edge"
  | "prism"
  | "sunroof"
  | "moonroof";

export const ULTRA_EDGE_MEDIA = {
  hero: {
    src: "/images/ppf/newultraedge.png",
    alt: "SUNKOOL Ultra Edge window film",
    aspect: "16/9" as MediaAspect,
    fileHint: "public/images/ppf/newultraedge.png",
    recommended: "1920×1080",
  },
  brandFilm: {
    /** Drop your ~3 MB MP4 at public/videos/ultra-edge/brand-film.mp4 */
    poster: `${IMG}/brand-film-poster.jpg`,
    videoSrc: `${VID}/brand-film.mp4`,
    alt: "SUNKOOL Ultra Edge brand film",
    fileHintPoster: "public/images/ultra-edge/brand-film-poster.jpg",
    fileHintVideo: "public/videos/ultra-edge/brand-film.mp4",
  },
  spectrumDiagram: {
    src: `${IMG}/solar-spectrum-diagram.png`,
    alt: "Solar spectrum diagram",
    aspect: "16/9" as MediaAspect,
    fileHint: "public/images/ultra-edge/solar-spectrum-diagram.png",
  },
  layerCrossSection: {
    src: `${IMG}/ultra-layer.jpg`,
    alt: "Ultra Edge film cross-section",
    aspect: "4/5" as MediaAspect,
    fileHint: "public/images/ultra-edge/ultra-layer.jpg",
  },
  lines: {
    ultra: {
      hero: `${IMG}/ultra-hero.jpg`,
      heroAlt: "Ultra silver window film",
    },
    edge: {
      hero: `${IMG}/edge-hero.jpg`,
      heroAlt: "Edge titanium nitride film",
    },
    prism: {
      hero: `${IMG}/prism-hero.jpg`,
      heroAlt: "Prism nano multilayer PET film",
    },
    sunroof: {
      hero: "/images/MOONROOF/sunroof.png",
      heroAlt: "Sunroof protection film application",
      // Matches the photo's own shape so the whole image shows, uncropped.
      heroAspect: "775/507",
      // Shown directly under the "Sunroof Special Series" heading instead of in a side column.
      heroBelowTitle: true,
    },
    moonroof: {
      hero: "/images/MOONROOF/moonroof.png",
      heroAlt: "Moonroof heat control film",
      // Matches the photo's own shape so the whole image shows, uncropped.
      heroAspect: "387/254",
      // Shown directly under the "Moonroof Special Series" heading instead of in a side column.
      heroBelowTitle: true,
    },
  } satisfies Record<
    LineMediaKey,
    {
      hero: string;
      heroAlt: string;
      /** Frame shape for the hero; defaults to the tall 4/5 frame. */
      heroAspect?: MediaAspect;
      /** Put the hero under the section heading (single column) rather than beside the text. */
      heroBelowTitle?: boolean;
    }
  >,
  gallery: [
    {
      src: `${IMG}/gallery-01.jpg`,
      caption: "Windshield install",
      fileHint: "public/images/ultra-edge/gallery-01.jpg",
    },
    {
      src: `${IMG}/gallery-02.jpg`,
      caption: "Side glass application",
      fileHint: "public/images/ultra-edge/gallery-02.jpg",
    },
    {
      src: `${IMG}/gallery-03.jpg`,
      caption: "Sunroof application",
      fileHint: "public/images/ultra-edge/gallery-03.jpg",
    },
    {
      src: `${IMG}/gallery-04.jpg`,
      caption: "Rear glass finish",
      fileHint: "public/images/ultra-edge/gallery-04.jpg",
    },
    {
      src: `${IMG}/gallery-05.jpg`,
      caption: "Film clarity detail",
      fileHint: "public/images/ultra-edge/gallery-05.jpg",
    },
    {
      src: `${IMG}/gallery-06.jpg`,
      caption: "Completed vehicle",
      fileHint: "public/images/ultra-edge/gallery-06.jpg",
    },
  ],
  beforeAfter: {
    before: `${IMG}/gallery-before.jpg`,
    after: `${IMG}/gallery-after.jpg`,
    beforeHint: "public/images/ultra-edge/gallery-before.jpg",
    afterHint: "public/images/ultra-edge/gallery-after.jpg",
  },
} as const;

export const NAV_ITEMS = [
  { slug: "ultra", label: "Ultra" },
  { slug: "edge", label: "Edge" },
  { slug: "prism", label: "Prism" },
  { slug: "sunroof", label: "Sunroof" },
  { slug: "moonroof", label: "Moonroof" },
] as const;
