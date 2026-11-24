import { z } from "zod";

export const announcementFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Keep the title under 120 characters"),
  body: z.string().trim().max(1000, "Keep the message under 1000 characters"),
  published: z.boolean(),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

/**
 * The published_at to store when an announcement is saved. Hiding it clears the date, a first
 * publish stamps `now`, and re-saving something already live keeps its original date so editing a
 * typo doesn't bump it back to "new".
 */
export function resolvePublishedAt(
  current: { published: boolean; publishedAt: string | null } | null,
  nextPublished: boolean,
  now: string = new Date().toISOString()
): string | null {
  if (!nextPublished) return null;
  return current?.published && current.publishedAt ? current.publishedAt : now;
}
