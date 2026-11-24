"use client";

import Link from "next/link";
import { formatMonthYear } from "@/lib/format-date";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/blog/types";

const TAG_ACCENT: Record<string, string> = {
  Technology: "#58a7e8",
  "Window Film": "#7dd3ff",
  PPF: "#c0c0c0",
  "Vehicle Care": "#f47521",
  Regulations: "#8a93a0",
  "Industry News": "#8b5cf6",
};

function getAccent(post: Post): string {
  if (post.category && TAG_ACCENT[post.category.name]) return TAG_ACCENT[post.category.name];
  return "#58a7e8";
}

function shortDate(iso: string | null): string {
  if (!iso) return "";
  return formatMonthYear(iso);
}

type BlogGridProps = { posts: Post[]; featured?: Post | null };

export function BlogGrid({ posts, featured }: BlogGridProps) {
  const rest = posts;

  if (posts.length === 0 && !featured) {
    return <p className="py-20 text-center text-white">No posts found.</p>;
  }

  return (
    <div>
      {/* ── Featured card ──────────────────────────────────────────── */}
      {featured && (
        <motion.article
          key={featured.slug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group mb-6"
        >
          <Link
            href={`/blog/${featured.slug}`}
            className="grid overflow-hidden rounded-3xl border border-white/10 transition-colors hover:border-white/20 lg:grid-cols-2"
          >
            {/* Cover / gradient */}
            <div
              className="relative min-h-56 overflow-hidden"
              style={{
                background: `radial-gradient(120% 120% at 20% 20%, ${getAccent(featured)}55, #0a0a0a 70%)`,
              }}
            >
              {featured.coverImage && (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />
            </div>

            {/* Text */}
            <div className="p-8 lg:p-10">
              <span className="eyebrow">
                {featured.category?.name ?? "Article"} · Featured
              </span>
              <h3 className="mt-4 font-display text-3xl font-semibold text-white">
                {featured.title}
              </h3>
              <p className="mt-3 text-white">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-white">
                <span>{shortDate(featured.publishedAt)}</span>
                {featured.readingTime && (
                  <>
                    <span>·</span>
                    <span>{featured.readingTime} min read</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        </motion.article>
      )}

      {/* ── Grid ────────────────────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-carbon-2 transition-colors hover:border-white/20"
          >
            <Link href={`/blog/${p.slug}`} className="flex flex-1 flex-col">
              {/* Cover / gradient */}
              <div
                className="relative h-40 overflow-hidden"
                style={{
                  background: `radial-gradient(120% 120% at 30% 20%, ${getAccent(p)}44, #0a0a0a 75%)`,
                }}
              >
                {p.coverImage && (
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.07)_50%,transparent_60%)]" />
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col p-6">
                {p.category && (
                  <span className="text-xs uppercase tracking-[0.2em] text-electric">
                    {p.category.name}
                  </span>
                )}
                <h3 className="mt-3 font-display text-lg font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-white">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-white">
                  <span>
                    {shortDate(p.publishedAt)}
                    {p.readingTime && ` · ${p.readingTime} min`}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
