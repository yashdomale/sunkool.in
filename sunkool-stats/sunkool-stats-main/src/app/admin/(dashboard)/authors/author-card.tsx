"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { iconButtonClass, panelClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { AuthorForm } from "./author-form";
import { deleteAuthor } from "./actions";
import type { Author } from "@/lib/blog/types";

export function AuthorCard({ author }: { author: Author }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <AuthorForm author={author} onDone={() => setEditing(false)} />;
  }

  return (
    <div
      className={cn(
        panelClass,
        "flex flex-col gap-4 p-5 transition-colors hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        {author.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={author.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-electric/20 bg-electric/10 text-sm font-semibold text-electric">
            {author.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{author.name}</p>
          {author.bio && <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-fog">{author.bio}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button onClick={() => setEditing(true)} className={iconButtonClass} aria-label={`Edit ${author.name}`}>
          <Pencil className="h-4 w-4" />
        </button>
        <ConfirmButton
          label="Delete"
          variant="danger"
          message={`Delete "${author.name}"? Posts by them will show no author.`}
          onConfirm={async () => {
            await deleteAuthor(author.id);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
