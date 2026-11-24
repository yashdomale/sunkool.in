import { BlogPostSkeleton } from "@/components/blog/blog-skeletons";

// Shown the moment a post card or link is pressed, while the post itself is on its way.
export default function BlogPostLoading() {
  return <BlogPostSkeleton />;
}
