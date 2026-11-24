"use client";

import { useState } from "react";
import { useVisibleVideo } from "@/hooks/use-visible-video";
import { Film } from "lucide-react";
import { PPF_MEDIA } from "@/lib/ppf-media";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";
import { cn } from "@/lib/utils";

type PpfHeroVideoProps = {
  className?: string;
};

export function PpfHeroVideo({ className }: PpfHeroVideoProps) {
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);

  const videoSrc = resolvePublicAssetSrc(PPF_MEDIA.hero.videoSrc);
  const posterSrc = PPF_MEDIA.hero.poster
    ? resolvePublicAssetSrc(PPF_MEDIA.hero.poster)
    : undefined;

  const { videoRef } = useVisibleVideo(videoSrc);

  if (missing) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[inherit] w-full flex-col items-center justify-center bg-black/60 p-8 text-center",
          className
        )}
      >
        <Film className="mb-4 h-10 w-10 text-white/35" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          PPF Hero Video
        </p>
        {process.env.NODE_ENV !== "production" && (
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/90">
            Drop your 8s clip at
            <br />
            <span className="text-white/70">{PPF_MEDIA.hero.fileHintVideo}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative h-full min-h-[inherit] w-full overflow-hidden bg-black", className)}>
      <video
        ref={videoRef}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700 ease-out",
          ready ? "opacity-100" : "opacity-0"
        )}
        style={{ transform: "translateZ(0)" }}
        poster={posterSrc}
        muted
        playsInline
        loop
        preload="metadata"
        disablePictureInPicture
        aria-hidden
        onError={() => setMissing(true)}
        onLoadedData={() => setReady(true)}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(192,192,192,0.12),transparent_55%)]" />
    </div>
  );
}
