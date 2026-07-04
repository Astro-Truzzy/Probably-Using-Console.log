"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import TerminalTrigger from "./TerminalTrigger";

const NAV_ITEMS = [
  { href: "/blog", label: "blog" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

function pathLabel(pathname: string): string {
  if (pathname === "/") return "~";
  const segment = pathname.split("/").filter(Boolean)[0];
  return `~/${segment}`;
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav py-3 ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="nav-brand text-base md:text-lg truncate">
            <span className="nav-brand-prompt" aria-hidden="true">➜</span>
            <span className="nav-brand-name truncate">
              probably using console.log()
            </span>
            <span className="nav-brand-cursor" aria-hidden="true">▊</span>
          </Link>
          <span className="hidden lg:inline text-sm text-(--text-muted) font-mono whitespace-nowrap">
            {pathLabel(pathname)}
          </span>
        </div>

        <nav className="flex items-center gap-2 md:gap-3">
          <div className="nav-tabs">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-tab ${active ? "nav-tab-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <TerminalTrigger />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
