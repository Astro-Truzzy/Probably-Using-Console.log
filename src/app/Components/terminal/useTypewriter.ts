"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTypewriter(
  text: string,
  speed = 24,
  enabled = true
): { display: string; done: boolean } {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setDisplay(text);
      setDone(true);
      return;
    }

    setDisplay("");
    setDone(false);
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed, enabled]);

  return { display, done };
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
