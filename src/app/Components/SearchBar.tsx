"use client";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const [q, setQ] = useState("");

  useEffect(() => {
    // broadcast search query for client side filters (simple implementation)
    const ev = new CustomEvent("search", { detail: q });
    window.dispatchEvent(ev);
  }, [q]);

  return (
    <div className="w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts..."
        className="w-full px-4 py-2 bg-white/5 rounded"
      />
    </div>
  );
}
