"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className={`site-nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="site-nav-inner">
        <div className="site-nav-start">
          <Link href="/" className="nav-brand">
            <span className="nav-brand-prompt" aria-hidden="true">
              ➜
            </span>
            <span className="nav-brand-name nav-brand-name--short sm:hidden">
              console.log()
            </span>
            <span className="nav-brand-name nav-brand-name--full hidden sm:inline">
              probably using console.log()
            </span>
            <span className="nav-brand-cursor" aria-hidden="true">
              ▊
            </span>
          </Link>
          <span className="nav-path hidden lg:inline">{pathLabel(pathname)}</span>
        </div>

        <div className="site-nav-actions">
          <nav className="nav-tabs" aria-label="Main">
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
          </nav>

          <div className="site-nav-utilities">
            <TerminalTrigger />
            <div className="nav-theme-bar">
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="nav-mobile-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="nav-mobile-toggle-bar" />
              <span className="nav-mobile-toggle-bar" />
              <span className="nav-mobile-toggle-bar" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="nav-mobile-backdrop"
          role="presentation"
          onClick={closeMenu}
        />
      )}

      <nav
        id="mobile-nav"
        className={`nav-mobile-menu ${menuOpen ? "nav-mobile-menu--open" : ""}`}
        aria-label="Main"
        aria-hidden={!menuOpen}
      >
        <p className="nav-mobile-prompt font-mono">$ ls ./nav</p>
        <ul className="nav-mobile-list">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-mobile-link ${active ? "nav-mobile-link--active" : ""}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="nav-mobile-theme">
          <span className="nav-mobile-theme-label font-mono">$ theme</span>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
