// Shared by the *.test.ts files next to it. Builds documents with the real
// editor schema (the same extension list the editor and public renderer use).
import { getSchema } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { getTiptapExtensions } from "@/lib/blog/tiptap-extensions";
import type { LinkDestination } from "./types";

export const schema = getSchema(getTiptapExtensions());

type Mark = { type: string; attrs?: Record<string, unknown> };
export type Part = string | { text: string; marks?: Mark[] };

const textNodes = (parts: Part[]) =>
  parts.map((part) => (typeof part === "string" ? { type: "text", text: part } : { type: "text", text: part.text, marks: part.marks }));

export const para = (...parts: Part[]) => ({ type: "paragraph", content: textNodes(parts) });
export const heading = (text: string, level = 2) => ({ type: "heading", attrs: { level }, content: textNodes([text]) });
export const codeBlock = (text: string) => ({ type: "codeBlock", content: textNodes([text]) });
export const bold = (text: string): Part => ({ text, marks: [{ type: "bold" }] });
export const linked = (text: string, href: string): Part => ({ text, marks: [{ type: "link", attrs: { href } }] });

export const docJson = (...blocks: unknown[]) => ({ type: "doc", content: blocks });
export const makeDoc = (...blocks: unknown[]) => ProseMirrorNode.fromJSON(schema, docJson(...blocks));

export function post(
  title: string,
  slug: string,
  extra: Partial<LinkDestination> = {}
): LinkDestination {
  return {
    kind: "post",
    href: `/blog/${slug}`,
    title,
    description: "",
    keywords: [],
    status: "published",
    group: "Guides",
    id: `id-${slug}`,
    ...extra,
  };
}

export function pageDestination(href: string, title: string, keywords: string[]): LinkDestination {
  return { kind: "page", href, title, description: "", keywords, status: "published", group: "Page" };
}
