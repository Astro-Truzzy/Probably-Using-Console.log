"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { PostSummary } from "@lib/types";
import {
  executeCommand,
  getAutocomplete,
  type TerminalLine,
} from "./commands";
import { setTheme } from "./theme";
import { useReducedMotion } from "./useTypewriter";

export interface TerminalEntry {
  id: string;
  command?: string;
  lines: TerminalLine[];
}

interface TerminalProps {
  posts?: PostSummary[];
  bootSequence?: TerminalEntry[];
  showInput?: boolean;
  autoFocus?: boolean;
  onNavigate?: (href: string) => void;
  onClose?: () => void;
  className?: string;
  promptUser?: string;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  "help",
  "ls posts",
  "whoami",
  "theme light",
  "joke",
  "console.log('hello!')",
];

function lineClass(line: TerminalLine): string {
  if (line.kind === "error") return "terminal-line-error";
  if (line.kind === "success") return "terminal-line-success";
  if (line.kind === "link") return "terminal-line-link";
  return line.className ?? "";
}

export default function Terminal({
  posts = [],
  bootSequence = [],
  showInput = true,
  autoFocus = false,
  onNavigate,
  onClose,
  className = "",
  promptUser = "visitor",
  suggestions = DEFAULT_SUGGESTIONS,
}: TerminalProps) {
  const reducedMotion = useReducedMotion();
  const [entries, setEntries] = useState<TerminalEntry[]>(bootSequence);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bootDone, setBootDone] = useState(bootSequence.length === 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bootSequence.length === 0) {
      setBootDone(true);
      return;
    }
    const totalDelay = reducedMotion
      ? 0
      : bootSequence.reduce((acc, entry) => acc + entry.lines.length * 120 + 400, 600);
    const timer = window.setTimeout(() => setBootDone(true), totalDelay);
    return () => window.clearTimeout(timer);
  }, [bootSequence, reducedMotion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, input]);

  useEffect(() => {
    if (autoFocus && bootDone) {
      inputRef.current?.focus();
    }
  }, [autoFocus, bootDone]);

  const runCommand = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;

      const result = await executeCommand(cmd, { posts, commandHistory });

      if (result.action?.type === "clear") {
        setEntries([]);
        setCommandHistory((h) => [...h, cmd]);
        setHistoryIndex(-1);
        return;
      }

      if (result.action?.type === "theme") {
        setTheme(result.action.theme);
      }

      if (result.action?.type === "navigate" && onNavigate) {
        onNavigate(result.action.href);
      }

      if (result.action?.type === "close" && onClose) {
        onClose();
      }

      setEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          command: cmd,
          lines: result.lines,
        },
      ]);
      setCommandHistory((h) => [...h, cmd]);
      setHistoryIndex(-1);
    },
    [posts, commandHistory, onNavigate, onClose]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void runCommand(input);
      setInput("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex < 0
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] ?? "");
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const completion = getAutocomplete(input, posts);
      if (!completion) return;
      const parts = input.trimStart().split(/\s+/);
      const cmd = parts[0]?.toLowerCase() ?? "";
      if (parts.length === 1) {
        setInput(`${completion} `);
      } else if (cmd === "open") {
        setInput(`open ${completion}`);
      } else if (cmd === "cd") {
        setInput(`cd ${completion}`);
      } else if (cmd === "theme") {
        setInput(`theme ${completion}`);
      }
    }
  }

  const inputEnabled = showInput && bootDone;

  return (
    <div className={`terminal-shell font-mono text-sm ${className}`}>
      <div ref={scrollRef} className="terminal-scroll">
        {entries.map((entry) => (
          <div key={entry.id} className="terminal-entry">
            {entry.command && (
              <div className="prompt-line">
                <span className="prompt-user">{promptUser}</span>
                <span className="prompt-at">@</span>
                <span className="prompt-host">console.log</span>
                <span className="prompt-colon">:</span>
                <span className="prompt-path">~</span>
                <span className="prompt-dollar">$</span>{" "}
                <span>{entry.command}</span>
              </div>
            )}
            {entry.lines.map((line, i) => (
              <div key={i} className={`terminal-line ${lineClass(line)}`}>
                {line.kind === "link" ? (
                  <Link href={line.href} className="underline-offset-2 hover:underline">
                    {line.text}
                  </Link>
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>
        ))}

        {inputEnabled && (
          <div
            className="prompt-line terminal-input-row"
            onClick={() => inputRef.current?.focus()}
          >
            <span className="prompt-user">{promptUser}</span>
            <span className="prompt-at">@</span>
            <span className="prompt-host">console.log</span>
            <span className="prompt-colon">:</span>
            <span className="prompt-path">~</span>
            <span className="prompt-dollar">$</span>{" "}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              style={{ width: `${Math.max(input.length, 1)}ch` }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Terminal command input"
            />
            <span className={`cursor-blink ${reducedMotion ? "cursor-static" : ""}`} aria-hidden="true">
              ▌
            </span>
          </div>
        )}

        {!bootDone && !inputEnabled && (
          <div className="prompt-line terminal-muted">
            <span className="ascii-spinner" aria-hidden="true">⠋</span> booting…
          </div>
        )}
      </div>

      {inputEnabled && suggestions.length > 0 && (
        <div className="terminal-suggestions" aria-label="Suggested commands">
          <span className="terminal-suggestions-label">Try:</span>
          {suggestions.map((cmd) => (
            <button
              key={cmd}
              type="button"
              className="suggestion-chip"
              onClick={() => {
                void runCommand(cmd);
                setInput("");
                inputRef.current?.focus();
              }}
            >
              {cmd}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
