import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { getAllVideoSlugs, getVideo } from "@/lib/videos";

export const metadata: Metadata = {
  title: { absolute: "Watch SUNKOOL Videos" },
  description:
    "Watch SUNKOOL's brand films for Paint Protection Film, Ultra Edge and nano-ceramic Window Film.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Watch SUNKOOL Videos",
    description:
      "Watch SUNKOOL's brand films for Paint Protection Film, Ultra Edge and nano-ceramic Window Film.",
    images: ["/opengraph-image"],
  },
};

export default function VideosIndexPage() {
  const videos = getAllVideoSlugs()
    .map((slug) => getVideo(slug))
    .filter((v) => v !== undefined);

  return (
    <>
      <PageHeader
        eyebrow="Watch"
        title="SUNKOOL Videos"
        description="Brand films for our paint protection, window film and Ultra Edge product lines."
        className="pt-28 pb-10 sm:pt-36 sm:pb-12"
      />

      <section className="relative pb-20 sm:pb-28">
        <div className="container-lux grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <Reveal key={video.slug} delay={i * 0.06}>
              <Link
                href={`/videos/${video.slug}`}
                className="focus-ring group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-electric/40"
              >
                <div
                  className="relative w-full overflow-hidden bg-black"
                  style={{ aspectRatio: `${video.width} / ${video.height}` }}
                >
                  <Image
                    src={video.poster}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-lg text-white">
                    {video.shortTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-silver-soft">
                    {video.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
