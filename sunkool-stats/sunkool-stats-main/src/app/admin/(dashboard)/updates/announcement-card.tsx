"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/admin/badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { iconButtonClass, panelClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/lib/announcements/types";
import { AnnouncementForm } from "./announcement-form";
import { deleteAnnouncement, setAnnouncementPublished } from "./actions";
import { formatShortDate } from "@/lib/format-date";

// Vercel renders in UTC, so pin the zone or every timestamp would be off for the team in India.

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return <AnnouncementForm announcement={announcement} onDone={() => setEditing(false)} />;
  }

  const date = announcement.publishedAt ?? announcement.createdAt;

  return (
    <div
      className={cn(
        panelClass,
        "flex flex-col gap-4 p-5 transition-colors hover:border-white/15 sm:flex-row sm:items-start sm:justify-between"
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-white">{announcement.title}</p>
          <StatusBadge status={announcement.published ? "published" : "draft"} />
        </div>
        {announcement.body && (
          <p className="mt-1.5 max-w-2xl whitespace-pre-line text-xs leading-relaxed text-fog">{announcement.body}</p>
        )}
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-fog/70">
          {announcement.published ? "Live since" : "Created"} {formatShortDate(date)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await setAnnouncementPublished(announcement.id, !announcement.published);
              router.refresh();
            })
          }
          className={iconButtonClass}
          aria-label={announcement.published ? `Hide ${announcement.title}` : `Show ${announcement.title}`}
          title={announcement.published ? "Hide from the Updates page" : "Show on the Updates page"}
        >
          {announcement.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button onClick={() => setEditing(true)} className={iconButtonClass} aria-label={`Edit ${announcement.title}`}>
          <Pencil className="h-4 w-4" />
        </button>
        <ConfirmButton
          label="Delete"
          variant="danger"
          message={`Delete "${announcement.title}"? It will disappear from the Updates page.`}
          onConfirm={async () => {
            await deleteAnnouncement(announcement.id);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
