"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) setStatus("Subscribed!");
    else setStatus("Failed");
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <div className="flex gap-2 max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="field-input flex-1"
        />
        <button className="btn-accent px-4 py-2 rounded-lg text-sm font-medium">
          Join
        </button>
      </div>
      {status && <div className="mt-2 text-sm">{status}</div>}
    </form>
  );
}
