import { generateHTML } from "@tiptap/html/server";
import { getSchema } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { getTiptapExtensions } from "./tiptap-extensions";
import { addSuggestedLinks } from "./internal-links/apply";
import { contextualDestinations } from "./internal-links/contextual";
import { suggestInternalLinks } from "./internal-links/suggest";
import type { LinkDestination, LinkSource } from "./internal-links/types";

type PublicLinks = { source: LinkSource; destinations: LinkDestination[] };

/** Renders stored content, optionally adding contextual links to published posts. */
export function tiptapJsonToHtml(content: unknown, links?: PublicLinks): string {
  if (!content || typeof content !== "object") return "";
  try {
    const extensions = getTiptapExtensions();
    let document = content as Record<string, unknown>;
    const destinations = links ? contextualDestinations(links.source.slug, links.destinations) : [];

    if (links && destinations.length > 0) {
      const schema = getSchema(extensions);
      const doc = ProseMirrorNode.fromJSON(schema, document);
      const suggestions = suggestInternalLinks(doc, destinations, links.source, { limit: 4, perParagraph: 2 });
      const transaction = EditorState.create({ doc }).tr;
      addSuggestedLinks(transaction, suggestions);
      document = transaction.doc.toJSON();
    }

    // The generated <a> elements are part of the initial article HTML. No
    // client script, editor save, or database update is needed to expose them.
    return generateHTML(document, extensions);
  } catch {
    return "";
  }
}
