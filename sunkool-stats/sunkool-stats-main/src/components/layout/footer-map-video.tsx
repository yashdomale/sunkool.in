"use client";

import { useVisibleVideo } from "@/hooks/use-visible-video";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function FooterMapVideo() {
  const pathname = usePathname();
  return <PageMapVideo key={pathname} />;
}

function PageMapVideo() {
  const { videoRef } = useVisibleVideo("/videos/map/mapsvideo-optimized.mp4", true);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Video posters download eagerly even when the video has no src.
    // Prepare the unchanged poster before the footer enters the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      video.poster = "/images/tech-demo/maps.jpeg";
      observer.disconnect();
    }, { rootMargin: "600px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef]);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="pointer-events-none block aspect-[1759/894] w-full object-cover"
    />
  );
}
