"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Textarea } from "@/components/admin/form";
import { ghostButtonClass, panelClass, primaryButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/lib/announcements/types";
import { createAnnouncement, updateAnnouncement } from "./actions";

export function AnnouncementForm({ announcement, onDone }: { announcement?: Announcement; onDone?: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [body, setBody] = useState(announcement?.body ?? "");
  const [published, setPublished] = useState(announcement?.published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const values = { title, body, published };
          const result = announcement ? await updateAnnouncement(announcement.id, values) : await createAnnouncement(values);
          if (!result.success) { setError(result.error); return; }
          setError(null);
          if (!announcement) { setTitle(""); setBody(""); setPublished(true); }
          router.refresh();
          onDone?.();
        });
      }}
      className={cn(panelClass, "flex flex-col gap-5 p-5 sm:p-6")}
    >
      {!announcement && <p className="text-sm font-medium text-white">Add a new announcement</p>}
      <FormField label="Title" htmlFor={`announcement-title-${announcement?.id ?? "new"}`}>
        <Input
          id={`announcement-title-${announcement?.id ?? "new"}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="e.g. Sunkool now installs in Pune"
          required
        />
      </FormField>
      <FormField
        label="Message"
        htmlFor={`announcement-body-${announcement?.id ?? "new"}`}
        hint="Optional. Shown under the title on the Updates page."
      >
        <Textarea
          id={`announcement-body-${announcement?.id ?? "new"}`}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
        />
      </FormField>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-electric)]"
        />
        Show on the Updates page
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {announcement ? "Save" : "Add announcement"}
        </button>
        {announcement && (
          <button type="button" onClick={onDone} className={ghostButtonClass}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
