"use client";

import type { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  scanlines?: boolean;
}

export default function TerminalWindow({
  title = "~/probably-using-console.log",
  children,
  className = "",
  scanlines = false,
}: TerminalWindowProps) {
  return (
    <div
      className={`terminal-window ${scanlines ? "terminal-scanlines" : ""} ${className}`}
    >
      <div className="terminal-titlebar">
        <div className="terminal-traffic-lights" aria-hidden="true">
          <span className="terminal-light terminal-light-red" />
          <span className="terminal-light terminal-light-yellow" />
          <span className="terminal-light terminal-light-green" />
        </div>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
