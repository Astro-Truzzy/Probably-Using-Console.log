"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface TerminalContextValue {
  open: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openTerminal = useCallback(() => setOpen(true), []);
  const closeTerminal = useCallback(() => setOpen(false), []);
  const toggleTerminal = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === "Escape" && open) {
        closeTerminal();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, toggleTerminal, closeTerminal]);

  return (
    <TerminalContext.Provider
      value={{ open, openTerminal, closeTerminal, toggleTerminal }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error("useTerminal must be used within TerminalProvider");
  }
  return ctx;
}
