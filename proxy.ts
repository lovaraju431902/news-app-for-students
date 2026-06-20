import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect / routes (except //login)
  if (pathname.startsWith("/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE") && pathname !== "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/login") {
    const sessionCookie = request.cookies.get("admin_session")?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await verifyJWT(sessionCookie);
    if (!session) {
      // Clear invalid cookie and redirect to login
      const response = NextResponse.redirect(new URL("/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/login", request.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // 2. Redirect logged-in admin users away from the login page
  if (pathname === "/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/login") {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    if (sessionCookie) {
      const session = await verifyJWT(sessionCookie);
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE/:path*"],
};
