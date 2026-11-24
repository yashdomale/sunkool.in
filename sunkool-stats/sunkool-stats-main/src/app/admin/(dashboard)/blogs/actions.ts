"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/blog/require-admin";
import { BLOG_CACHE_TAG } from "@/lib/supabase/static";
import { LATEST_UPDATE_TAG } from "@/lib/blog/latest-update";
import { checkInternalLinks } from "@/lib/blog/internal-links/server";
import { postFormSchema, type PostFormValues } from "@/lib/blog/validation";
import { estimateReadingTime } from "@/lib/blog/reading-time";
import type { PostStatus } from "@/lib/blog/types";

type ActionResult = { success: true; id: string } | { success: false; error: string };

function toRow(values: PostFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content: values.content,
    cover_image: values.coverImage || null,
    author_id: values.authorId || null,
    category_id: values.categoryId || null,
    status: values.status,
    featured: values.featured,
    meta_title: values.metaTitle || null,
    meta_description: values.metaDescription || null,
    keywords: values.keywords,
    faqs: values.faqs,
    reading_time: estimateReadingTime(values.content),
  };
}

function revalidateBlogPaths(slug?: string) {
  // The public blog reads are cached by tag; expire them now so the admin sees the change straight away.
  updateTag(BLOG_CACHE_TAG);
  // The nav's "New" badge on Updates reads the latest publish time on every page.
  updateTag(LATEST_UPDATE_TAG);
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPost(values: PostFormValues): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { supabase } = await requireAdmin();
  const linkError = await checkInternalLinks(supabase, {
    next: parsed.data.content,
    selfSlug: parsed.data.slug,
    publishing: parsed.data.status === "published",
  });
  if (linkError) return { success: false, error: linkError };

  const { data, error } = await supabase
    .from("posts")
    .insert(toRow(parsed.data))
    .select("id, slug")
    .single();

  if (error) {
    return { success: false, error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  revalidateBlogPaths(data.slug);
  return { success: true, id: data.id };
}

export async function updatePost(id: string, values: PostFormValues): Promise<ActionResult> {
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { supabase } = await requireAdmin();
  const { data: stored } = await supabase.from("posts").select("status, content").eq("id", id).maybeSingle();
  const linkError = await checkInternalLinks(supabase, {
    next: parsed.data.content,
    stored,
    selfId: id,
    selfSlug: parsed.data.slug,
    publishing: parsed.data.status === "published",
  });
  if (linkError) return { success: false, error: linkError };

  const { data, error } = await supabase
    .from("posts")
    .update(toRow(parsed.data))
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) {
    return { success: false, error: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  revalidateBlogPaths(data.slug);
  return { success: true, id: data.id };
}

/** Copies a post as a fresh draft: no views, not featured, with a free "-copy" slug. */
export async function duplicatePost(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { data: source, error: readError } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (readError || !source) return { success: false, error: readError?.message ?? "That post no longer exists." };

  const copy = {
    title: `${source.title} (Copy)`,
    excerpt: source.excerpt,
    content: source.content,
    cover_image: source.cover_image,
    author_id: source.author_id,
    category_id: source.category_id,
    status: "draft" as const,
    featured: false,
    meta_title: source.meta_title,
    meta_description: source.meta_description,
    keywords: source.keywords,
    faqs: source.faqs,
    reading_time: source.reading_time,
  };

  for (let attempt = 1; attempt <= 5; attempt++) {
    const slug = attempt === 1 ? `${source.slug}-copy` : `${source.slug}-copy-${attempt}`;
    const { data, error } = await supabase.from("posts").insert({ ...copy, slug }).select("id, slug").single();
    if (!error) {
      revalidateBlogPaths(data.slug);
      return { success: true, id: data.id };
    }
    // 23505 = the slug is taken; anything else won't be fixed by trying another.
    if (error.code !== "23505") return { success: false, error: error.message };
  }
  return { success: false, error: "Couldn't find a free slug for the copy." };
}

export async function deletePost(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("slug").eq("id", id).maybeSingle();
  await supabase.from("posts").delete().eq("id", id);
  revalidateBlogPaths(data?.slug);
}

export async function setPostStatus(id: string, status: PostStatus): Promise<void> {
  // Server actions can be POSTed with any arguments, so don't rely on the TypeScript type.
  if (status !== "draft" && status !== "published") throw new Error("Invalid post status.");
  const { supabase } = await requireAdmin();

  // Publishing a draft is the moment its links go live, so it gets the same link check as the
  // editor's Publish button. It throws rather than publishing; the status is left unchanged.
  if (status === "published") {
    const { data: stored } = await supabase.from("posts").select("slug, status, content").eq("id", id).maybeSingle();
    if (stored && stored.status !== "published") {
      const linkError = await checkInternalLinks(supabase, {
        next: stored.content,
        stored,
        selfId: id,
        selfSlug: stored.slug,
        publishing: true,
      });
      if (linkError) throw new Error(linkError);
    }
  }

  const { data } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .single();
  revalidateBlogPaths(data?.slug);
}
