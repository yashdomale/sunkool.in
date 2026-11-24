// Shows the assistant's text safely. This makes the links a reply mentions clickable, but only for
// our own sites and WhatsApp - any other address stays plain text, so a reply can never carry a
// visitor to somewhere we did not choose. Dependency-free (client bundle).

export type Segment = { type: "text"; text: string } | { type: "link"; text: string; href: string };

const ALLOWED_HOSTS = new Set(["www.sunkool.in", "sunkool.in", "w.sunkool.in", "wa.me"]);
const URL_PATTERN = /https?:\/\/[^\s<>"]+/g;
// Punctuation that ends a sentence rather than an address.
const TRAILING = /[.,;:!?)\]'"]+$/;

export function linkify(text: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    const raw = match[0];
    const url = raw.replace(TRAILING, "");
    let href: string | null = null;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" && ALLOWED_HOSTS.has(parsed.hostname)) href = parsed.toString();
    } catch {
      // Not an address after all: leave it as text.
    }
    if (!href) continue;
    if (start > last) segments.push({ type: "text", text: text.slice(last, start) });
    segments.push({ type: "link", text: url, href });
    last = start + url.length;
  }
  if (last < text.length) segments.push({ type: "text", text: text.slice(last) });
  return segments.length > 0 ? segments : [{ type: "text", text }];
}
