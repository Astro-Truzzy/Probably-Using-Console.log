import { NextRequest, NextResponse } from "next/server";
import { isResendConfigured } from "@lib/config";
import { sendContactNotification } from "@lib/email";
import { saveContactMessage } from "@lib/messages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    const trimmedName = String(name ?? "").trim();
    const trimmedEmail = String(email ?? "").trim();
    const trimmedMessage = String(message ?? "").trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json({ error: "message too long" }, { status: 400 });
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    };

    if (isResendConfigured()) {
      const result = await sendContactNotification(payload);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 502 });
      }
    } else if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "contact delivery is not configured" },
        { status: 503 }
      );
    } else {
      await saveContactMessage(payload);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
