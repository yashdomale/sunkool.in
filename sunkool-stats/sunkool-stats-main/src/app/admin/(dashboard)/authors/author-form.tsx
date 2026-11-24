"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/admin/form";
import { panelClass, primaryButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createAuthor, updateAuthor } from "./actions";
import type { Author } from "@/lib/blog/types";

export function AuthorForm({ author, onDone }: { author?: Author; onDone?: () => void }) {
  const router = useRouter();
  const [name, setName] = useState(author?.name ?? "");
  const [bio, setBio] = useState(author?.bio ?? "");
  const [avatar, setAvatar] = useState(author?.avatar ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function uploadAvatar(file: File) {
    setUploading(true);
    const supabase = createClient();
    const path = `authors/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    setUploading(false);
    if (error) { alert(`Upload failed: ${error.message}`); return; }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setAvatar(data.publicUrl);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const values = { name, bio, avatar };
          const result = author ? await updateAuthor(author.id, values) : await createAuthor(values);
          if (!result.success) { setError(result.error); return; }
          setError(null);
          if (!author) { setName(""); setBio(""); setAvatar(""); }
          router.refresh();
          onDone?.();
        });
      }}
      className={cn(panelClass, "flex flex-col gap-5 p-5 sm:p-6")}
    >
      <div className="flex flex-wrap items-center gap-4">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/20 text-[10px] uppercase tracking-wider text-fog">
            Photo
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.15em] text-fog">Profile image</label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }}
            className="text-xs text-fog file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-white/10 file:bg-white/[0.06] file:px-3.5 file:py-1.5 file:text-xs file:font-medium file:text-white file:transition-colors hover:file:bg-white/10"
          />
          {uploading && <p className="text-xs text-electric">Uploading…</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-fog">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-fog">Bio</label>
        <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button type="submit" disabled={isPending} className={cn(primaryButtonClass, "self-start")}>
        {author ? "Save" : "Add author"}
      </button>
    </form>
  );
}
