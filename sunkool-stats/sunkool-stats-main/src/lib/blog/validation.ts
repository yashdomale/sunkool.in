import { z } from "zod";

const tiptapDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(z.unknown()).optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required").max(300),
  content: tiptapDocSchema,
  coverImage: z.string().url().optional().or(z.literal("")),
  authorId: z.string().uuid().optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  keywords: z.array(z.string()),
  faqs: z.array(faqSchema),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const authorFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  avatar: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
