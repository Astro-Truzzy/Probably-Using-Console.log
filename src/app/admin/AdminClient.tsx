"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, PostSummary } from "@lib/types";

const emptyForm = {
  title: "",
  excerpt: "",
  cover: "",
  tags: "",
  content: "",
};

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function tagsToString(tags?: string[]): string {
  return tags?.join(", ") ?? "";
}

export default function AdminClient() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/login")
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        if (data.authenticated) setAuth(true);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!auth) return;

    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: PostSummary[]) => setPosts(Array.isArray(data) ? data : []));
  }, [auth]);

  function resetForm() {
    setForm(emptyForm);
    setEditingSlug(null);
    setFormError("");
  }

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
      setPass("");
      return;
    }

    setLoginError(true);
  }

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    setAuth(false);
    resetForm();
    router.push("/");
  }

  async function loadPostForEdit(slug: string) {
    setLoadingPost(true);
    setFormError("");

    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) {
        setFormError("Could not load post for editing.");
        return;
      }

      const post = (await res.json()) as Post;
      setEditingSlug(slug);
      setForm({
        title: post.title,
        excerpt: post.excerpt ?? "",
        cover: post.cover ?? "",
        tags: tagsToString(post.tags),
        content: post.content,
      });
    } catch {
      setFormError("Could not load post for editing.");
    } finally {
      setLoadingPost(false);
    }
  }

  async function savePost() {
    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      cover: form.cover.trim() || undefined,
      tags: parseTags(form.tags),
      content: form.content,
    };

    try {
      const res = editingSlug
        ? await fetch(`/api/posts/${editingSlug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        setFormError(
          editingSlug
            ? "Failed to update post. Check your session and try again."
            : "Failed to create post. Check your session and try again."
        );
        return;
      }

      const saved = (await res.json()) as Post;
      const summary: PostSummary = {
        slug: saved.slug,
        title: saved.title,
        excerpt: saved.excerpt,
        author: saved.author,
        date: saved.date,
        readTime: saved.readTime,
        tags: saved.tags,
        cover: saved.cover,
      };

      setPosts((prev) => {
        if (editingSlug) {
          return prev.map((post) =>
            post.slug === editingSlug ? summary : post
          );
        }
        return [summary, ...prev];
      });
      resetForm();
    } catch {
      setFormError("Request failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(slug: string, title: string) {
    if (
      !window.confirm(`Delete "${title}"? This cannot be undone.`)
    ) {
      return;
    }

    setFormError("");
    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (!res.ok) {
      setFormError("Failed to delete post.");
      return;
    }

    setPosts((prev) => prev.filter((post) => post.slug !== slug));
    if (editingSlug === slug) resetForm();
  }

  if (checkingSession) {
    return (
      <p className="font-mono text-sm text-(--text-muted)">Verifying session…</p>
    );
  }

  if (!auth) {
    return (
      <div className="max-w-md">
        <h2 className="font-mono text-xl">Admin Login</h2>
        <form onSubmit={login} className="mt-4">
          <label htmlFor="admin-password" className="sr-only">
            Admin password
          </label>
          <input
            id="admin-password"
            type="password"
            value={pass}
            onChange={(event) => setPass(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="field-input"
          />
          <button
            type="submit"
            className="mt-3 btn-accent px-4 py-2 rounded-lg text-sm font-medium"
          >
            Login
          </button>
        </form>
        {loginError && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            Invalid password.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-mono text-xl">Admin Dashboard</h2>
        <button
          type="button"
          onClick={logout}
          className="px-3 py-1.5 text-sm font-mono border border-(--surface-border) rounded hover:border-(--accent)"
        >
          Logout
        </button>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-mono">
              {editingSlug ? `Edit: ${editingSlug}` : "Create Post"}
            </h4>
            {editingSlug && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-mono text-(--text-muted) hover:text-(--accent)"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Title"
              className="field-input"
            />
            <input
              value={form.excerpt}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, excerpt: event.target.value }))
              }
              placeholder="Excerpt (optional)"
              className="field-input"
            />
            <input
              value={form.cover}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cover: event.target.value }))
              }
              placeholder="Cover image URL (optional)"
              className="field-input"
            />
            <input
              value={form.tags}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tags: event.target.value }))
              }
              placeholder="Tags (comma-separated, e.g. JavaScript, Web3)"
              className="field-input"
            />
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, content: event.target.value }))
              }
              placeholder="Markdown content"
              className="field-input"
              rows={10}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={savePost}
              disabled={saving || loadingPost}
              className="btn-accent px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : editingSlug
                  ? "Save Changes"
                  : "Create Post"}
            </button>
          </div>

          {formError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {formError}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-mono">Posts ({posts.length})</h4>
          <ul className="mt-3 space-y-2">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="p-3 surface-card flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{post.title}</div>
                  <div className="text-xs font-mono text-(--text-muted) truncate">
                    {post.slug}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded bg-(--bg-section) text-(--text-muted)"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => loadPostForEdit(post.slug)}
                    disabled={loadingPost}
                    className="px-2 py-1 text-xs font-mono border border-(--surface-border) rounded hover:border-(--accent) disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(post.slug, post.title)}
                    className="px-2 py-1 text-xs font-mono border border-red-500/40 text-red-400 rounded hover:border-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
