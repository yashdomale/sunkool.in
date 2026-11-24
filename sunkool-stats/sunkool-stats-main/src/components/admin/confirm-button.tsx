"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onClose,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  variant = "default",
}: {
  open: boolean;
  onClose: () => void;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  variant?: "default" | "danger";
}) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-carbon-2 bg-linear-to-b from-white/[0.04] to-transparent p-6 shadow-2xl"
      >
        <p className="text-sm leading-relaxed text-white">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-fog transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await onConfirm();
                onClose();
              })
            }
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              variant === "danger" ? "bg-red-500/90 text-white hover:bg-red-500" : "bg-electric text-black hover:bg-glow",
              isPending && "opacity-60"
            )}
          >
            {isPending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmButton({
  label,
  confirmLabel = "Confirm",
  message,
  onConfirm,
  className,
  variant = "default",
}: {
  label: ReactNode;
  confirmLabel?: string;
  message: string;
  onConfirm: () => Promise<void>;
  className?: string;
  variant?: "default" | "danger";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg border border-electric/20! bg-electric/[0.04] px-3 py-1.5 text-xs font-medium text-fog transition-colors hover:border-electric/50! hover:bg-electric/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric",
          variant === "danger" && "hover:border-red-400/50! hover:bg-red-500/10 hover:text-red-400",
          className
        )}
      >
        {label}
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        message={message}
        confirmLabel={confirmLabel}
        onConfirm={onConfirm}
        variant={variant}
      />
    </>
  );
}
