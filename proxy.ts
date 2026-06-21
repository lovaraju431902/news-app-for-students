import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/session";

const ADMIN_PATH_PREFIX = "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE";
const LOGIN_PATH = `${ADMIN_PATH_PREFIX}/login`;
const COOKIE_NAME = "admin_session";
const ALLOWED_EMAILS = ["lovarajuk431902@gmail.com", "satoshi.nakamoto807@gmail.com"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  // 1. Redirect logged-in admin users away from the login page
  if (pathname === LOGIN_PATH) {
    if (sessionToken) {
      const session = await verifyJWT(sessionToken);
      if (session && ALLOWED_EMAILS.includes(session.email?.toLowerCase())) {
        return NextResponse.redirect(new URL(ADMIN_PATH_PREFIX, request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect admin route and subroutes
  if (pathname.startsWith(ADMIN_PATH_PREFIX)) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }

    const session = await verifyJWT(sessionToken);
    if (!session || !ALLOWED_EMAILS.includes(session.email?.toLowerCase())) {
      // Clear cookie and redirect to login
      const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE",
    "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/:path*",
  ],
};
