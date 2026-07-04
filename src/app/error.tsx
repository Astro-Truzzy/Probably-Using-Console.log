"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-12 text-center max-w-md mx-auto">
      <h1 className="text-2xl font-mono text-(--accent)">Runtime Error</h1>
      <p className="mt-3 text-(--text-muted)">
        Something went wrong while loading this page.
      </p>
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={reset}
          className="btn-accent px-4 py-2 rounded-lg text-sm font-medium font-mono"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg text-sm font-mono border border-[var(--surface-border)] hover:border-(--accent)"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
