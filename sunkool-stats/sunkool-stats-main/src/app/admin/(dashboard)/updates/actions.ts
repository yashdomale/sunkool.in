"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/blog/require-admin";
import { LATEST_UPDATE_TAG } from "@/lib/blog/latest-update";
import { ANNOUNCEMENTS_TAG } from "@/lib/announcements/types";
import {
  announcementFormSchema,
  resolvePublishedAt,
  type AnnouncementFormValues,
} from "@/lib/announcements/validation";

type ActionResult = { success: true } | { success: false; error: string };

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

/** The public Updates page, its cached list, and the nav's "New" highlight all read these. */
function refreshPublicPages() {
  revalidatePath("/admin/updates");
  revalidatePath("/blog");
  updateTag(ANNOUNCEMENTS_TAG);
  updateTag(LATEST_UPDATE_TAG);
}

async function currentPublishState(supabase: Supabase, id: string) {
  const { data } = await supabase.from("announcements").select("published, published_at").eq("id", id).maybeSingle();
  return data ? { published: data.published as boolean, publishedAt: data.published_at as string | null } : null;
}

export async function createAnnouncement(values: AnnouncementFormValues): Promise<ActionResult> {
  const parsed = announcementFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase } = await requireAdmin();
  const { title, body, published } = parsed.data;
  const { error } = await supabase
    .from("announcements")
    .insert({ title, body, published, published_at: resolvePublishedAt(null, published) });
  if (error) return { success: false, error: error.message };

  refreshPublicPages();
  return { success: true };
}

export async function updateAnnouncement(id: string, values: AnnouncementFormValues): Promise<ActionResult> {
  const parsed = announcementFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  const { supabase } = await requireAdmin();
  const { title, body, published } = parsed.data;
  const current = await currentPublishState(supabase, id);
  const { error } = await supabase
    .from("announcements")
    .update({ title, body, published, published_at: resolvePublishedAt(current, published) })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  refreshPublicPages();
  return { success: true };
}

export async function setAnnouncementPublished(id: string, published: boolean): Promise<void> {
  // Server actions can be POSTed with any arguments, so don't rely on the TypeScript type.
  if (typeof published !== "boolean") throw new Error("Invalid announcement state.");
  const { supabase } = await requireAdmin();
  const current = await currentPublishState(supabase, id);
  const { error } = await supabase
    .from("announcements")
    .update({ published, published_at: resolvePublishedAt(current, published) })
    .eq("id", id);
  if (error) throw new Error(error.message);
  refreshPublicPages();
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshPublicPages();
}
