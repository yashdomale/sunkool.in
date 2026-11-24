"use client";
import { VisibleLoop } from "@/components/ui/visible-loop";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { ImageIcon, Play } from "lucide-react";
import type { MediaAspect } from "@/lib/public-media";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";
import { cn } from "@/lib/utils";

/** Default for multi-column product galleries */
export const MEDIA_SIZES_GALLERY =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
/** Side-by-side hero / showcase imagery on large screens */
export const MEDIA_SIZES_HERO_SIDE = "(max-width: 1024px) 100vw, 42vw";
export const MEDIA_SIZES_FULL = "100vw";

const ASPECT_CLASS: Record<MediaAspect, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "8/7": "aspect-[8/7]",
  "387/254": "aspect-[387/254]", // moonroof.png (1548×1016), shown uncropped
  "775/507": "aspect-[775/507]", // sunroof.png (1550×1014), shown uncropped
  "1569/687": "aspect-[1569/687]",
};

type MediaSlotProps = {
  src: string;
  alt: string;
  aspect?: MediaAspect;
  accent?: string;
  label?: string;
  fileHint?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  videoSrc?: string;
  poster?: string;
  zoomOnHover?: boolean;
  fillParent?: boolean;
  /** How the image fills its frame — use contain for documents/certificates */
  fit?: "cover" | "contain";
};

export function MediaSlot({
  src,
  alt,
  aspect = "16/9",
  accent = "#58a7e8",
  label,
  fileHint,
  priority = false,
  sizes = MEDIA_SIZES_FULL,
  className,
  videoSrc,
  poster,
  zoomOnHover = false,
  fillParent = false,
  fit = "cover",
}: MediaSlotProps) {
  const [imgError, setImgError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const videoReady = Boolean(videoSrc);

  const hint = fileHint ?? src.replace(/^\//, "public/");
  const resolvedSrc = resolvePublicAssetSrc(src);

  const handlePlay = () => {
    if (videoSrc && videoReady) {
      setPlaying(true);
      return;
    }
    setShowComingSoon(true);
    window.setTimeout(() => setShowComingSoon(false), 2800);
  };

  if (videoSrc && playing && videoReady) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-black",
          ASPECT_CLASS[aspect],
          className
        )}
      >
        <video
          src={resolvePublicAssetSrc(videoSrc)}
          poster={poster ? resolvePublicAssetSrc(poster) : undefined}
          controls
          autoPlay
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40",
        !fillParent && ASPECT_CLASS[aspect],
        fillParent && "h-full min-h-[inherit] w-full",
        zoomOnHover && "transition-transform duration-500 hover:scale-[1.02]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 30% 20%, ${accent}44, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, ${accent}22, transparent 55%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE1vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')] opacity-40" />

      {!imgError ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            fit === "contain"
              ? "object-contain p-3 sm:p-6"
              : "object-cover transition-transform duration-700 group-hover:scale-105",
            zoomOnHover && fit === "cover" && "group-hover:scale-105"
          )}
          sizes={sizes}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <VisibleLoop
            className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <ImageIcon
            className="relative mb-3 h-8 w-8 opacity-40"
            style={{ color: accent }}
          />
          {label && (
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {label}
            </p>
          )}
          {process.env.NODE_ENV !== "production" && (
            <p className="relative mt-2 max-w-[16rem] text-[10px] leading-relaxed text-white/90">
              Replace:
              <br />
              <span className="text-electric/80">{hint}</span>
            </p>
          )}
        </div>
      )}

      {videoSrc && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video"
          className="focus-ring absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/35"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
            style={{ boxShadow: `0 0 40px -8px ${accent}88` }}
          >
            <Play className="h-7 w-7 fill-white text-white" />
          </span>
        </button>
      )}

      {showComingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <p className="px-6 text-center font-display text-lg text-white">
            Video coming soon
          </p>
        </motion.div>
      )}
    </div>
  );
}
