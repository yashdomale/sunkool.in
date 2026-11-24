import type { MediaAspect } from "@/lib/public-media";

const IMG = "/images/ppf";
const VID = "/videos/ppf";

/** Bump when replacing files under public/images|videos/ppf/ */
export const PPF_ASSET_VERSION = "5";

export const PPF_MEDIA = {
  hero: {
    videoSrc: `${VID}/hero.mp4`,
    duration: 8,
    poster: `${IMG}/hero-poster.jpg`,
    alt: "SUNKOOL paint protection film on premium vehicle",
    fileHintVideo: "public/videos/ppf/hero.mp4",
    fileHintPoster: "public/images/ppf/hero-poster.jpg",
  },
  brandFilm: {
    videoSrc: `${VID}/brand-film.mp4`,
    fileHintVideo: "public/videos/ppf/brand-film.mp4",
  },
  layerDiagram: {
    src: `${IMG}/ppflayer-diagram.png`,
    alt: "PPF layer stack diagram",
    aspect: "1569/687" as MediaAspect,
    fileHint: "public/images/ppf/ppflayer-diagram.png",
  },
  series: {
    hd07: {
      hero: `${IMG}/hd07-hero.jpg`,
      heroAlt: "SUNKOOL HD07 paint protection film",
    },
    signature: {
      hero: `${IMG}/signature-hero.jpg`,
      heroAlt: "SUNKOOL Signature Ultimate paint protection film",
    },
  },
  gallery: [
    {
      src: `${IMG}/gallery-01.jpg`,
      caption: "Hood & bumper coverage",
      fileHint: "public/images/ppf/gallery-01.jpg",
    },
    {
      src: `${IMG}/gallery-02.jpg`,
      caption: "Full front install",
      fileHint: "public/images/ppf/gallery-02.jpg",
    },
    {
      src: `${IMG}/gallery-03.jpg`,
      caption: "Mirror & door cups",
      fileHint: "public/images/ppf/gallery-03.jpg",
    },
    {
      src: `${IMG}/gallery-04.jpg`,
      caption: "High-gloss finish",
      fileHint: "public/images/ppf/gallery-04.jpg",
    },
    {
      src: `${IMG}/gallery-05.jpg`,
      caption: "Film clarity detail",
      fileHint: "public/images/ppf/gallery-05.jpg",
    },
    {
      src: `${IMG}/gallery-06.jpg`,
      caption: "Completed vehicle",
      fileHint: "public/images/ppf/gallery-06.jpg",
    },
  ],
  beforeAfter: {
    before: `${IMG}/gallery-before.jpg`,
    after: `${IMG}/gallery-after.jpg`,
    beforeHint: "public/images/ppf/gallery-before.jpg",
    afterHint: "public/images/ppf/gallery-after.jpg",
  },
} as const;

export const PPF_NAV = [
  { slug: "hd07", label: "HD07" },
  { slug: "signature", label: "Signature" },
] as const;
