"use client";

import { FormEvent, useEffect, useState } from "react";
import type { PostSummary } from "@lib/types";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createError, setCreateError] = useState(false);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: PostSummary[]) => setPosts(data));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(false);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    });

    if (res.ok) {
      setAuth(true);
      return;
    }

    setLoginError(true);
  }

  async function create() {
    setCreateError(false);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const post = (await res.json()) as PostSummary;
      setPosts((prev) => [post, ...prev]);
      setTitle("");
      setContent("");
      return;
    }

    setCreateError(true);
  }

  if (!auth) {
    return (
      <div className="max-w-md">
        <h2 className="font-mono text-xl">Admin Login</h2>
        <form onSubmit={login} className="mt-4">
          <input
            type="password"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
            placeholder="Password"
            className="field-input"
          />
          <button className="mt-3 btn-accent px-4 py-2 rounded-lg text-sm font-medium">
            Login
          </button>
        </form>
        {loginError && (
          <p className="mt-3 text-sm text-red-400">Invalid password.</p>
        )}
        <p className="mt-3 text-(--text-muted)">
          Only Trust Williams can login.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-mono text-xl">Admin Dashboard</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <h4>Create Post</h4>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="field-input"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Markdown content"
            className="field-input mt-2"
            rows={8}
          />
          <div className="mt-2">
            <button
              onClick={create}
              className="btn-accent px-4 py-2 rounded-lg text-sm font-medium"
            >
              Create
            </button>
          </div>
          {createError && (
            <p className="mt-2 text-sm text-red-400">
              Failed to create post. Check your session and try again.
            </p>
          )}
        </div>
        <div>
          <h4>Posts</h4>
          <ul>
            {posts.map((post) => (
              <li key={post.slug} className="p-2 surface-card my-2">
                {post.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
