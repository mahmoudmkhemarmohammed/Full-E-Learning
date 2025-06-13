// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const protectedRoutes = ["/dashboard", "/profile"];

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      return redirectToLogin(request);
    }

    try {
      verifyToken(token);
    } catch (error) {
      console.error("❌ Invalid or expired token:", error);
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}


export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};