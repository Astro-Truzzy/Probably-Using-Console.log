"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setStatus("Subscribed! Check your inbox.");
      else setStatus("Subscription failed. Try again.");
    } catch {
      setStatus("Subscription failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6" aria-label="Newsletter signup">
      <label htmlFor="newsletter-email" className="block text-sm font-mono text-(--text-muted) mb-2">
        Subscribe to updates
      </label>
      <div className="flex gap-2 max-w-md">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="field-input flex-1"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "…" : "Join"}
        </button>
      </div>
      {status && (
        <p className="mt-2 text-sm font-mono" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </form>
  );
}
