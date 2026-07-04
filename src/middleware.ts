import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalHost, siteUrl } from "@lib/config";

function stripWww(host: string): string {
  return host.replace(/^www\./i, "");
}

export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

  const host = request.headers.get("host") ?? "";
  if (!host || host === canonicalHost) {
    return NextResponse.next();
  }

  const isVercelHost = host.endsWith(".vercel.app");
  const isWwwMismatch =
    stripWww(host) === stripWww(canonicalHost) && host !== canonicalHost;

  if (isVercelHost || isWwwMismatch) {
    const url = request.nextUrl.clone();
    url.protocol = new URL(siteUrl).protocol;
    url.host = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
