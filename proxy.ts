import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/session";

const ADMIN_COOKIE_NAME = "admin_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect logged-in admin users away from admin login page
  if (pathname === "/admin/login") {
    const adminSessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (adminSessionToken) {
      const session = await verifyJWT(adminSessionToken);
      if (session && session.email) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect /admin route and subroutes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const adminSessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!adminSessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await verifyJWT(adminSessionToken);
    if (!session || !session.email) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }

  // 3. Protect user /account and /billing routes (Better Auth)
  if (pathname.startsWith("/account") || pathname.startsWith("/billing")) {
    const userSessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!userSessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/account",
    "/account/:path*",
    "/billing",
    "/billing/:path*",
  ],
};
