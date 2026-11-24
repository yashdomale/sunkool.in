// Lets `node --test` run the project's pure TypeScript modules without a
// bundler: Node 24 strips the types itself, and this hook adds the two things
// it doesn't do — the "@/" path alias from tsconfig.json and extensionless
// relative imports (which Next/TypeScript allow but Node's ESM resolver doesn't).
// Used by `npm test`; not part of the app build.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

function withTsExtension(base) {
  for (const candidate of [`${base}.ts`, path.join(base, "index.ts")]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let base = null;
    if (specifier.startsWith("@/")) {
      base = path.join(srcDir, specifier.slice(2));
    } else if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !path.extname(specifier) &&
      context.parentURL?.startsWith("file:")
    ) {
      const parent = fileURLToPath(context.parentURL);
      if (parent.startsWith(srcDir)) base = path.resolve(path.dirname(parent), specifier);
    }

    const resolved = base && withTsExtension(base);
    if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };

    // Next's own entry points ("next/cache", "next/navigation"…) are extensionless files that its
    // bundler resolves but Node's ESM resolver does not.
    const nextEntry = /^next\/[a-z-]+$/.exec(specifier) && path.join(root, "node_modules", `${specifier}.js`);
    if (nextEntry && existsSync(nextEntry)) return { url: pathToFileURL(nextEntry).href, shortCircuit: true };

    return nextResolve(specifier, context);
  },
});
