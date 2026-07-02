"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      return;
    }

    setStatus("error");
  }

  return (
    <form onSubmit={submit} className="p-5 surface-card">
      <label className="block">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="field-input mt-2"
        />
      </label>
      <label className="block mt-3">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="field-input mt-2"
        />
      </label>
      <label className="block mt-3">
        Message
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          className="field-input mt-2"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-accent mt-4 px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
      {status === "sent" && (
        <p className="mt-2 text-sm text-emerald-400">Message sent. Thanks!</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
