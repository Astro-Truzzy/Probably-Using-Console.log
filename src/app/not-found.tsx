"use client";

import { useRouter } from "next/navigation";
import Terminal from "./Components/terminal/Terminal";
import TerminalWindow from "./Components/terminal/TerminalWindow";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="py-12">
      <TerminalWindow title="~/404 — command not found" className="not-found-terminal max-w-2xl mx-auto">
        <Terminal
          showInput
          autoFocus
          onNavigate={(href) => router.push(href)}
          bootSequence={[
            {
              id: "404-error",
              lines: [
                {
                  kind: "error",
                  text: "bash: /requested/path: command not found",
                },
                {
                  kind: "output",
                  text: "The page you're looking for doesn't exist.",
                },
                {
                  kind: "output",
                  text: "Suggestions:",
                },
                {
                  kind: "link",
                  text: "  cd home     → go to homepage",
                  href: "/",
                },
                {
                  kind: "link",
                  text: "  cd blog     → browse all posts",
                  href: "/blog",
                },
                {
                  kind: "output",
                  text: "  help        → type 'help' in the prompt below",
                },
              ],
            },
          ]}
        />
      </TerminalWindow>
    </div>
  );
}
