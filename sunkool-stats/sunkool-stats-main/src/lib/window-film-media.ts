import type { MediaAspect } from "@/lib/public-media";

const IMG = "/images/window-film";
const VID = "/videos/window-film";

export const WINDOW_FILM_ASSET_VERSION = "2";

export const WINDOW_FILM_MEDIA = {
  hero: {
    src: `${IMG}/PREMIUM.png`,
    alt: "SUNKOOL installer in black gloves applying nano-ceramic window film to a car's side glass",
    aspect: "16/9" as MediaAspect,
    fileHint: "public/images/window-film/PREMIUM.png",
  },
  brandFilm: {
    videoSrc: `${VID}/brand-film.mp4`,
    fileHintVideo: "public/videos/window-film/brand-film.mp4",
  },
  nanoDiagram: {
    src: `${IMG}/layers.png`,
    alt: "Nano-ceramic film layer diagram",
    aspect: "16/9" as MediaAspect,
    fileHint: "public/images/window-film/layers.png",
  },
  series: {
    foundation: {
      hero: `${IMG}/foundation-hero.jpg`,
      heroAlt: "SUNKOOL Legend, Elite & SK Series window film",
    },
    signature: {
      hero: `${IMG}/signature-hero.jpg`,
      heroAlt: "SUNKOOL Signature Series window film",
    },
  },
  gallery: [
    {
      src: `${IMG}/gallery-01.jpg`,
      caption: "Windshield install",
      fileHint: "public/images/window-film/gallery-01.jpg",
    },
    {
      src: `${IMG}/gallery-02.jpg`,
      caption: "Side glass tint",
      fileHint: "public/images/window-film/gallery-02.jpg",
    },
    {
      src: `${IMG}/gallery-03.jpg`,
      caption: "Rear glass finish",
      fileHint: "public/images/window-film/gallery-03.jpg",
    },
    {
      src: `${IMG}/gallery-04.jpg`,
      caption: "Cabin comfort",
      fileHint: "public/images/window-film/gallery-04.jpg",
    },
    {
      src: `${IMG}/gallery-05.jpg`,
      caption: "Film clarity detail",
      fileHint: "public/images/window-film/gallery-05.jpg",
    },
    {
      src: `${IMG}/gallery-06.jpg`,
      caption: "Completed vehicle",
      fileHint: "public/images/window-film/gallery-06.jpg",
    },
  ],
  beforeAfter: {
    before: `${IMG}/gallery-before.jpg`,
    after: `${IMG}/gallery-after.jpg`,
    beforeHint: "public/images/window-film/gallery-before.jpg",
    afterHint: "public/images/window-film/gallery-after.jpg",
  },
} as const;

/** One button per series; each slug is the id of that series' block on the page. */
export const WINDOW_FILM_NAV = [
  { slug: "legend", label: "Legend" },
  { slug: "elite", label: "Elite" },
  { slug: "sk-series", label: "SK Series" },
  { slug: "signature", label: "Signature" },
] as const;
