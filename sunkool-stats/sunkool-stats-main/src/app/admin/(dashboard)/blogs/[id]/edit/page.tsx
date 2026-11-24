import { notFound } from "next/navigation";
import { getAllAuthors, getAllCategories, getLinkDestinations, getPostById } from "@/lib/blog/queries";
import { PageHeader } from "@/components/admin/ui";
import { BlogForm } from "../../blog-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, authors, linkDestinations] = await Promise.all([
    getPostById(id),
    getAllCategories(),
    getAllAuthors(),
    getLinkDestinations(id),
  ]);

  if (!post) notFound();

  return (
    <div>
      <PageHeader eyebrow="Sunkool CMS" title="Edit post" />
      <BlogForm post={post} categories={categories} authors={authors} linkDestinations={linkDestinations} />
    </div>
  );
}
