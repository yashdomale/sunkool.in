import { BlogIndexSkeleton } from "@/components/blog/blog-skeletons";

// Shown the moment a link into the blog is pressed. The blog is rendered per request, so without this the
// old page stayed on screen, apparently frozen, until the server had answered.
export default function BlogLoading() {
  return <BlogIndexSkeleton />;
}
