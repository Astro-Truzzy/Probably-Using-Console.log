"use client";

import { useSyncExternalStore } from "react";
import {
  getTheme,
  setTheme,
  THEME_EVENT,
  type Theme,
} from "./terminal/theme";

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}

function getThemeSnapshot(): Theme {
  return getTheme();
}

function getServerTheme(): Theme {
  return "dark";
}

function SunIcon() {
  return (
    <svg
      className="theme-switch-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="theme-switch-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerTheme
  );
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-switch"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="theme-switch-stars" aria-hidden="true">
        <span className="theme-switch-star" />
        <span className="theme-switch-star" />
        <span className="theme-switch-star" />
      </span>
      <span className="theme-switch-cloud" aria-hidden="true" />
      <span className="theme-switch-thumb" aria-hidden="true">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}
