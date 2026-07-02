"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostSummary } from "@lib/types";
import { siteDescription } from "@lib/config";
import Terminal from "./Terminal";
import TerminalWindow from "./TerminalWindow";
import { useTerminal } from "./TerminalContext";
import type { TerminalEntry } from "./Terminal";

interface TerminalOverlayProps {
  posts: PostSummary[];
}

export default function TerminalOverlay({ posts }: TerminalOverlayProps) {
  const { open, closeTerminal } = useTerminal();
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
              closeTerminal();
              router.push(href);
            }}
            onClose={closeTerminal}
            bootSequence={[
              {
                id: "welcome",
                lines: [
                  { kind: "output", text: "Terminal overlay ready." },
                  { kind: "output", text: "Type 'help' for commands. Type 'exit' or press Esc to close." },
                ],
              },
            ]}
          />
        </TerminalWindow>
      </div>
    </div>
  );
}

export function buildHeroBootSequence(
  featured: PostSummary[]
): TerminalEntry[] {
  return [
    {
      id: "boot-1",
      command: "whoami",
      lines: [
        { kind: "output", text: "visitor@console.log" },
        { kind: "output", text: siteDescription },
      ],
    },
    {
      id: "boot-2",
      command: "ls posts --featured",
      lines: [
        { kind: "output", text: `total ${featured.length}` },
        ...featured.map((post) => ({
          kind: "link" as const,
          text: `  ${post.slug.padEnd(28)} ${post.title}`,
          href: `/blog/${post.slug}`,
        })),
      ],
    },
    {
      id: "boot-3",
      lines: [
        {
          kind: "output",
          text: "Type 'help' to explore. Press Ctrl+` to summon terminal anywhere.",
          className: "terminal-muted",
        },
      ],
    },
  ];
}
