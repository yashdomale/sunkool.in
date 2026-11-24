const WORDS_PER_MINUTE = 200;

/** Estimates reading time (minutes, min 1) from a Tiptap JSON document's text content. */
export function estimateReadingTime(content: unknown): number {
  const text = extractText(content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  if (typeof n.text === "string") return n.text;
  if (Array.isArray(n.content)) {
    return n.content.map(extractText).join(" ");
  }
  return "";
}
