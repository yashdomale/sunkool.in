// Guards the structured data (JSON-LD) of the city landing pages. Two failure modes were found in them:
//  1. URLs on the bare sunkool.in host. That host 308-redirects to www.sunkool.in (Search Console lists
//     those as "Page with redirect"), and every canonical, sitemap and schema URL on this site uses www.
//  2. www.sunkool.in URLs that do not exist (breadcrumbs to /window-film/<city>, image paths that 404).
// Both were copied into most city pages from the standalone city apps under cities/.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSitePaths } from "@/lib/blog/internal-links/site-pages";

const dir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dir, "../../../public");

function sourceFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [full] : [];
  });
}

/** Case-exact, because Vercel serves from a case-sensitive filesystem and a developer's Windows disk is not. */
function publicFileExists(urlPath: string): boolean {
  let current = publicDir;
  for (const segment of urlPath.split("/").filter(Boolean)) {
    if (!fs.existsSync(current) || !fs.readdirSync(current).includes(segment)) return false;
    current = path.join(current, segment);
  }
  return fs.statSync(current).isFile();
}

const files = sourceFiles(dir);

test("city pages never reference the non-canonical sunkool.in host", () => {
  assert.ok(files.length > 20, "expected to scan the city sources");
  for (const file of files) {
    const bad = fs.readFileSync(file, "utf8").match(/https?:\/\/sunkool\.in\b[^"'`\s)]*/g);
    assert.equal(bad, null, `${path.relative(dir, file)} uses ${bad?.[0]}; use https://www.sunkool.in`);
  }
});

// Known broken and deliberately left alone, so the test documents them instead of hiding them. Nagpur's
// JSON-LD (content/nagpur/copy/nagpur.ts) names /images/nagpur-hero.png, a file that has never been in
// public/; the page itself shows /images/cities/nagpur/nagpur.png. Changing it is an SEO content decision.
// This list must shrink: the test fails when an entry starts resolving, so delete it then.
const KNOWN_UNRESOLVED = new Set(["/images/nagpur-hero.png"]);

const IGNORED_FILES = new Set<string>();

function resolves(urlPath: string): boolean {
  const clean = urlPath.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  return getSitePaths().has(clean) || publicFileExists(clean);
}

test("every www.sunkool.in URL in the city structured data is a real page or file", () => {
  const seen = new Set<string>();
  for (const file of files) {
    if (IGNORED_FILES.has(path.relative(dir, file))) continue;
    const urls = fs.readFileSync(file, "utf8").match(/https:\/\/www\.sunkool\.in(\/[^"'`\s)]*)?/g) ?? [];
    for (const url of urls) {
      const urlPath = url.replace("https://www.sunkool.in", "") || "/";
      if (KNOWN_UNRESOLVED.has(urlPath)) {
        assert.equal(resolves(urlPath), false, `${urlPath} now resolves; remove it from KNOWN_UNRESOLVED`);
        continue;
      }
      assert.ok(resolves(urlPath), `${path.relative(dir, file)} references ${url}, which is not a route or a public file`);
      seen.add(urlPath);
    }
  }
  assert.ok(seen.size > 5, "expected to check some URLs");
});
