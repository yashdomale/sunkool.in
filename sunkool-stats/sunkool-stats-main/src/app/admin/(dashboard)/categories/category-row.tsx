"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/admin/form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { iconButtonClass, tableRowClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/blog/validation";
import { updateCategory, deleteCategory } from "./actions";
import type { Category } from "@/lib/blog/types";

export function CategoryRow({ category }: { category: Category }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!editing) {
    return (
      <tr className={tableRowClass}>
        <td className="px-5 py-4 font-medium text-white">{category.name}</td>
        <td className="px-5 py-4">
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-xs text-fog">
            {category.slug}
          </span>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(true)} className={iconButtonClass} aria-label={`Edit ${category.name}`}>
              <Pencil className="h-4 w-4" />
            </button>
            <ConfirmButton
              label="Delete"
              variant="danger"
              message={`Delete "${category.name}"? Posts using it will become uncategorized.`}
              onConfirm={async () => {
                await deleteCategory(category.id);
                router.refresh();
              }}
            />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={cn("bg-electric/[0.04]", "border-b border-white/[0.05] last:border-0")}>
      <td className="px-5 py-3">
        <Input value={name} onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)); }} />
      </td>
      <td className="px-5 py-3">
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await updateCategory(category.id, { name, slug });
                if (!result.success) { setError(result.error); return; }
                setEditing(false);
                router.refresh();
              })
            }
            className={cn(iconButtonClass, "text-electric hover:text-white")}
            aria-label="Save category"
          >
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => setEditing(false)} className={iconButtonClass} aria-label="Cancel editing">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </td>
    </tr>
  );
}
