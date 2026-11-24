import { Extension, type Editor } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export type DocRange = { from: number; to: number };

const highlightKey = new PluginKey<DocRange | null>("linkHighlight");

/**
 * The link dialog owns focus while it's open, so the browser stops painting
 * the editor's selection. This keeps the text being linked visibly selected
 * until the dialog closes (pass null to clear).
 */
export function setLinkHighlight(editor: Editor, range: DocRange | null) {
  editor.view.dispatch(editor.state.tr.setMeta(highlightKey, range));
}

/**
 * Ctrl/⌘+K inside the editor. Returning true from the handler makes
 * ProseMirror call preventDefault on the keydown, so the browser's own
 * Ctrl+K never fires. It's editor-only (not in getTiptapExtensions) because
 * the server-side renderer shares that list and has no UI to open.
 */
export function createLinkShortcut(onOpen: (editor: Editor) => void) {
  return Extension.create({
    name: "linkShortcut",

    addKeyboardShortcuts() {
      return {
        "Mod-k": ({ editor }) => {
          onOpen(editor);
          return true;
        },
      };
    },

    addProseMirrorPlugins() {
      return [
        new Plugin<DocRange | null>({
          key: highlightKey,
          state: {
            init: () => null,
            apply: (tr, value) => {
              const meta = tr.getMeta(highlightKey) as DocRange | null | undefined;
              return meta === undefined ? value : meta;
            },
          },
          props: {
            decorations(state) {
              const range = highlightKey.getState(state);
              if (!range || range.from >= range.to) return null;
              return DecorationSet.create(state.doc, [
                Decoration.inline(range.from, range.to, {
                  style: "background-color: rgb(88 167 232 / 0.35); border-radius: 2px;",
                }),
              ]);
            },
          },
        }),
      ];
    },
  });
}
