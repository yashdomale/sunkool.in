import { getAllCategories } from "@/lib/blog/queries";
import { PageHeader, tableHeadClass, tableShellClass } from "@/components/admin/ui";
import { NewCategoryForm } from "./new-category-form";
import { CategoryRow } from "./category-row";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <PageHeader
        eyebrow="Sunkool CMS"
        title="Categories"
        description={`${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
      />
      <NewCategoryForm />
      <div className={tableShellClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className={tableHeadClass}>
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">Slug</th>
                <th className="px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={3} className="p-10 text-center text-fog">No categories yet.</td></tr>
              )}
              {categories.map((c) => <CategoryRow key={c.id} category={c} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
