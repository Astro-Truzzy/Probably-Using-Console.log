"use client";
import { motion } from "framer-motion";
import React from "react";

export default function Pagination({
  page,
  total,
  onPage,
}: {
  page: number;
  total: number;
  onPage: (n: number) => void;
}) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className="mt-6 flex items-center gap-2 justify-center pagination-compact">
      <motion.button
        whileHover={{ scale: 1.04 }}
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 bg-white/5 rounded focus-neon"
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 18l-6-6 6-6"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      <div className="page-numbers flex items-center gap-2">
        {pages.map((p) => (
          <motion.button
            key={p}
            whileHover={{ scale: 1.06 }}
            onClick={() => onPage(p)}
            className={`px-3 py-1 rounded ${
              p === page
                ? "bg-(--accent) text-black shadow-neon"
                : "bg-white/5"
            } focus-neon`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </motion.button>
        ))}
      </div>

      <div className="page-current px-3 py-1 rounded bg-white/5 hidden">
        {page} / {total}
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        onClick={() => onPage(page + 1)}
        disabled={page >= total}
        className="px-3 py-2 bg-white/5 rounded focus-neon"
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 6l6 6-6 6"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </nav>
  );
}
