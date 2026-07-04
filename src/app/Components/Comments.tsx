"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Comment {
  name: string;
  text: string;
  date: string;
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setComments(Array.isArray(d) ? d : []))
      .catch(() => setError("Could not load comments."))
      .finally(() => setLoading(false));
  }, [slug]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ slug, name, text }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 429) {
        setError("Too many comments. Please wait before posting again.");
        return;
      }

      if (!res.ok) {
        setError("Failed to post comment. Try again.");
        return;
      }

      const d = await res.json();
      setComments(Array.isArray(d) ? d : []);
      setText("");
    } catch {
      setError("Failed to post comment. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8">
      <h4 className="font-semibold font-mono">Comments</h4>
      <form onSubmit={submit} className="mt-3 space-y-2">
        <label className="block">
          <span className="sr-only">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            aria-label="Your name"
            required
            maxLength={80}
            className="field-input"
          />
        </label>
        <label className="block">
          <span className="sr-only">Your comment</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comment"
            aria-label="Your comment"
            required
            maxLength={2000}
            className="field-input"
            rows={4}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 space-y-3" aria-live="polite">
        {loading && (
          <p className="text-sm text-(--text-muted) font-mono">Loading comments…</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-(--text-muted) font-mono">
            No comments yet. Be the first.
          </p>
        )}
        {comments.map((c, i) => (
          <div key={`${c.date}-${i}`} className="p-3 surface-card">
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-sm text-(--text-muted)">
              {new Date(c.date).toLocaleString()}
            </div>
            <div className="mt-2">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
