export type MediaAspect = "16/9" | "4/5" | "1/1" | "3/2" | "8/7" | "387/254" | "775/507" | "1569/687";

const MANAGED_PREFIXES = [
  "/images/ultra-edge/",
  "/images/window-film/",
  "/images/ppf/",
  "/images/regulations/",
  "/videos/ultra-edge/",
  "/videos/window-film/",
  "/videos/ppf/",
  "/frames/",
] as const;

export function isManagedPublicAsset(src: string) {
  return MANAGED_PREFIXES.some((prefix) => src.includes(prefix));
}

/** Bump version when replacing files under public/images|videos/ */
export function bustAssetCache(src: string, version: string) {
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}v=${version}`;
}
