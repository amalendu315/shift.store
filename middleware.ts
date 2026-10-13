import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all requests within the obfuscated admin namespace
  if (pathname.startsWith("/manage-shiftstore")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const isLoginPage = pathname === "/manage-shiftstore/login";

    // 1. Allow unauthenticated access strictly to the login page
    if (isLoginPage) {
      // If already logged in, redirect directly to dashboard
      if (sessionCookie && sessionCookie.includes("shiftstore_authenticated")) {
        return NextResponse.redirect(
          new URL("/manage-shiftstore/dashboard", request.url),
        );
      }
      return NextResponse.next();
    }

    // 2. For any other /manage-shiftstore/* route, verify session
    const isAuthenticated =
      sessionCookie && sessionCookie.includes("shiftstore_authenticated");

    if (!isAuthenticated) {
      // Security measure: Redirect directly to public root '/', NOT the login page.
      // This hides the existence of the admin console from scrapers and scanners.
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage-shiftstore/:path*"],
};
