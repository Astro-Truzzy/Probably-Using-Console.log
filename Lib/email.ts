import { Resend } from "resend";
import {
  contactNotifyEmail,
  isResendConfigured,
  resendFromEmail,
  siteName,
} from "./config";

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export interface ContactEmailInput {
  name: string;
  email: string;
  message: string;
}

export async function sendContactNotification(
  input: ContactEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured()) {
    return { ok: false, error: "Resend is not configured" };
  }

  if (!contactNotifyEmail) {
    return { ok: false, error: "CONTACT_NOTIFY_EMAIL is not set" };
  }

  const resend = getClient();
  if (!resend) {
    return { ok: false, error: "Resend client unavailable" };
  }

  const { error } = await resend.emails.send(
    {
      from: `${siteName} <${resendFromEmail}>`,
      to: [contactNotifyEmail],
      replyTo: input.email,
      subject: `New contact message from ${input.name}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(input.message)}</pre>
      `,
    },
    { idempotencyKey: `contact/${input.email}/${Date.now()}` }
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function subscribeNewsletter(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured()) {
    return { ok: false, error: "Resend is not configured" };
  }

  const resend = getClient();
  if (!resend) {
    return { ok: false, error: "Resend client unavailable" };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (audienceId) {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (error && !error.message.toLowerCase().includes("already")) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  }

  if (!contactNotifyEmail) {
    return { ok: false, error: "CONTACT_NOTIFY_EMAIL is not set" };
  }

  const { error } = await resend.emails.send(
    {
      from: `${siteName} <${resendFromEmail}>`,
      to: [contactNotifyEmail],
      subject: "New newsletter subscriber",
      html: `<p><strong>${escapeHtml(email)}</strong> subscribed to the newsletter.</p>`,
    },
    { idempotencyKey: `newsletter/${email}` }
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
