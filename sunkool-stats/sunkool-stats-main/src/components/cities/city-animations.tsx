"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CityAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero: sequenced entrance on page load (the hero is already in view,
      // so this plays immediately rather than waiting on scroll position).
      if (document.querySelector(".hero-reveal")) {
        const heroTl = gsap.timeline({ delay: 0.15 });
        heroTl
          .fromTo(
            ".hero-headline",
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", clearProps: "transform" }
          )
          .fromTo(
            ".hero-subtext",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", clearProps: "transform" },
            "-=0.55"
          );
      }

      // Individual elements: fade in + slide up (plays once, then hands the
      // element back to plain CSS so hover effects aren't fighting a leftover
      // inline transform from the reveal animation).
      gsap.utils.toArray<HTMLElement>(".reveal-fade-up").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });

      // Groups of items (cards, pills, table rows, footer columns): staggered fade + slide
      gsap.utils.toArray<HTMLElement>(".reveal-stagger").forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>(group.children);
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.12,
            clearProps: "transform",
            scrollTrigger: {
              trigger: group,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });

      // Background images: very subtle slow scale as the section scrolls through view
      gsap.utils.toArray<HTMLElement>(".reveal-image").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, document.querySelector(".city-landing") ?? undefined);

    // Recalculate trigger positions once layout (fonts/images) has settled.
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      // The "load" event may have already fired before this effect ran
      // (common once hydration finishes after all assets are in) — in that
      // case the listener below would never call back, leaving trigger
      // positions calculated from an unsettled layout and some elements
      // stuck at opacity 0 forever. Catch that case immediately.
      refresh();
    } else {
      window.addEventListener("load", refresh);
    }

    // Content below the fold (video posters, lazy images, tab switches) can
    // shift page height after the initial calculation, leaving trigger
    // positions stale — elements past the stale point never fire and stay
    // stuck at opacity 0. Re-measure whenever the document's height changes.
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(refresh, 150);
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return null;
}
