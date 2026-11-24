import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { NOINDEX_HEADER, canonicalRedirectUrl, shouldNoindex } from "@/lib/canonical-host";

export async function proxy(request: NextRequest) {
  // Host rules (see src/lib/canonical-host.ts): only the bare apex sunkool.in
  // is redirected to www. Other hosts (*.vercel.app, preview URLs) are served
  // normally but marked noindex; www and localhost are untouched.
  // `host` is empty for Next's own internal image-optimizer self-fetch
  // (it re-invokes this proxy with a headerless mocked request to read local
  // files) — the helpers treat an empty host as "leave alone".
  const host = request.headers.get("host");
  const redirectTo = canonicalRedirectUrl(host, request.url);
  if (redirectTo) {
    return NextResponse.redirect(redirectTo, 308);
  }

  const response = await handleRequest(request);
  if (shouldNoindex(host)) {
    response.headers.set(NOINDEX_HEADER.name, NOINDEX_HEADER.value);
  }
  return response;
}

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  // Only pay for a Supabase session refresh (a real network round-trip) on
  // admin routes — the host rules in proxy() already cover every other path.
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
