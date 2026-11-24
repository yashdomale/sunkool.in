"use client";

import { useEffect, useState } from "react";
import { useVisibleVideo } from "@/hooks/use-visible-video";
import { motion } from "motion/react";
import { Film } from "lucide-react";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";
import { cn } from "@/lib/utils";

type VideoState = "loading" | "ready" | "missing";

export function AutoplayBrandVideo({
  videoSrc,
  fileHintVideo,
  className,
  accent = "electric",
}: {
  videoSrc: string;
  fileHintVideo: string;
  className?: string;
  accent?: "electric" | "sun";
}) {
  const [state, setState] = useState<VideoState>("loading");
  const resolved = resolvePublicAssetSrc(videoSrc);

  const { videoRef, inView } = useVisibleVideo(resolved);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !inView) return;

    const markReady = () => {
      setState("ready");

    };

    if (video.readyState >= 2) markReady();

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", markReady);

    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("playing", markReady);
    };
  }, [resolved, inView, videoRef]);

  const glow =
    accent === "sun"
      ? "rgba(246,177,26,0.15)"
      : "rgba(88,167,232,0.15)";

  return (
    <div className={cn("absolute inset-0 bg-black", className)}>
      {state !== "missing" && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            state === "ready" ? "opacity-100" : "opacity-0"
          )}
          onError={() => setState("missing")}
        />
      )}

      {state !== "ready" && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${glow}, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              animate={{ opacity: inView ? [0.5, 1, 0.5] : 0.5 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Film className="mx-auto h-10 w-10 text-electric/70" />
            </motion.div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              Brand film
            </p>
            <p className="mt-3 max-w-md text-sm text-white">
              {state === "missing"
                ? "Add your MP4 below — it will autoplay when the page loads."
                : inView
                  ? "Loading film…"
                  : "Scroll to preview"}
            </p>
            {state === "missing" && process.env.NODE_ENV !== "production" && (
              <p className="mt-4 rounded-xl border border-white/10 bg-black/50 px-4 py-3 font-mono text-[11px] text-electric/90">
                {fileHintVideo}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
