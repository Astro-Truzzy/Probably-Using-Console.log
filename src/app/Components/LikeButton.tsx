"use client";
import { useEffect, useState } from "react";

export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setLikes(d.likes || 0));
  }, [slug]);

  async function like() {
    setLoading(true);
    const res = await fetch("/api/likes", {
      method: "POST",
      body: JSON.stringify({ slug }),
      headers: { "Content-Type": "application/json" },
    });
    const d = await res.json();
    setLikes(d.likes);
    setLoading(false);
  }

  return (
    <button
      onClick={like}
      disabled={loading}
      className="surface-card px-3 py-1 hover:border-(--accent) disabled:opacity-50"
    >
      👍 {likes}
    </button>
  );
}
