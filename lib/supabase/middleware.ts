import { NextRequest, NextResponse } from "next/server";

export function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.includes("auth-token"));
  if (!hasAuthCookie && pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (hasAuthCookie && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
