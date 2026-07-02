"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostSummary } from "@lib/types";
import Terminal from "./Terminal";
import TerminalWindow from "./TerminalWindow";
import { buildHeroBootSequence } from "./TerminalOverlay";

interface HeroTerminalProps {
  posts: PostSummary[];
}

export default function HeroTerminal({ posts }: HeroTerminalProps) {
  const router = useRouter();
  const featured = posts.slice(0, 3);
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setShowInput(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <TerminalWindow title="~/probably-using-console.log" scanlines>
      <Terminal
        posts={posts}
        bootSequence={buildHeroBootSequence(featured)}
        showInput={showInput}
        autoFocus={false}
        onNavigate={(href) => router.push(href)}
        className="hero-terminal"
      />
      {!showInput && (
        <p className="mt-2 text-xs font-mono terminal-muted sm:hidden">
          Tap a post link above, or press &gt;_ in the nav to open the full terminal.
        </p>
      )}
    </TerminalWindow>
  );
}
