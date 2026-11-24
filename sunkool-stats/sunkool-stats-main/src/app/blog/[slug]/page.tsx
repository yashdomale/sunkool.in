import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { after } from "next/server";
import { ArrowLeft, Clock, Calendar, User } from "@/components/blog/post-icons";
import { getAllPublishedPostSlugs, getPostBySlug, getPublishedLinkDestinations, getRelatedPosts } from "@/lib/blog/queries";
import { breadcrumbSchema, SITE_URL } from "@/lib/schema";
import { absoluteUrl } from "@/lib/blog/absolute-url";
import { articleMetaDescription } from "@/lib/blog/meta-description";
import { shouldCountView } from "@/lib/blog/view-count";
import { tiptapJsonToHtml } from "@/lib/blog/render";
import { formatLongDate } from "@/lib/format-date";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { FaqSection } from "@/components/blog/faq-section";
import { RelatedPosts } from "@/components/blog/related-posts";
import { SocialShare } from "@/components/blog/social-share";
import { BlogLeadForm } from "@/components/blog/lead-form";
import { getLeadProductGroups } from "@/lib/blog/leads/products";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedPostSlugs();
    return slugs.map((p) => ({ slug: p.slug }));
  } catch {
    // Supabase unreachable at build time (e.g. env not yet configured) —
    // fall back to fully on-demand rendering (dynamicParams defaults to
    // true) rather than failing the whole build.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = articleMetaDescription(post);
  // cover_image is a site-relative path for the bundled posts but a full Supabase Storage URL for
  // everything uploaded through the editor, so never prepend the origin blindly.
  const coverUrl = post.coverImage ? absoluteUrl(post.coverImage, SITE_URL) : null;
  const ogImage = coverUrl
    ? [{ url: coverUrl, width: 1200, height: 630, alt: post.title }]
    : ["/opengraph-image"];

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.sunkool.in/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.keywords,
      images: ogImage,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: coverUrl ? [coverUrl] : ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = isSupabaseConfigured() ? await createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const post = await getPostBySlug(slug, { includeDraft: Boolean(user) });
  if (!post) notFound();
  if (post.status === "draft" && !user) notFound();

  const [relatedPosts, linkDestinations] = await Promise.all([
    getRelatedPosts(post, 3),
    getPublishedLinkDestinations(),
  ]);

  if (supabase && shouldCountView(post)) {
    after(async () => {
      await supabase.rpc("increment_post_views", { post_id: post.id });
    });
  }

  const url = `https://www.sunkool.in/blog/${post.slug}`;
  const contentHtml = tiptapJsonToHtml(post.content, {
    source: { id: post.id, slug: post.slug },
    destinations: linkDestinations,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      "@type": "Organization",
      name: "SUNKOOL",
      logo: { "@type": "ImageObject", url: "https://www.sunkool.in/sunkool-wordmark.png" },
      url: "https://www.sunkool.in",
    },
    ...(post.coverImage && { image: absoluteUrl(post.coverImage, SITE_URL) }),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const faqJsonLd =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      {post.status === "draft" && (
        <div className="bg-sun py-2 text-center text-sm font-medium text-black">
          Draft preview — this post is not published
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[50vh] w-[80vw] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #58a7e8, transparent 70%)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18] mask-fade-y" />

        <div className="container-lux relative max-w-4xl">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Link>

          {post.category && (
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-electric">
                {post.category.name}
              </span>
            </div>
          )}

          <h1 className="headline mb-6 text-4xl text-white sm:text-5xl lg:text-6xl">{post.title}</h1>

          <div className="mb-8 flex flex-wrap items-center gap-5 text-sm text-white">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 opacity-60" />
                {post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 opacity-60" />
                {formatLongDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 opacity-60" />
              {post.readingTime} min read
            </span>
          </div>

          {post.coverImage && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={630}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                className="w-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────────────── */}
      <div className="pb-28">
        <div className="container-lux max-w-4xl">
          <article
            className="prose-sunkool [&_a]:text-electric [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-glow"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <FaqSection faqs={post.faqs} />

          <div className="mt-12 border-t border-white/10 pt-8">
            <SocialShare url={url} title={post.title} />
          </div>

          {/* The enquiry form at the bottom of every post. Each submission is attributed to this exact
              post and shows up under Blog Data in the admin. Drafts never take enquiries, and without a
              database connection (bundled articles only) there is nowhere to store them. */}
          {supabase && post.status === "published" && (
            <BlogLeadForm postId={post.id} products={getLeadProductGroups()} />
          )}

          <RelatedPosts posts={relatedPosts} />

          {/* ── Post footer / CTA ────────────────────────────────────── */}
          <div className="mt-20 border-t border-white/10 pt-12">
            <p className="eyebrow mb-6">Explore SUNKOOL products</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/window-film", label: "Window Film" },
                { href: "/ppf", label: "Paint Protection Film" },
                { href: "/ultra-edge", label: "Ultra Edge Metal Film" },
                { href: "/compare", label: "Compare Films" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition-colors hover:border-electric hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Journal
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
