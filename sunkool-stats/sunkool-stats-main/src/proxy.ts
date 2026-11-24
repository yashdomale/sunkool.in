import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const CANONICAL_HOST = "www.sunkool.in";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Production-only host redirect: sunkool-stats.vercel.app is a full
  // mirror of the site (no automatic noindex), so every non-canonical host
  // must land on www.sunkool.in. Skip on preview/dev so branch URLs and
  // localhost still work before DNS is pointed.
  // `host` is empty for Next's own internal image-optimizer self-fetch
  // (it re-invokes this proxy with a headerless mocked request to read local
  // files) — never treat an empty host as "wrong host" or local images break.
  const isProd = process.env.VERCEL_ENV === "production";
  const isLocal =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  if (isProd && host && host !== CANONICAL_HOST && !isLocal) {
    const url = new URL(request.url);
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  // Only pay for a Supabase session refresh (a real network round-trip) on
  // admin routes — the host check above already covers every other path.
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  // RLS is the source of truth for who can read/write what — this redirect
  // is purely UX (send unauthenticated visitors to the login form instead
  // of a blank/broken dashboard).
  if (!isLoginRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Never redirect a Server Action POST: the client expects a Flight
  // response, and a bare 307 to an HTML page surfaces as "An unexpected
  // response was received from the server." (e.g. submitting a stale login
  // page after the session cookie already exists). Let the action run — the
  // login action itself redirects on success.
  const isServerAction = request.headers.has("next-action");

  if (isLoginRoute && user && !isServerAction) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
