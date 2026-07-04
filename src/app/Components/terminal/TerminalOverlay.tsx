"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostSummary } from "@lib/types";
import Terminal from "./Terminal";
import TerminalWindow from "./TerminalWindow";
import { useTerminal } from "./TerminalContext";

export default function TerminalOverlay() {
  const { open, closeTerminal } = useTerminal();
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const postsFetchedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || postsFetchedRef.current) return;

    setPostsLoading(true);
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: PostSummary[]) => {
        setPosts(Array.isArray(data) ? data : []);
        postsFetchedRef.current = true;
      })
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  if (!mounted || !open) return null;

  return (
    <div
      className="terminal-overlay-backdrop"
      role="presentation"
      onClick={closeTerminal}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        tabIndex={-1}
        className="terminal-overlay-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <TerminalWindow title="~/terminal — Ctrl+` to close">
          <Terminal
            posts={posts}
            showInput
            autoFocus
            onNavigate={(href) => {
              void router.push(href);
              closeTerminal();
            }}
            onClose={closeTerminal}
            bootSequence={[
              {
                id: "welcome",
                lines: [
                  { kind: "output", text: "Terminal overlay ready." },
                  {
                    kind: "output",
                    text: postsLoading
                      ? "Loading posts index…"
                      : "Type 'help' for commands. Type 'exit' or press Esc to close.",
                  },
                ],
              },
            ]}
          />
        </TerminalWindow>
      </div>
    </div>
  );
}
