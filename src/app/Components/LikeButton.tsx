"use client";

import { useEffect, useState } from "react";

const btn =
  "px-3 py-1 rounded backdrop-blur glass transition-transform duration-200 hover:scale-[1.06] active:scale-[0.98] text-sm";

function likedStorageKey(slug: string) {
  return `pucl_liked:${slug}`;
}

function HeartIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#f43f5e"
        />
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
        stroke="#f43f5e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLiked(localStorage.getItem(likedStorageKey(slug)) === "1");

    fetch(`/api/likes?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setLikes(d.likes || 0))
      .catch(() => setError("Could not load likes."));
  }, [slug]);

  async function like() {
    if (liked) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        body: JSON.stringify({ slug }),
        headers: { "Content-Type": "application/json" },
      });
      const d = await res.json();

      if (res.status === 429) {
        setError("Too many likes. Try again later.");
        return;
      }

      if (!res.ok) {
        setError("Could not update like.");
        return;
      }

      setLikes(d.likes ?? likes);
      setLiked(true);
      localStorage.setItem(likedStorageKey(slug), "1");
    } catch {
      setError("Could not update like.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={like}
        disabled={loading || liked}
        aria-label={
          liked
            ? `You liked this post. ${likes} likes`
            : `Like this post. ${likes} likes`
        }
        aria-pressed={liked}
        className={`${btn} neon-btn flex items-center gap-2 disabled:opacity-50`}
      >
        <HeartIcon filled={liked} />
        <span>{likes}</span>
      </button>
      {error && (
        <span className="text-xs text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
