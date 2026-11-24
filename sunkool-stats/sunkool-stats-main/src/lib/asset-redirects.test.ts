// Guards the image redirects in asset-redirects.ts: a source must no longer exist in public/
// (a real file would never be reached by the redirect and the rule is dead), every destination
// must exist, destinations are never redirected again, and nothing in src/ still uses an old URL.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assetRedirects } from "./asset-redirects";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const inPublic = (url: string) => fs.existsSync(path.join(root, "public", url));

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return /\.(tsx?|css|json|mdx)$/.test(e.name) && !e.name.endsWith(".test.ts") ? [p] : [];
  });
}

test("every asset redirect points from a removed file to an existing one", () => {
  for (const { source, destination } of assetRedirects) {
    assert.ok(!inPublic(source), `${source} still exists in public/`);
    assert.ok(inPublic(destination), `${destination} is missing from public/`);
  }
});

test("asset redirects have unique sources and no chains", () => {
  const sources = assetRedirects.map((r) => r.source);
  assert.equal(new Set(sources).size, sources.length);
  for (const { destination } of assetRedirects) assert.ok(!sources.includes(destination), `${destination} is redirected again`);
});

test("no source file still references a redirected image URL", () => {
  const self = path.join(root, "src/lib/asset-redirects.ts");
  const files = sourceFiles(path.join(root, "src")).filter((f) => f !== self);
  for (const { source } of assetRedirects) {
    const pattern = new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z0-9_.-])");
    const hit = files.find((f) => pattern.test(fs.readFileSync(f, "utf8")));
    assert.equal(hit, undefined, `${source} is still used in ${hit}`);
  }
});
