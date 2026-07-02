"use client";
import { useEffect, useState, FormEvent } from "react";

interface Comment {
  name: string;
  text: string;
  date: string;
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setComments(d || []));
  }, [slug]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ slug, name, text }),
      headers: { "Content-Type": "application/json" },
    });
    const d = await res.json();
    setComments(d);
    setText("");
  }

  return (
    <div className="mt-8">
      <h4 className="font-semibold">Comments</h4>
      <form onSubmit={submit} className="mt-3 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="field-input"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Comment"
          className="field-input"
          rows={4}
        />
        <button className="btn-accent px-4 py-2 rounded-lg text-sm font-medium">
          Post Comment
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {comments.map((c, i) => (
          <div key={i} className="p-3 surface-card">
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
