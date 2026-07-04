"use client";

import dynamic from "next/dynamic";
import { TerminalProvider } from "./TerminalContext";

const TerminalOverlay = dynamic(() => import("./TerminalOverlay"), {
  ssr: false,
});

interface TerminalShellProps {
  children: React.ReactNode;
}

export default function TerminalShell({ children }: TerminalShellProps) {
  return (
    <TerminalProvider>
      {children}
      <TerminalOverlay />
    </TerminalProvider>
  );
}
