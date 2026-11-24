import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { breadcrumbSchema, videoSchema } from "@/lib/schema";
import { getAllVideoSlugs, getVideo } from "@/lib/videos";
import { resolvePublicAssetSrc } from "@/lib/resolve-public-asset";

export function generateStaticParams() {
  return getAllVideoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return {};

  return {
    title: { absolute: `${video.title} | SUNKOOL` },
    description: video.description,
    alternates: { canonical: `/videos/${video.slug}` },
    openGraph: {
      title: video.title,
      description: video.description,
      type: "video.other",
      images: [video.poster],
      videos: [
        {
          url: resolvePublicAssetSrc(video.videoSrc),
          width: video.width,
          height: video.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [video.poster],
    },
  };
}

export default async function VideoWatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();

  const VIDEO_SCHEMA = videoSchema({
    name: video.title,
    description: video.description,
    thumbnailUrl: video.poster,
    contentUrl: resolvePublicAssetSrc(video.videoSrc),
    uploadDate: video.uploadDate,
    durationSeconds: video.durationSeconds,
    width: video.width,
    height: video.height,
  });

  const BREADCRUMB_SCHEMA = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Videos", path: "/videos" },
    { name: video.shortTitle, path: `/videos/${video.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />

      <PageHeader
        eyebrow="Watch"
        title={video.title}
        description={video.description}
        className="pt-28 pb-10 sm:pt-36 sm:pb-12"
      />

      <section className="relative pb-20 sm:pb-28">
        <div className="container-lux">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
              <video
                controls
                preload="metadata"
                poster={video.poster}
                className="block h-auto w-full"
                style={{ aspectRatio: `${video.width} / ${video.height}` }}
              >
                <source
                  src={resolvePublicAssetSrc(video.videoSrc)}
                  type="video/mp4"
                />
              </video>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <p className="text-sm text-silver-soft">
                Featured product:{" "}
                <span className="text-white">{video.relatedPage.label}</span>
              </p>
              <Link
                href={video.relatedPage.href}
                className="focus-ring rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-electric/50 hover:text-electric"
              >
                View {video.relatedPage.label} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
