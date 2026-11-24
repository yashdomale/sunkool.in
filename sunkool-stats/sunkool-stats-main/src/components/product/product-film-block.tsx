"use client";

import Link from "next/link";
import { AutoplayBrandVideo } from "@/components/media/autoplay-brand-video";
import { Reveal } from "@/components/ui/reveal";

/** The full-width autoplaying brand film on a product page, with a screen-reader link to the full video page. */
export function ProductFilmBlock({
  videoSrc,
  fileHintVideo,
  accent,
  videoPageHref,
}: {
  videoSrc: string;
  fileHintVideo: string;
  accent: "electric" | "sun";
  videoPageHref: string;
}) {
  return (
    <section className="relative py-8 sm:py-12">
      <div className="container-lux">
        <Reveal>
          <div className="relative min-h-[50vh] overflow-hidden rounded-[2rem] border border-white/10 sm:min-h-[60vh] lg:min-h-[70vh]">
            <AutoplayBrandVideo
              videoSrc={videoSrc}
              fileHintVideo={fileHintVideo}
              className="rounded-[2rem]"
              accent={accent}
            />
          </div>
          <Link href={videoPageHref} className="sr-only">
            Watch the full film →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
