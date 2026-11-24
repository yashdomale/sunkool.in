/** Catalog of standalone watch pages under /videos/[slug]. Add an entry here
 * and it's automatically picked up by generateStaticParams and the sitemap. */

export type VideoSlug = "ppf" | "ultra-edge" | "window-film";

export type VideoEntry = {
  slug: VideoSlug;
  /** Page <h1> / <title> */
  title: string;
  /** Used in breadcrumbs and nav */
  shortTitle: string;
  description: string;
  videoSrc: string;
  poster: string;
  width: number;
  height: number;
  durationSeconds: number;
  /** ISO 8601 date the source file was published */
  uploadDate: string;
  relatedPage: { href: string; label: string };
};

export const VIDEOS: Record<VideoSlug, VideoEntry> = {
  ppf: {
    slug: "ppf",
    title: "SUNKOOL Paint Protection Film — Brand Film",
    shortTitle: "PPF Brand Film",
    description:
      "Watch the SUNKOOL Paint Protection Film brand film — a look at the self-healing aliphatic polyurethane PPF that shields paint from stone chips, scratches and UV.",
    videoSrc: "/videos/ppf/brand-film.mp4",
    poster: "/images/videos/ppf.jpg",
    width: 1920,
    height: 1080,
    durationSeconds: 8,
    uploadDate: "2026-09-17",
    relatedPage: { href: "/ppf", label: "Paint Protection Film" },
  },
  "ultra-edge": {
    slug: "ultra-edge",
    title: "SUNKOOL Ultra Edge — Brand Film",
    shortTitle: "Ultra Edge Brand Film",
    description:
      "Watch the SUNKOOL Ultra Edge brand film, featuring Ultra70 — silver window film engineered for superior heat rejection, UV protection and crystal-clear vision.",
    videoSrc: "/videos/ultra-edge/brand-film.mp4",
    poster: "/images/videos/ultra-edge.jpg",
    width: 1024,
    height: 576,
    durationSeconds: 34,
    uploadDate: "2026-09-17",
    relatedPage: { href: "/ultra-edge", label: "Ultra Edge" },
  },
  "window-film": {
    slug: "window-film",
    title: "SUNKOOL Nano-Ceramic Window Film — Brand Film",
    shortTitle: "Window Film Brand Film",
    description:
      "Watch the SUNKOOL HD-70 nano-ceramic window film brand film — heat rejection, UV protection and all-day cabin comfort.",
    videoSrc: "/videos/window-film/brand-film.mp4",
    poster: "/images/videos/window-film.jpg",
    width: 1664,
    height: 1248,
    durationSeconds: 5,
    uploadDate: "2026-09-17",
    relatedPage: { href: "/window-film", label: "Window Film" },
  },
};

export function getVideo(slug: string): VideoEntry | undefined {
  return VIDEOS[slug as VideoSlug];
}

export function getAllVideoSlugs(): VideoSlug[] {
  return Object.keys(VIDEOS) as VideoSlug[];
}
