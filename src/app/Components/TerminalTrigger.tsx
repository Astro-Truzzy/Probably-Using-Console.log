"use client";

import { useTerminal } from "./terminal/TerminalContext";

export default function TerminalTrigger() {
  const { openTerminal } = useTerminal();

  return (
    <button
      type="button"
      onClick={openTerminal}
      className="terminal-trigger focus-neon"
      aria-label="Open terminal (Ctrl+backtick)"
      title="Open terminal (Ctrl+`)"
    >
      &gt;_
    </button>
  );
}
