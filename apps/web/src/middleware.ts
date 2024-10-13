import { NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "auth_token";
const publicRoutes = ["/auth", "/api/auth", "invitations"];
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  // const token = localStorage.getItem(TOKEN_KEY);
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (token && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(
      new URL("/dashboard/audience/entities", request.url)
    );
  }
  if (request.nextUrl.pathname.startsWith("/api")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
