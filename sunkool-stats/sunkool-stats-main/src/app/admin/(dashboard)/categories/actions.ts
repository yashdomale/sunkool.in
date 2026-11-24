"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/blog/require-admin";
import { BLOG_CACHE_TAG } from "@/lib/supabase/static";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/blog/validation";

type ActionResult = { success: true } | { success: false; error: string };

// The public blog reads are cached by tag; expire them so a category change shows up straight away.
function revalidateCategoryPaths() {
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
}

export async function createCategory(values: CategoryFormValues): Promise<ActionResult> {
  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) return { success: false, error: error.code === "23505" ? "That slug is already in use." : error.message };

  revalidateCategoryPaths();
  return { success: true };
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<ActionResult> {
  const parsed = categoryFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.code === "23505" ? "That slug is already in use." : error.message };

  revalidateCategoryPaths();
  return { success: true };
}

export async function deleteCategory(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.from("categories").delete().eq("id", id);
  revalidateCategoryPaths();
}
