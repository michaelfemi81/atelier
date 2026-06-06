import { NextRequest, NextResponse } from "next/server";

const rootHosts = new Set(["atelierlane.com", "www.atelierlane.com", "localhost:3000", "127.0.0.1:3000"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/shops")) {
    return NextResponse.next();
  }

  if (rootHosts.has(host)) {
    return NextResponse.next();
  }

  const shopSlug = host.replace(".atelierlane.com", "").split(".")[0];

  if (!shopSlug || shopSlug === "www") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/shops/${shopSlug}${pathname === "/" ? "" : pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!.*\\.).*)"]
};
