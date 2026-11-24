// Regression: a link applied with Ctrl+K was saved without its address, so after saving it was
// neither blue nor clickable. The cause was the editor's JSON crossing the Server Action boundary
// (see action-payload.ts), which no test covered because the action tests call updatePost()
// directly with plain objects. These tests push the real payload through React's own encoder —
// the code Next runs in the browser for `updatePost(...)`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { toActionPayload } from "./action-payload";
import { heading, linked, makeDoc, para } from "./internal-links/test-helpers";
import type { PostFormValues } from "./validation";

type Encoder = {
  encodeReply(value: unknown, options: { temporaryReferences: unknown }): Promise<string | FormData>;
  createTemporaryReferenceSet(): unknown;
};
const react = createRequire(import.meta.url)("next/dist/compiled/react-server-dom-webpack/client.edge") as Encoder;

const ADDRESS = "https://www.sunkool.in";

/** What `editor.getJSON()` returns: ProseMirror's own node/mark attrs objects, which have no prototype. */
const editorJson = () =>
  makeDoc(heading("Why Sunkool", 2), para("Visit ", linked("Sunkool", ADDRESS), " today.")).toJSON() as PostFormValues["content"];

const form = (content: PostFormValues["content"]): PostFormValues => ({
  title: "A title", slug: "a-post", excerpt: "An excerpt", content, coverImage: "", authorId: "", categoryId: "",
  status: "draft", featured: false, metaTitle: "", metaDescription: "", keywords: [], faqs: [],
});

/** The request body the browser sends for these Server Action arguments. */
async function wire(args: unknown[]): Promise<string> {
  const body = await react.encodeReply(args, { temporaryReferences: react.createTemporaryReferenceSet() });
  return typeof body === "string" ? body : JSON.stringify([...body.entries()]);
}

test("the editor's link address and heading level reach the server action", async () => {
  const sent = await wire(["post-id", toActionPayload(form(editorJson()), "published")]);
  assert.ok(sent.includes(ADDRESS), "link href must be in the request body");
  assert.ok(sent.includes('"level":2'), "heading level must be in the request body");
  assert.ok(!sent.includes("$T"), "no attrs may be replaced by temporary client references");
});

test("control: the editor's own JSON does not survive the transport, which is why the payload is copied", async () => {
  // This is what the form used to send. If it ever starts passing, React or ProseMirror changed
  // and toActionPayload may no longer be needed — but the test above must keep passing either way.
  const sent = await wire(["post-id", { ...form(editorJson()), status: "published" }]);
  assert.ok(!sent.includes(ADDRESS), "the raw editor JSON loses the link href");
  assert.ok(sent.includes("$T"), "its attrs are sent as temporary client references");
});

test("the payload is the same post, with the chosen status and an unchanged document", () => {
  const original = form(editorJson());
  const before = JSON.stringify(original);
  const payload = toActionPayload(original, "published");

  assert.equal(payload.status, "published");
  assert.deepEqual(payload.content, JSON.parse(before).content);
  assert.equal(payload.title, original.title);
  assert.equal(JSON.stringify(original), before, "the form's own values are not modified");
  assert.notEqual(payload.content, original.content, "content is a copy, not the editor's objects");

  // Every attrs object in the copy is a plain object, so it can cross the transport.
  const visit = (node: unknown) => {
    const { attrs, marks, content } = node as { attrs?: object; marks?: { attrs?: object }[]; content?: unknown[] };
    for (const found of [attrs, ...(marks ?? []).map((mark) => mark.attrs)]) {
      if (found) assert.equal(Object.getPrototypeOf(found), Object.prototype);
    }
    content?.forEach(visit);
  };
  visit(payload.content);
});
