"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TerminalLine } from "./commands";
import type { TerminalEntry } from "./Terminal";
import {
  getTotalTextLength,
  getTypewriterCharDelay,
  useTypewriter,
} from "./useTypewriter";

function lineClass(line: TerminalLine): string {
  if (line.kind === "error") return "terminal-line-error";
  if (line.kind === "success") return "terminal-line-success";
  if (line.kind === "link") return "terminal-line-link";
  return line.className ?? "";
}

function TerminalLineContent({
  line,
  text,
}: {
  line: TerminalLine;
  text: string;
}) {
  if (line.kind === "link") {
    return (
      <Link href={line.href} className="terminal-post-link">
        {text}
      </Link>
    );
  }
  return <>{text}</>;
}

function TypingLine({
  line,
  charDelay,
  onComplete,
  onTick,
}: {
  line: TerminalLine;
  charDelay: number;
  onComplete: () => void;
  onTick?: () => void;
}) {
  const skipAnimation = line.text.length === 0;
  const { display, done } = useTypewriter(line.text, charDelay, !skipAnimation);

  useEffect(() => {
    if (skipAnimation) onComplete();
  }, [skipAnimation, onComplete]);

  useEffect(() => {
    if (display) onTick?.();
  }, [display, onTick]);

  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  if (skipAnimation) return null;

  return (
    <div className={`terminal-line ${lineClass(line)}`}>
      <TerminalLineContent line={line} text={display} />
      {!done && (
        <span className="typewriter-cursor" aria-hidden="true">
          ▌
        </span>
      )}
    </div>
  );
}

interface TerminalEntryViewProps {
  entry: TerminalEntry;
  animate: boolean;
  promptUser: string;
  onComplete?: () => void;
  onTick?: () => void;
}

export default function TerminalEntryView({
  entry,
  animate,
  promptUser,
  onComplete,
  onTick,
}: TerminalEntryViewProps) {
  const totalChars = getTotalTextLength(entry.lines);
  const charDelay = getTypewriterCharDelay(totalChars);
  const [activeLine, setActiveLine] = useState(animate ? 0 : entry.lines.length);
  const completedRef = useRef(false);

  const fireComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!animate && entry.lines.length > 0) {
      fireComplete();
    }
  }, [animate, entry.lines.length, fireComplete]);

  useEffect(() => {
    if (animate && entry.lines.length === 0) {
      fireComplete();
    }
  }, [animate, entry.lines.length, fireComplete]);

  function handleLineComplete(lineIndex: number) {
    const next = lineIndex + 1;
    if (next >= entry.lines.length) {
      fireComplete();
    } else {
      setActiveLine(next);
    }
  }

  return (
    <div className="terminal-entry">
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
      {entry.lines.map((line, i) => {
        if (!animate || i < activeLine) {
          return (
            <div key={i} className={`terminal-line ${lineClass(line)}`}>
              <TerminalLineContent line={line} text={line.text} />
            </div>
          );
        }
        if (i === activeLine) {
          return (
            <TypingLine
              key={i}
              line={line}
              charDelay={charDelay}
              onComplete={() => handleLineComplete(i)}
              onTick={onTick}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
