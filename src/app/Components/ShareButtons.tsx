"use client";
import { motion } from "framer-motion";
import React from "react";

const btn =
  "px-3 py-1 rounded backdrop-blur glass transition-transform duration-200 text-sm";

export default function ShareButtons({
  title,
  slug,
  url: shareUrl,
}: {
  title: string;
  slug: string;
  url?: string;
}) {
  const url =
    shareUrl ??
    (typeof window !== "undefined"
      ? window.location.origin + `/blog/${slug}`
      : `/blog/${slug}`);

  function shareTwitter() {
    const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(href, "_blank");
  }

  function shareLinkedIn() {
    const href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(href, "_blank");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    const el = document.createElement("div");
    el.innerText = "Link copied";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  return (
    <div className="flex gap-2 items-center">
      <motion.button
        whileHover={{ scale: 1.06 }}
        onClick={shareTwitter}
        className={`${btn} neon-btn flex items-center gap-2`}
        aria-label="Share on Twitter"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.27-1.12 1.53-1.94-.68.4-1.44.69-2.24.85C18.7 4.3 17.79 4 16.82 4c-1.5 0-2.72 1.22-2.72 2.72 0 .21.02.42.07.62C11.48 7.25 8.29 5.5 6.07 3.04c-.23.39-.36.83-.36 1.31 0 .9.46 1.7 1.16 2.17-.54-.02-1.05-.17-1.5-.41v.04c0 1.27.9 2.33 2.1 2.57-.22.06-.45.08-.69.08-.17 0-.34-.02-.5-.05.34 1.05 1.33 1.82 2.5 1.84C8.3 15 6.9 15.6 5.38 15.6c-.25 0-.5-.01-.74-.04 1.38.88 3.03 1.4 4.8 1.4 5.76 0 8.92-4.77 8.92-8.92v-.41c.61-.44 1.14-.99 1.56-1.61-.58.26-1.2.44-1.84.52z"
            fill="#22D3EE"
          />
        </svg>
        <span className="hidden sm:inline">Twitter</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.06 }}
        onClick={shareLinkedIn}
        className={`${btn} neon-btn flex items-center gap-2`}
        aria-label="Share on LinkedIn"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98s1.98-.88 1.98-1.98C6.96 4.38 6.08 3.5 4.98 3.5zM3.5 8.98h3v10.02h-3V8.98zM9.5 8.98h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.61h-3V15.5c0-1.2-.02-2.73-1.66-2.73-1.66 0-1.92 1.3-1.92 2.64v5.09h-3V8.98z"
            fill="#7C3AED"
          />
        </svg>
        <span className="hidden sm:inline">LinkedIn</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.06 }}
        onClick={copyLink}
        className={`${btn} neon-btn flex items-center gap-2`}
        aria-label="Copy link"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M10.59 13.41a2 2 0 0 1 0-2.82l3.54-3.54a2 2 0 0 1 2.82 2.82l-1.06 1.06"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.41 10.59a2 2 0 0 1 0 2.82l-3.54 3.54a2 2 0 0 1-2.82-2.82l1.06-1.06"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hidden sm:inline">Copy</span>
      </motion.button>
    </div>
  );
}
