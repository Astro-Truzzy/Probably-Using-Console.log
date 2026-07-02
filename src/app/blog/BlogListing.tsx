"use client";

import { useMemo, useState } from "react";
import BlogCard from "../Components/BlogCard";
import ConsoleBreadcrumb from "../Components/terminal/ConsoleBreadcrumb";
import type { PostSummary } from "@lib/types";

const PAGE_SIZE = 6;

export default function BlogListing({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const tags = useMemo(
    () =>
      Array.from(new Set(posts.flatMap((post) => post.tags || []))).slice(0, 20),
    [posts]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    const searched = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(normalizedQuery) ||
        (post.excerpt || "").toLowerCase().includes(normalizedQuery) ||
        (post.tags || []).join(" ").toLowerCase().includes(normalizedQuery)
    );

    return activeTag
      ? searched.filter((post) => (post.tags || []).includes(activeTag))
      : searched;
  }, [posts, query, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function setPageSafe(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return (
    <section>
      <ConsoleBreadcrumb segments={["blog"]} />
      <h1 className="text-3xl font-mono">All Logs</h1>

      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grep-input-wrapper w-full md:w-1/2">
          <span className="grep-prompt">$ grep</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="search posts..."
            className="grep-input focus-neon"
            aria-label="Search posts"
          />
        </div>
        <div className="flex gap-2 flex-wrap font-mono text-sm">
          <button
            onClick={() => {
              setActiveTag(null);
              setPage(1);
            }}
            className={`px-3 py-1 rounded border ${
              activeTag === null
                ? "bg-(--accent) text-black border-(--accent)"
                : "bg-[var(--surface)] border-[var(--surface-border)]"
            }`}
          >
            --all
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(activeTag === tag ? null : tag);
                setPage(1);
              }}
              className={`tag-flag px-2 py-1 rounded border ${
                activeTag === tag
                  ? "bg-(--accent) text-black border-(--accent)"
                  : "border-[var(--surface-border)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 font-mono text-sm text-(--text-muted)">
        → {filtered.length} match{filtered.length === 1 ? "" : "es"} found
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {pageItems.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {pageItems.length === 0 && (
        <p className="mt-6 font-mono text-(--text-muted)">
          grep: no matches found.
        </p>
      )}

      <div className="mt-6 flex items-center justify-center font-mono text-sm">
        <button
          onClick={() => setPageSafe(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded mr-2 disabled:opacity-40"
        >
          prev
        </button>
        <div className="px-3 py-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded">
          [{page}/{totalPages}]
        </div>
        <button
          onClick={() => setPageSafe(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded ml-2 disabled:opacity-40"
        >
          next
        </button>
      </div>
    </section>
  );
}
