import type { PostSummary } from "@lib/types";
import { siteDescription } from "@lib/config";
import { randomFallbackJoke, type JokeResult } from "@lib/jokes";

export type TerminalAction =
  | { type: "navigate"; href: string }
  | { type: "close" }
  | { type: "clear" }
  | { type: "theme"; theme: "dark" | "light" };

export type TerminalLine =
  | { kind: "output"; text: string; className?: string }
  | { kind: "link"; text: string; href: string }
  | { kind: "error"; text: string }
  | { kind: "success"; text: string };

export interface CommandResult {
  lines: TerminalLine[];
  action?: TerminalAction;
}

export interface CommandContext {
  posts: PostSummary[];
  commandHistory: string[];
}

const ROUTES: Record<string, string> = {
  blog: "/blog",
  about: "/about",
  contact: "/contact",
  home: "/",
  admin: "/admin",
};

const COMMANDS = [
  "help",
  "ls",
  "open",
  "cd",
  "whoami",
  "theme",
  "clear",
  "history",
  "contact",
  "exit",
  "grep",
  "sudo",
  "console.log",
  "joke",
];

function jokeLines(result: JokeResult): TerminalLine[] {
  if (result.lines.length === 2) {
    return [
      { kind: "output", text: result.lines[0] },
      { kind: "success", text: result.lines[1] },
    ];
  }

  return result.lines.map((text) => ({ kind: "success" as const, text }));
}

function helpLines(): TerminalLine[] {
  return [
    { kind: "output", text: "Available commands:" },
    { kind: "output", text: "  help              — show this message" },
    { kind: "output", text: "  ls posts [--featured] — list blog posts" },
    { kind: "output", text: "  ls tags           — list all tags" },
    { kind: "output", text: "  open <slug>       — open a post" },
    { kind: "output", text: "  cd <page>         — navigate (blog, about, contact, home)" },
    { kind: "output", text: "  whoami            — about this blog" },
    { kind: "output", text: "  theme dark|light  — switch theme" },
    { kind: "output", text: "  clear             — clear terminal" },
    { kind: "output", text: "  history           — show command history" },
    { kind: "output", text: "  contact           — contact info" },
    { kind: "output", text: "  exit              — close terminal overlay" },
    { kind: "output", text: "  joke              — a random dev joke" },
    { kind: "output", text: "  console.log(...) — echo to console" },
    { kind: "output", text: "", className: "terminal-muted" },
    { kind: "output", text: "Tip: press Ctrl+` anywhere to summon this terminal.", className: "terminal-muted" },
  ];
}

function lsPosts(posts: PostSummary[], featuredOnly: boolean): TerminalLine[] {
  const list = featuredOnly ? posts.slice(0, 3) : posts;
  if (list.length === 0) {
    return [{ kind: "output", text: "No posts found." }];
  }
  return [
    { kind: "output", text: `total ${list.length}` },
    ...list.map((post) => ({
      kind: "link" as const,
      text: `  ${post.slug.padEnd(28)} ${post.title}`,
      href: `/blog/${post.slug}`,
    })),
  ];
}

function lsTags(posts: PostSummary[]): TerminalLine[] {
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  if (tags.length === 0) {
    return [{ kind: "output", text: "No tags found." }];
  }
  return tags.map((tag) => ({
    kind: "output" as const,
    text: `  #${tag}`,
  }));
}

export async function executeCommand(
  input: string,
  ctx: CommandContext
): Promise<CommandResult> {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const lower = trimmed.toLowerCase();

  if (lower === "help" || lower === "?") {
    return { lines: helpLines() };
  }

  if (lower === "clear") {
    return { lines: [], action: { type: "clear" } };
  }

  if (lower === "exit" || lower === "quit") {
    return {
      lines: [{ kind: "output", text: "Closing terminal…" }],
      action: { type: "close" },
    };
  }

  if (lower === "whoami") {
    return {
      lines: [
        { kind: "output", text: "visitor@console.log" },
        { kind: "output", text: siteDescription },
        { kind: "output", text: "Built by Trust Williams — developer, debugger, log enthusiast." },
      ],
    };
  }

  if (lower === "history") {
    if (ctx.commandHistory.length === 0) {
      return { lines: [{ kind: "output", text: "No command history yet." }] };
    }
    return {
      lines: ctx.commandHistory.map((cmd, i) => ({
        kind: "output" as const,
        text: `  ${String(i + 1).padStart(3)}  ${cmd}`,
      })),
    };
  }

  if (lower === "contact") {
    return {
      lines: [
        { kind: "output", text: "Email: hello@probably-using-console.log" },
        { kind: "link", text: "  → /contact (send a message)", href: "/contact" },
      ],
    };
  }

  if (lower === "joke") {
    let result: JokeResult;
    try {
      const res = await fetch("/api/joke");
      if (!res.ok) throw new Error("request failed");
      result = (await res.json()) as JokeResult;
    } catch {
      result = randomFallbackJoke();
    }
    return { lines: jokeLines(result) };
  }

  if (lower === "sudo") {
    return {
      lines: [
        { kind: "error", text: "visitor is not in the sudoers file." },
        { kind: "output", text: "Nice try though. 😏", className: "terminal-muted" },
      ],
    };
  }

  if (lower.startsWith("rm -rf")) {
    return {
      lines: [
        { kind: "error", text: "rm: it is dangerous to operate recursively on '/'" },
        { kind: "output", text: "…just kidding. Your blog is safe. 🛡️" },
      ],
    };
  }

  if (lower.startsWith("console.log")) {
    const match = trimmed.match(/console\.log\((.*)\)/i);
    const payload = match?.[1]?.trim() ?? "";
    return {
      lines: [{ kind: "success", text: payload ? `→ ${payload}` : "→ undefined" }],
    };
  }

  if (lower.startsWith("theme")) {
    const arg = lower.split(/\s+/)[1];
    if (arg === "dark" || arg === "light") {
      return {
        lines: [{ kind: "success", text: `Theme set to ${arg}.` }],
        action: { type: "theme", theme: arg },
      };
    }
    return {
      lines: [
        { kind: "error", text: "Usage: theme dark|light" },
      ],
    };
  }

  if (lower.startsWith("cd ")) {
    const target = lower.slice(3).trim();
    const href = ROUTES[target];
    if (!href) {
      return {
        lines: [{ kind: "error", text: `cd: no such directory: ${target}` }],
      };
    }
    return {
      lines: [{ kind: "output", text: `Navigating to ~/${target}…` }],
      action: { type: "navigate", href },
    };
  }

  if (lower.startsWith("open ")) {
    const slug = trimmed.slice(5).trim();
    const post = ctx.posts.find((p) => p.slug === slug);
    if (!post) {
      return {
        lines: [{ kind: "error", text: `open: post not found: ${slug}` }],
      };
    }
    return {
      lines: [{ kind: "output", text: `Opening ${post.title}…` }],
      action: { type: "navigate", href: `/blog/${slug}` },
    };
  }

  if (lower.startsWith("ls")) {
    const args = lower.split(/\s+/).slice(1);
    if (args[0] === "tags") {
      return { lines: lsTags(ctx.posts) };
    }
    const featuredOnly = args.includes("--featured");
    return { lines: lsPosts(ctx.posts, featuredOnly) };
  }

  return {
    lines: [
      { kind: "error", text: `command not found: ${trimmed.split(/\s+/)[0]}` },
      { kind: "output", text: "Try 'help' for available commands.", className: "terminal-muted" },
    ],
  };
}

export function getAutocomplete(input: string, posts: PostSummary[]): string | null {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0]?.toLowerCase() ?? "";

  if (parts.length === 1) {
    const match = COMMANDS.find((c) => c.startsWith(cmd) && c !== cmd);
    return match ?? null;
  }

  if (cmd === "open" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    const match = posts.find((p) => p.slug.startsWith(partial) && p.slug !== partial);
    return match?.slug ?? null;
  }

  if (cmd === "cd" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    const routes = Object.keys(ROUTES);
    const match = routes.find((r) => r.startsWith(partial) && r !== partial);
    return match ?? null;
  }

  if (cmd === "theme" && parts.length === 2) {
    const partial = parts[1].toLowerCase();
    const themes = ["dark", "light"];
    const match = themes.find((t) => t.startsWith(partial) && t !== partial);
    return match ?? null;
  }

  return null;
}
