import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";

/**
 * Shared extension kit used by both the admin editor (client) and the
 * server-side JSON -> HTML renderer. Keeping these in sync is required —
 * content saved with one set of extensions must render with the same set.
 * StarterKit (v3) already bundles Link and Underline, so they're configured
 * here rather than added a second time (which throws a duplicate-name error).
 */
export function getTiptapExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      link: {
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      },
    }),
    Image,
    TableKit.configure({ table: { resizable: false } }),
  ];
}
