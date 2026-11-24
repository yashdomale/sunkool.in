import { getAllAuthors, getAllCategories, getLinkDestinations } from "@/lib/blog/queries";
import { PageHeader } from "@/components/admin/ui";
import { BlogForm } from "../blog-form";

export default async function NewBlogPostPage() {
  const [categories, authors, linkDestinations] = await Promise.all([
    getAllCategories(),
    getAllAuthors(),
    getLinkDestinations(),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Sunkool CMS" title="New post" />
      <BlogForm categories={categories} authors={authors} linkDestinations={linkDestinations} />
    </div>
  );
}
