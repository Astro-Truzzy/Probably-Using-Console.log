"use client";

import type { PostSummary } from "@lib/types";
import TerminalOverlay from "./TerminalOverlay";
import { TerminalProvider } from "./TerminalContext";

interface TerminalShellProps {
  posts: PostSummary[];
  children: React.ReactNode;
}

export default function TerminalShell({ posts, children }: TerminalShellProps) {
  return (
    <TerminalProvider>
      {children}
      <TerminalOverlay posts={posts} />
    </TerminalProvider>
  );
}
