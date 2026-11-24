import { getAllAuthors } from "@/lib/blog/queries";
import { PageHeader } from "@/components/admin/ui";
import { AuthorForm } from "./author-form";
import { AuthorCard } from "./author-card";

export default async function AdminAuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <div>
      <PageHeader
        eyebrow="Sunkool CMS"
        title="Authors"
        description={`${authors.length} ${authors.length === 1 ? "author" : "authors"}`}
      />
      <div className="mb-6">
        <AuthorForm />
      </div>
      <div className="flex flex-col gap-3">
        {authors.length === 0 && <p className="py-6 text-center text-sm text-fog">No authors yet.</p>}
        {authors.map((a) => <AuthorCard key={a.id} author={a} />)}
      </div>
    </div>
  );
}
