"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Input } from "@/components/admin/form";
import { panelClass, primaryButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/blog/validation";
import { createCategory } from "./actions";

export function NewCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await createCategory({ name, slug });
          if (!result.success) { setError(result.error); return; }
          setName("");
          setSlug("");
          setError(null);
          router.refresh();
        });
      }}
      className={cn(panelClass, "mb-6 p-5")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-fog">Name</label>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)); }}
            placeholder="e.g. Vehicle Care"
            required
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-fog">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </form>
  );
}
