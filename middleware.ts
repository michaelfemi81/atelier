import { NextRequest, NextResponse } from "next/server";

const rootHosts = new Set(["atelierlane.com", "www.atelierlane.com"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/shops")) {
    return NextResponse.next();
  }

  if (rootHosts.has(host) || host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return NextResponse.next();
  }

  if (!host.endsWith(".atelierlane.com")) {
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
