"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostSummary } from "@lib/types";
import { siteDescription } from "@lib/config";
import Terminal from "./Terminal";
import TerminalWindow from "./TerminalWindow";
import type { TerminalEntry } from "./Terminal";

interface HeroTerminalProps {
  posts: PostSummary[];
}

function buildHeroBootSequence(
  featured: PostSummary[],
  { mobile }: { mobile: boolean }
): TerminalEntry[] {
  const animate = !mobile;

  return [
    {
      id: "boot-1",
      command: "whoami",
      animate,
      lines: [
        { kind: "output", text: "visitor@console.log" },
        { kind: "output", text: siteDescription },
      ],
    },
    {
      id: "boot-2",
      command: "ls posts --featured",
      animate,
      lines: [
        { kind: "output", text: `total ${featured.length}` },
        ...featured.map((post) => ({
          kind: "link" as const,
          text: mobile
            ? post.title
            : `  ${post.slug.padEnd(28)} ${post.title}`,
          href: `/blog/${post.slug}`,
        })),
      ],
    },
    {
      id: "boot-3",
      animate,
      lines: [
        {
          kind: "output",
          text: mobile
            ? "Tap a post title above, or use the commands below."
            : "Type 'help' to explore. Press Ctrl+` to summon terminal anywhere.",
          className: "terminal-muted",
        },
      ],
    },
  ];
}

const MOBILE_SUGGESTIONS = ["help", "ls posts", "whoami"];

export default function HeroTerminal({ posts }: HeroTerminalProps) {
  const router = useRouter();
  const featured = posts.slice(0, 3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <TerminalWindow title="~/probably-using-console.log" scanlines>
      <Terminal
        key={isMobile ? "mobile" : "desktop"}
        posts={posts}
        bootSequence={buildHeroBootSequence(featured, { mobile: isMobile })}
        showInput={!isMobile}
        showSuggestions
        suggestions={isMobile ? MOBILE_SUGGESTIONS : undefined}
        autoFocus={false}
        onNavigate={(href) => router.push(href)}
        className="hero-terminal"
      />
      {isMobile && (
        <p className="mt-2 text-xs font-mono terminal-muted sm:hidden">
          Or press &gt;_ in the nav for the full terminal with keyboard input.
        </p>
      )}
    </TerminalWindow>
  );
}
