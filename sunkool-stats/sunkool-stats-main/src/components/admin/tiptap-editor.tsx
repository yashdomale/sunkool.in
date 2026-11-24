"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor, type JSONContent } from "@tiptap/react";
import type { TiptapDoc } from "@/lib/blog/types";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  LinkIcon,
  ImageIcon,
  TableIcon,
  Undo2,
  Redo2,
  Sparkles,
  X,
} from "lucide-react";
import { LinkDialog } from "@/components/admin/link-dialog";
import { LinkSuggestionsDialog } from "@/components/admin/link-suggestions-dialog";
import { createLinkShortcut, setLinkHighlight, type DocRange } from "@/components/admin/tiptap-link-shortcut";
import { addSuggestedLinks, linkAttrsFor } from "@/lib/blog/internal-links/apply";
import { collectSitePaths } from "@/lib/blog/internal-links/doc-links";
import { suggestInternalLinks } from "@/lib/blog/internal-links/suggest";
import type { LinkDestination, LinkSuggestion } from "@/lib/blog/internal-links/types";
import { getTiptapExtensions } from "@/lib/blog/tiptap-extensions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type LinkDialogState = {
  /** What was selected when the dialog opened; restored on cancel. */
  selection: DocRange;
  /** The text the link applies to (the whole link when the cursor was inside one). */
  range: DocRange;
  href: string;
  askForText: boolean;
  /** The selected text, to pre-fill the destination search. */
  selectedText: string;
  /** Site pages the post already links to, so the dialog can flag a repeat. */
  linkedPaths: string[];
};

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-fog transition-colors hover:bg-white/10 hover:text-white",
        active && "bg-electric/15 text-electric"
      )}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  value,
  onChange,
  linkDestinations,
  selfId,
  selfSlug,
}: {
  value: TiptapDoc;
  onChange: (value: TiptapDoc) => void;
  /** The pages and posts this post may link to. */
  linkDestinations: LinkDestination[];
  /** The post being edited (undefined until it is first saved), which it must never link to. */
  selfId?: string;
  selfSlug: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkDialog, setLinkDialog] = useState<LinkDialogState | null>(null);
  const [suggestions, setSuggestions] = useState<LinkSuggestion[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Shared by the Ctrl/⌘+K shortcut and the toolbar button. Only touches the
  // editor it's handed and a state setter, so it's safe to capture once.
  const openLinkDialog = useCallback((editor: Editor) => {
    if (editor.isActive("codeBlock")) return; // marks aren't allowed in code blocks
    const { from, to, empty } = editor.state.selection;
    const hasLink = Boolean(editor.getAttributes("link").href);
    // A bare cursor inside an existing link edits the whole link.
    if (empty && hasLink) editor.chain().extendMarkRange("link").run();
    const range = { from: editor.state.selection.from, to: editor.state.selection.to };
    setLinkHighlight(editor, range);
    setLinkDialog({
      selection: { from, to },
      range,
      href: (editor.getAttributes("link").href as string | undefined) ?? "",
      askForText: empty && !hasLink,
      selectedText: editor.state.doc.textBetween(range.from, range.to, " "),
      linkedPaths: collectSitePaths(editor.getJSON()),
    });
  }, []);
  const linkShortcut = useMemo(() => createLinkShortcut(openLinkDialog), [openLinkDialog]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...getTiptapExtensions(),
      Placeholder.configure({ placeholder: "Start writing your post…" }),
      linkShortcut,
    ],
    content: value as JSONContent,
    editorProps: {
      attributes: {
        // Links look the way they do on the published post (blue, underlined). Only anchors that have an
        // href are styled, so a link that lost its address can't pass for a working one.
        class:
          "prose-sunkool min-h-[400px] max-w-none outline-none px-5 py-4 [&_a[href]]:text-electric [&_a[href]]:underline [&_a[href]]:underline-offset-4 [&_a[href]:hover]:text-glow",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  async function uploadImage(file: File) {
    const supabase = createClient();
    const path = `posts/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      alert(`Image upload failed: ${error.message}`);
      return;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    editor?.chain().focus().setImage({ src: data.publicUrl }).run();
  }

  function closeLinkDialog() {
    if (editor && linkDialog) {
      setLinkHighlight(editor, null);
      editor.chain().focus().setTextSelection(linkDialog.selection).run();
    }
    setLinkDialog(null);
  }

  function applyLink({ href, text }: { href: string; text: string }) {
    if (!editor || !linkDialog) return;
    const { range, askForText } = linkDialog;
    setLinkHighlight(editor, null);
    // Links within this site open in the same tab and keep the referrer; others use the editor's defaults.
    const attrs = linkAttrsFor(editor.schema, href);
    if (askForText) {
      editor
        .chain()
        .focus()
        .insertContentAt(range.from, { type: "text", text, marks: [{ type: "link", attrs }] })
        .run();
    } else {
      editor.chain().focus().setTextSelection(range).setLink(attrs).run();
    }
    setLinkDialog(null);
  }

  /** Scans the post as it is now, including edits that haven't been saved. Changes nothing. */
  function findLinkSuggestions() {
    if (!editor) return;
    setNotice(null);
    setSuggestions(suggestInternalLinks(editor.state.doc, linkDestinations, { id: selfId, slug: selfSlug }));
  }

  /** Adds the approved links in one step, so a single undo takes them all back. Saving is still up to the editor. */
  function applySuggestions(approved: LinkSuggestion[]) {
    if (!editor) return;
    const tr = editor.state.tr;
    const { applied, skipped } = addSuggestedLinks(tr, approved);
    if (applied.length > 0) editor.view.dispatch(tr);
    setSuggestions(null);
    editor.commands.focus();

    const added = applied.length === 1 ? "1 internal link" : `${applied.length} internal links`;
    const left = skipped.length > 0 ? ` ${skipped.length} skipped because the text changed or is already linked.` : "";
    setNotice(
      applied.length > 0
        ? `${added} added to the editor. Nothing is saved or published until you save the post.${left}`
        : `No links were added.${left}`
    );
  }

  function removeLink() {
    if (!editor || !linkDialog) return;
    setLinkHighlight(editor, null);
    editor.chain().focus().setTextSelection(linkDialog.range).unsetLink().run();
    setLinkDialog(null);
  }

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => openLinkDialog(editor)}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Suggest internal links" onClick={findLinkSuggestions}>
          <Sparkles className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            e.target.value = "";
          }}
        />
        <div className="mx-1 h-5 w-px bg-white/10" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
      {notice && (
        <div role="status" className="flex items-start gap-3 border-b border-electric/20 bg-electric/[0.07] px-4 py-2.5 text-xs text-white">
          <span className="flex-1">{notice}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)} className="shrink-0 text-fog hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      {/* Marks the editor for the global Ctrl/⌘+K handler in the topbar, which stays out of its way. */}
      <div data-shortcut-scope="editor">
        <EditorContent editor={editor} />
      </div>
      {linkDialog && (
        <LinkDialog
          initialHref={linkDialog.href}
          selectedText={linkDialog.selectedText}
          askForText={linkDialog.askForText}
          destinations={linkDestinations}
          linkedPaths={linkDialog.linkedPaths}
          selfSlug={selfSlug}
          onSubmit={applyLink}
          onRemove={linkDialog.href ? removeLink : undefined}
          onClose={closeLinkDialog}
        />
      )}
      {suggestions && (
        <LinkSuggestionsDialog
          suggestions={suggestions}
          checkedCount={linkDestinations.filter((d) => d.status === "published").length}
          onApply={applySuggestions}
          onClose={() => {
            setSuggestions(null);
            editor.commands.focus();
          }}
        />
      )}
    </div>
  );
}
