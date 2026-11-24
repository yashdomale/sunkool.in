import { bustAssetCache, isManagedPublicAsset } from "@/lib/public-media";
import { PPF_ASSET_VERSION } from "@/lib/ppf-media";
import { REGULATIONS_ASSET_VERSION } from "@/lib/regulations-media";
import { TECH_DEMO_ASSET_VERSION } from "@/lib/tech-demo-media";
import { ULTRA_EDGE_ASSET_VERSION } from "@/lib/ultra-edge-media";
import { WINDOW_FILM_ASSET_VERSION } from "@/lib/window-film-media";

export function resolvePublicAssetSrc(src: string) {
  if (!isManagedPublicAsset(src)) return src;
  if (src.includes("/window-film/")) {
    return bustAssetCache(src, WINDOW_FILM_ASSET_VERSION);
  }
  if (src.includes("/ultra-edge/")) {
    return bustAssetCache(src, ULTRA_EDGE_ASSET_VERSION);
  }
  if (src.includes("/ppf/")) {
    return bustAssetCache(src, PPF_ASSET_VERSION);
  }
  if (src.includes("/regulations/")) {
    return bustAssetCache(src, REGULATIONS_ASSET_VERSION);
  }
  if (src.includes("/tech-demo/") || src.includes("/frames/")) {
    return bustAssetCache(src, TECH_DEMO_ASSET_VERSION);
  }
  return bustAssetCache(src, "1");
}
