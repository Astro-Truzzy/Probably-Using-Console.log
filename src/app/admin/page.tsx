"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d));
  }, []);

  async function login(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password: pass }),
    });
    if (res.ok) setAuth(true);
  }

  async function create() {
    const body = { title, content };
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const p = await res.json();
      setPosts((prev) => [p, ...prev]);
    }
  }

  if (!auth)
    return (
      <div className="max-w-md">
        <h2 className="font-mono text-xl">Admin Login</h2>
        <form onSubmit={login} className="mt-4">
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full p-2 bg-white/5 rounded"
          />
          <button className="mt-3 px-3 py-1 bg-[var(--accent)] rounded">
            Login
          </button>
        </form>
        <p className="mt-3 text-[var(--text-muted)]">
          Only Trust Williams can login.
        </p>
      </div>
    );

  return (
    <div>
      <h2 className="font-mono text-xl">Admin Dashboard</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <h4>Create Post</h4>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 bg-white/5 rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Markdown content"
            className="w-full mt-2 p-2 bg-white/5 rounded"
            rows={8}
          ></textarea>
          <div className="mt-2">
            <button
              onClick={create}
              className="px-3 py-1 bg-[var(--accent)] rounded"
            >
              Create
            </button>
          </div>
        </div>
        <div>
          <h4>Posts</h4>
          <ul>
            {posts.map((p) => (
              <li key={p.slug} className="p-2 bg-white/3 rounded my-2">
                {p.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
