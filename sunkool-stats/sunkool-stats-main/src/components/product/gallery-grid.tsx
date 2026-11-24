"use client";

import { motion } from "motion/react";
import { MediaSlot, MEDIA_SIZES_GALLERY } from "@/components/media/media-slot";

/** The masonry grid of install photos with captions under a product page's gallery heading. */
export function GalleryGrid({
  items,
  accent,
}: {
  items: readonly { src: string; caption: string; fileHint: string }[];
  /** Placeholder accent while a photo is missing. */
  accent: string;
}) {
  return (
    <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item, i) => (
        <motion.div
          key={item.src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.6 }}
          className="mb-4 break-inside-avoid"
        >
          <MediaSlot
            src={item.src}
            alt={item.caption}
            aspect="3/2"
            accent={accent}
            label={item.caption}
            fileHint={item.fileHint}
            sizes={MEDIA_SIZES_GALLERY}
            zoomOnHover
            className="rounded-2xl"
          />
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white">{item.caption}</p>
        </motion.div>
      ))}
    </div>
  );
}
