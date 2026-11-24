import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog/types";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-white/10 pt-12">
      <p className="eyebrow mb-6">Related reading</p>
      <div className="grid gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/20"
          >
            <div className="relative h-32 overflow-hidden bg-carbon-2">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-white group-hover:text-electric">{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
