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

  // Unauthenticated user trying to access protected route
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login/register
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|images|manifest\\.json|favicon\\.ico).*)",
  ],
};
