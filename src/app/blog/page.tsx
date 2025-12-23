"use client";
import { useEffect, useState } from "react";
import BlogCard from "../Components/BlogCard";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tags?: string[];
  readTime: number;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetch("../api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d));
  }, []);

  const tags = Array.from(
    new Set(posts.flatMap((p: Post) => p.tags || []))
  ).slice(0, 20);

  const searched = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(q.toLowerCase()) ||
      (p.tags || []).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const filtered = activeTag
    ? searched.filter((p) => (p.tags || []).includes(activeTag))
    : searched;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function setPageSafe(n: number) {
    if (n < 1) n = 1;
    if (n > totalPages) n = totalPages;
    setPage(n);
  }

  return (
    <section>
      <h1 className="text-3xl font-mono">All Logs</h1>
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search posts..."
          className="w-full md:w-1/2 p-2 bg-white/5 rounded"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setActiveTag(null);
              setPage(1);
            }}
            className={`px-3 py-1 rounded ${
              activeTag === null ? "bg-(--accent)" : "bg-white/5"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTag(activeTag === t ? null : t);
                setPage(1);
              }}
              className={`px-3 py-1 rounded ${
                activeTag === t ? "bg-(--accent)" : "bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {pageItems.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={() => setPageSafe(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 bg-white/5 rounded mr-2"
        >
          Prev
        </button>
        <div className="px-3 py-1 bg-white/5 rounded">
          {page} / {totalPages}
        </div>
        <button
          onClick={() => setPageSafe(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-white/5 rounded ml-2"
        >
          Next
        </button>
      </div>
    </section>
  );
}
