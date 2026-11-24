import { test } from "node:test";
import assert from "node:assert/strict";
import { absoluteUrl } from "./absolute-url";

const BASE = "https://www.sunkool.in";
const SUPABASE_COVER =
  "https://evmnxnymzsptkgciaftd.supabase.co/storage/v1/object/public/blog-images/covers/05654329-Toyota_Glanza.png";

test("a full Supabase Storage URL is returned untouched, never prefixed with the site origin", () => {
  assert.equal(absoluteUrl(SUPABASE_COVER, BASE), SUPABASE_COVER);
  assert.equal(absoluteUrl("http://cdn.example.com/a.png", BASE), "http://cdn.example.com/a.png");
});

test("a site-relative path gets the site origin", () => {
  assert.equal(
    absoluteUrl("/blog/restored/window-tint-laws-india.jpg", BASE),
    "https://www.sunkool.in/blog/restored/window-tint-laws-india.jpg"
  );
  assert.equal(absoluteUrl("blog/x.png", BASE), "https://www.sunkool.in/blog/x.png");
});

test("surrounding whitespace is ignored and path characters are percent-encoded", () => {
  assert.equal(absoluteUrl("  " + SUPABASE_COVER + " ", BASE), SUPABASE_COVER);
  assert.equal(absoluteUrl("/blog/a b.png", BASE), "https://www.sunkool.in/blog/a%20b.png");
});

test("a protocol-relative URL keeps its own host", () => {
  assert.equal(absoluteUrl("//cdn.example.com/a.png", BASE), "https://cdn.example.com/a.png");
});
