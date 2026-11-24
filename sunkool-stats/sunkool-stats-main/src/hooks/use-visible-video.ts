"use client";

import { useEffect, useRef, useState } from "react";

/** Load on entry, pause offscreen/in background, and preserve playback position. */
export function useVisibleVideo(src: string, once = false) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    let disposed = false;
    let pending = false;

    const sync = () => {
      if (!visible || document.hidden || completedRef.current) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = src;
        video.load();
      }
      if (!video.paused || pending) return;
      pending = true;
      void video.play().then(() => {
        if (disposed || !visible || document.hidden) video.pause();
      }).catch(() => {}).finally(() => { pending = false; });
    };
    const ended = () => {
      if (once) completedRef.current = true;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setInView(visible);
      sync();
    }, { threshold: 0.15 });
    observer.observe(video);
    video.addEventListener("ended", ended);
    video.addEventListener("canplay", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener("ended", ended);
      video.removeEventListener("canplay", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [src, once]);

  return { videoRef, inView };
}
