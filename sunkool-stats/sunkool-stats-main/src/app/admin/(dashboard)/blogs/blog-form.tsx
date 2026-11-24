"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { FormField, Input, Textarea, Select } from "@/components/admin/form";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { createClient } from "@/lib/supabase/client";
import { toActionPayload } from "@/lib/blog/action-payload";
import { postFormSchema, slugify, type PostFormValues } from "@/lib/blog/validation";
import type { LinkDestination } from "@/lib/blog/internal-links/types";
import type { Author, Category, Post } from "@/lib/blog/types";
import { createPost, updatePost } from "./actions";

export function BlogForm({
  post,
  categories,
  authors,
  linkDestinations,
}: {
  post?: Post;
  categories: Category[];
  authors: Author[];
  linkDestinations: LinkDestination[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [uploadingCover, setUploadingCover] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? "",
          authorId: post.author?.id ?? "",
          categoryId: post.category?.id ?? "",
          status: post.status,
          featured: post.featured,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          keywords: post.keywords,
          faqs: post.faqs,
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: { type: "doc", content: [] },
          coverImage: "",
          authorId: "",
          categoryId: "",
          status: "draft",
          featured: false,
          metaTitle: "",
          metaDescription: "",
          keywords: [],
          faqs: [],
        },
  });

  const faqArray = useFieldArray({ control, name: "faqs" });
  const coverImage = watch("coverImage");
  const slug = watch("slug");

  async function onSubmit(status: "draft" | "published", values: PostFormValues) {
    setFormError(null);
    const payload = toActionPayload(values, status);

    startTransition(async () => {
      const result = post
        ? await updatePost(post.id, payload)
        : await createPost(payload);

      if (!result.success) {
        setFormError(result.error);
        return;
      }
      router.push("/admin/blogs");
      router.refresh();
    });
  }

  async function uploadCoverImage(file: File) {
    setUploadingCover(true);
    const supabase = createClient();
    const path = `covers/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    setUploadingCover(false);
    if (error) {
      alert(`Cover image upload failed: ${error.message}`);
      return;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setValue("coverImage", data.publicUrl, { shouldValidate: true });
  }

  return (
    <form className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <FormField label="Title" htmlFor="title" error={errors.title?.message}>
          <Input
            id="title"
            {...register("title", {
              onChange: (e) => {
                if (!slugTouched) setValue("slug", slugify(e.target.value));
              },
            })}
          />
        </FormField>

        <FormField label="Slug" htmlFor="slug" error={errors.slug?.message} hint="Used in the URL: /blog/your-slug">
          <Input id="slug" {...register("slug", { onChange: () => setSlugTouched(true) })} />
        </FormField>

        <FormField label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message} hint="Shown on the blog listing and as the default meta description">
          <Textarea id="excerpt" rows={3} {...register("excerpt")} />
        </FormField>

        <FormField label="Content" error={errors.content?.message}>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <TiptapEditor
                value={field.value}
                onChange={field.onChange}
                linkDestinations={linkDestinations}
                selfId={post?.id}
                selfSlug={slug}
              />
            )}
          />
        </FormField>

        <div className="rounded-2xl border border-white/10 bg-carbon-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">FAQs (optional)</h3>
            <button
              type="button"
              onClick={() => faqArray.append({ question: "", answer: "" })}
              className="flex items-center gap-1.5 text-xs text-electric hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
          </div>
          {faqArray.fields.length === 0 && (
            <p className="text-sm text-fog">Adds a FAQ section + FAQPage structured data to the post.</p>
          )}
          <div className="flex flex-col gap-4">
            {faqArray.fields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-fog">FAQ {index + 1}</span>
                  <button type="button" onClick={() => faqArray.remove(index)} className="text-fog hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <Input placeholder="Question" {...register(`faqs.${index}.question` as const)} />
                  <Textarea placeholder="Answer" rows={2} {...register(`faqs.${index}.answer` as const)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-white/10 bg-carbon-2 p-5">
          <h3 className="mb-4 text-sm font-medium text-white">Publish</h3>
          {formError && <p className="mb-3 text-sm text-red-400">{formError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit((values) => onSubmit("draft", values))}
              className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-sm text-white disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit((values) => onSubmit("published", values))}
              className="flex-1 rounded-full bg-electric px-4 py-2.5 text-sm font-medium text-black disabled:opacity-50"
            >
              {post?.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-carbon-2 p-5">
          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" {...register("featured")} className="h-4 w-4 accent-electric" />
            Featured post
          </label>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-carbon-2 p-5">
          <FormField label="Category" htmlFor="categoryId">
            <Select id="categoryId" {...register("categoryId")}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Author" htmlFor="authorId">
            <Select id="authorId" {...register("authorId")}>
              <option value="">No author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Cover image">
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="" className="mb-2 aspect-video w-full rounded-lg object-cover" />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingCover}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadCoverImage(file);
              }}
              className="text-xs text-fog file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
            />
          </FormField>

          <FormField label="Keywords" hint="Comma separated">
            <Input
              defaultValue={post?.keywords.join(", ") ?? ""}
              onChange={(e) =>
                setValue(
                  "keywords",
                  e.target.value.split(",").map((k) => k.trim()).filter(Boolean)
                )
              }
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-carbon-2 p-5">
          <h3 className="text-sm font-medium text-white">SEO</h3>
          <FormField label="Meta title" htmlFor="metaTitle" error={errors.metaTitle?.message} hint="Falls back to the post title">
            <Input id="metaTitle" {...register("metaTitle")} />
          </FormField>
          <FormField label="Meta description" htmlFor="metaDescription" error={errors.metaDescription?.message} hint="Falls back to the excerpt">
            <Textarea id="metaDescription" rows={3} {...register("metaDescription")} />
          </FormField>
        </div>
      </div>
    </form>
  );
}
