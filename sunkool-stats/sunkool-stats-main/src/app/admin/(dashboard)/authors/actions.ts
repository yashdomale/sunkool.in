"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/blog/require-admin";
import { BLOG_CACHE_TAG } from "@/lib/supabase/static";
import { authorFormSchema, type AuthorFormValues } from "@/lib/blog/validation";

type ActionResult = { success: true } | { success: false; error: string };

// Bylines appear on public posts, which are cached by tag; expire them so an author change shows up straight away.
function revalidateAuthorPaths() {
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/admin/authors");
}

function toRow(values: AuthorFormValues) {
  return { name: values.name, avatar: values.avatar || null, bio: values.bio || null };
}

export async function createAuthor(values: AuthorFormValues): Promise<ActionResult> {
  const parsed = authorFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("authors").insert(toRow(parsed.data));
  if (error) return { success: false, error: error.message };

  revalidateAuthorPaths();
  return { success: true };
}

export async function updateAuthor(id: string, values: AuthorFormValues): Promise<ActionResult> {
  const parsed = authorFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("authors").update(toRow(parsed.data)).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateAuthorPaths();
  return { success: true };
}

export async function deleteAuthor(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.from("authors").delete().eq("id", id);
  revalidateAuthorPaths();
}
