import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/session";

const COOKIE_NAME = "admin_session";
const ALLOWED_EMAILS = ["lovarajuk431902@gmail.com", "satoshi.nakamoto807@gmail.com"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  // 1. Redirect logged-in admin users away from the login page
  if (pathname === "/admin/login") {
    if (sessionToken) {
      const session = await verifyJWT(sessionToken);
      if (session && ALLOWED_EMAILS.includes(session.email?.toLowerCase())) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect /admin route and subroutes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await verifyJWT(sessionToken);
    if (!session || !ALLOWED_EMAILS.includes(session.email?.toLowerCase())) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
