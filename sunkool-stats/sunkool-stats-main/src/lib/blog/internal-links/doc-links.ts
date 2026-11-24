import { toSitePath } from "./urls";

/**
 * Every link in a Tiptap JSON document. Link marks with no href (some
 * imported posts have them) point nowhere, so they're skipped rather than
 * treated as links.
 */
export function collectLinkHrefs(doc: unknown): string[] {
  const hrefs: string[] = [];
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const { marks, content } = node as { marks?: unknown; content?: unknown };
    if (Array.isArray(marks)) {
      for (const mark of marks as { type?: unknown; attrs?: { href?: unknown } }[]) {
        const href = mark?.attrs?.href;
        if (mark?.type === "link" && typeof href === "string" && href.trim()) hrefs.push(href);
      }
    }
    if (Array.isArray(content)) content.forEach(visit);
  };
  visit(doc);
  return hrefs;
}

/** The distinct on-site pages a document links to (query strings, hashes and trailing slashes ignored). */
export function collectSitePaths(doc: unknown): string[] {
  const paths = new Set<string>();
  for (const href of collectLinkHrefs(doc)) {
    const path = toSitePath(href);
    if (path) paths.add(path);
  }
  return [...paths];
}
