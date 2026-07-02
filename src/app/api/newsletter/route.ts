import { NextRequest, NextResponse } from "next/server";
import { isResendConfigured } from "@lib/config";
import { subscribeNewsletter } from "@lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const trimmedEmail = String(email ?? "").trim();

    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    if (isResendConfigured()) {
      const result = await subscribeNewsletter(trimmedEmail);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 502 });
      }
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "newsletter is not configured" },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
