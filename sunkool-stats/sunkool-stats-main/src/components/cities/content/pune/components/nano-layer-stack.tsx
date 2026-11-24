"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Layer = {
  title: string;
  description: string;
};

export default function NanoLayerStack({
  layers,
  className = "",
}: {
  layers: Layer[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 32, x: 24 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 55%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const alt = `Exploded view of the SUNKOOL nano-ceramic film's five layers: ${layers
    .map((layer) => layer.title)
    .join(", ")}`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${x}%`);
    el.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`film-panel relative w-full self-center rounded-3xl border border-white/10 bg-black ${className}`}
    >
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <Image
          src="/images/cities/pune/layer.png"
          alt={alt}
          width={749}
          height={641}
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="film-panel-inner h-auto w-full object-contain"
          priority={false}
        />
      </div>
    </div>
  );
}
