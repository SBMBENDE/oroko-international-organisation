import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED_PATHS = ["/portal", "/members"];
const AUTH_PAGES = ["/auth/login", "/auth/register"];

export const proxy = auth(function proxyHandler(req) {
  const isAuthenticated = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Use x-forwarded-host (set by Vercel/CDN) to get the real domain, never
  // rely on req.nextUrl which Auth.js may normalise against AUTH_URL env var
  const fwdHost = req.headers.get("x-forwarded-host");
  const host = fwdHost ?? req.headers.get("host") ?? "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const base = `${proto}://${host}`;

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(
      `${base}/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
    );
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(`${base}/portal`);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|images|manifest\\.json|favicon\\.ico).*)",
  ],
};
