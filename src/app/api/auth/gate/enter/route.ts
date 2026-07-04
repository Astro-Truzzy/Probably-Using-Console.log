import { NextRequest, NextResponse } from "next/server";
import {
  clearLegacyAdminCookie,
  gateCookie,
  validateGateToken,
} from "@lib/auth-crypto";

export async function GET(req: NextRequest) {
  const gate = req.nextUrl.searchParams.get("gate");
  if (!gate || !(await validateGateToken(gate))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(gateCookie(gate));
  res.cookies.set(clearLegacyAdminCookie());
  return res;
}
