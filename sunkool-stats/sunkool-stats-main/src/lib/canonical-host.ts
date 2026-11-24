// Host rules applied by src/proxy.ts on every request:
//
// - sunkool.in (the bare apex) 308-redirects to https://www.sunkool.in, path and query kept.
// - www.sunkool.in is the production site and is served as-is.
// - Every other host (the project's *.vercel.app production alias, preview deployment URLs, any
//   future alias) is served as-is too, so a deployment can be tested on its own URL, but with
//   `X-Robots-Tag: noindex` so search engines never index it as a duplicate of www.sunkool.in.
//   Vercel only adds that header to preview URLs itself, not to the production *.vercel.app alias.
// - localhost / 127.0.0.1 / [::1] are left alone (no redirect, no header) so local QA scripts see
//   exactly what www.sunkool.in sends.
//
// Canonical tags are unaffected: they come from metadataBase (src/app/layout.tsx), which is always
// https://www.sunkool.in whatever host served the page.

export const CANONICAL_HOST = "www.sunkool.in";
const APEX_HOST = "sunkool.in";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export const NOINDEX_HEADER = { name: "X-Robots-Tag", value: "noindex" } as const;

/** Lower-cased host name without port or trailing dot ("WWW.Sunkool.in.:443" -> "www.sunkool.in"). */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  const name = host.trim().toLowerCase().replace(/:\d+$/, "");
  return name.endsWith(".") ? name.slice(0, -1) : name;
}

/**
 * Where to send a request that arrived on the bare apex domain, or null to serve it where it is.
 * Only the apex is redirected: the destination host is fixed, so this can never become an open
 * redirect, and *.vercel.app / preview / local hosts are never touched.
 */
export function canonicalRedirectUrl(host: string | null | undefined, requestUrl: string): URL | null {
  if (normalizeHost(host) !== APEX_HOST) return null;
  const url = new URL(requestUrl);
  url.protocol = "https";
  url.host = CANONICAL_HOST;
  url.port = "";
  return url;
}

/**
 * Whether a response served on this host must carry the noindex header. An empty host is Next's own
 * image-optimizer self-fetch (a headerless internal request): it never reaches a crawler, so leave it.
 */
export function shouldNoindex(host: string | null | undefined): boolean {
  const name = normalizeHost(host);
  return name !== "" && name !== CANONICAL_HOST && !LOCAL_HOSTS.has(name);
}
