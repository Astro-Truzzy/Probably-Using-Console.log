import { NextRequest, NextResponse } from "next/server";
import {
  clearGateCookie,
  clearLegacyAdminCookie,
  clearSessionCookie,
  createAdminSessionToken,
  isAuthConfigured,
  requireAdmin,
  sessionCookie,
  verifyPassword,
} from "@lib/auth";

export async function POST(req: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(token));
  res.cookies.set(clearLegacyAdminCookie());
  return res;
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: await requireAdmin(req) });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearSessionCookie());
  res.cookies.set(clearGateCookie());
  res.cookies.set(clearLegacyAdminCookie());
  return res;
}
