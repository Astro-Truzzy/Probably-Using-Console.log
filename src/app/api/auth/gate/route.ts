import { NextRequest, NextResponse } from "next/server";
import {
  clearLegacyAdminCookie,
  createAdminGateToken,
  gateCookie,
  isAdminTerminalCommand,
  isAuthConfigured,
  normalizeTerminalPhrase,
} from "@lib/auth-crypto";

async function readPhrase(req: NextRequest): Promise<{
  phrase: string;
  redirect: boolean;
} | null> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await req.json()) as { phrase?: string; redirect?: boolean };
      return {
        phrase: normalizeTerminalPhrase(body.phrase ?? ""),
        redirect: Boolean(body.redirect),
      };
    } catch {
      return null;
    }
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await req.formData();
    return {
      phrase: normalizeTerminalPhrase(String(formData.get("phrase") ?? "")),
      redirect: String(formData.get("redirect") ?? "").trim() === "1",
    };
  }

  return null;
}

function gateFailure(req: NextRequest, redirect: boolean) {
  if (redirect) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

function gateSuccess(req: NextRequest, token: string, redirect: boolean) {
  if (redirect) {
    const url = new URL("/admin", req.url);
    url.searchParams.set("gate", token);
    const res = NextResponse.redirect(url, 303);
    res.cookies.set(gateCookie(token));
    res.cookies.set(clearLegacyAdminCookie());
    return res;
  }

  const res = NextResponse.json({ ok: true, gate: token });
  res.cookies.set(gateCookie(token));
  res.cookies.set(clearLegacyAdminCookie());
  return res;
}

export async function POST(req: NextRequest) {
  const payload = await readPhrase(req);
  if (!payload) {
    return gateFailure(req, false);
  }

  const { phrase, redirect } = payload;

  if (!isAuthConfigured()) {
    return gateFailure(req, redirect);
  }

  if (!isAdminTerminalCommand(phrase)) {
    return gateFailure(req, redirect);
  }

  const token = await createAdminGateToken();
  if (!token) {
    return gateFailure(req, redirect);
  }

  return gateSuccess(req, token, redirect);
}
