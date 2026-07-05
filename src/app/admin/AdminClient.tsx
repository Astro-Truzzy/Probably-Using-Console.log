"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, PostPayload, PostSummary } from "@lib/types";
import AdminPostPreview, { type PreviewPost } from "./AdminPostPreview";

const emptyForm = {
  title: "",
  excerpt: "",
  cover: "",
  tags: "",
  content: "",
};

interface PendingUpload {
  filename: string;
  payload: PostPayload & { slug: string };
}

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function tagsToString(tags?: string[]): string {
  return tags?.join(", ") ?? "";
}

function formToPreview(form: typeof emptyForm): PreviewPost {
  return {
    title: form.title.trim() || "Untitled",
    excerpt: form.excerpt.trim() || undefined,
    cover: form.cover.trim() || undefined,
    tags: parseTags(form.tags),
    content: form.content,
  };
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
  const [editingPublished, setEditingPublished] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadPreviewIndex, setUploadPreviewIndex] = useState(0);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null);

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

    fetch("/api/posts?all=1")
      .then((res) => res.json())
      .then((data: PostSummary[]) => setPosts(Array.isArray(data) ? data : []));
  }, [auth]);

  function resetForm() {
    setForm(emptyForm);
    setEditingSlug(null);
    setEditingPublished(true);
    setFormError("");
    setShowFormPreview(false);
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
      setEditingPublished(post.published !== false);
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

  function buildFormPayload(published: boolean) {
    return {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      cover: form.cover.trim() || undefined,
      tags: parseTags(form.tags),
      content: form.content,
      published,
    };
  }

  async function savePost(published: boolean) {
    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    const payload = buildFormPayload(published);

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
        published: saved.published !== false,
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
      setShowFormPreview(false);
    } catch {
      setFormError("Request failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function parseMarkdownFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMessage("");
    setUploadErrors([]);
    setFormError("");

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/posts/upload/preview", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as {
        results?: Array<{
          filename: string;
          ok: boolean;
          preview?: PostPayload & { slug: string };
          error?: string;
        }>;
        error?: string;
      };

      if (!res.ok && !data.results) {
        setUploadErrors([data.error ?? "Failed to parse markdown."]);
        return;
      }

      const results = data.results ?? [];
      const parsed = results
        .filter((result) => result.ok && result.preview)
        .map((result) => ({
          filename: result.filename,
          payload: result.preview!,
        }));
      const failed = results.filter((result) => !result.ok);

      if (parsed.length > 0) {
        setPendingUploads(parsed);
        setUploadPreviewIndex(0);
        setShowUploadPreview(true);
      }

      if (failed.length > 0) {
        setUploadErrors(
          failed.map(
            (result) => `${result.filename}: ${result.error ?? "Failed"}`
          )
        );
      }
    } catch {
      setUploadErrors(["Upload request failed. Try again."]);
    } finally {
      setUploading(false);
    }
  }

  async function confirmUploads(published: boolean) {
    if (pendingUploads.length === 0) return;

    setSaving(true);
    setUploadMessage("");
    setUploadErrors([]);

    try {
      const res = await fetch("/api/posts/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: pendingUploads.map((item) => item.payload),
          published,
        }),
      });

      const data = (await res.json()) as {
        results?: Array<{ ok: boolean; post?: PostSummary }>;
        error?: string;
      };

      if (!res.ok) {
        setUploadErrors([data.error ?? "Failed to save posts."]);
        return;
      }

      const saved = (data.results ?? [])
        .map((result) => result.post)
        .filter((post): post is PostSummary => Boolean(post));

      if (saved.length > 0) {
        setPosts((prev) => {
          const slugs = new Set(prev.map((post) => post.slug));
          const newPosts = saved.filter((post) => !slugs.has(post.slug));
          return [...newPosts, ...prev];
        });
        setUploadMessage(
          published
            ? `Published ${saved.length} post${saved.length === 1 ? "" : "s"}.`
            : `Saved ${saved.length} draft${saved.length === 1 ? "" : "s"}.`
        );
      }

      setPendingUploads([]);
      setShowUploadPreview(false);
    } catch {
      setUploadErrors(["Failed to save posts. Try again."]);
    } finally {
      setSaving(false);
    }
  }

  async function publishExistingPost(slug: string) {
    setPublishingSlug(slug);
    setFormError("");

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });

      if (!res.ok) {
        setFormError("Failed to publish post.");
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
        published: true,
      };

      setPosts((prev) =>
        prev.map((post) => (post.slug === slug ? summary : post))
      );
    } catch {
      setFormError("Failed to publish post.");
    } finally {
      setPublishingSlug(null);
    }
  }

  async function deletePost(slug: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
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

  const currentUpload = pendingUploads[uploadPreviewIndex];
  const uploadPreviewPost: PreviewPost | null = currentUpload
    ? {
        slug: currentUpload.payload.slug,
        title: currentUpload.payload.title || "Untitled",
        excerpt: currentUpload.payload.excerpt,
        content: currentUpload.payload.content || "",
        author: currentUpload.payload.author,
        readTime: currentUpload.payload.readTime,
        tags: currentUpload.payload.tags,
        cover: currentUpload.payload.cover,
      }
    : null;

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
      <AdminPostPreview
        open={showUploadPreview}
        post={uploadPreviewPost}
        filename={currentUpload?.filename}
        currentIndex={uploadPreviewIndex}
        total={pendingUploads.length}
        saving={saving}
        onClose={() => {
          setShowUploadPreview(false);
          setPendingUploads([]);
        }}
        onSaveDraft={() => confirmUploads(false)}
        onPublish={() => confirmUploads(true)}
        onPrevious={() =>
          setUploadPreviewIndex((index) => Math.max(0, index - 1))
        }
        onNext={() =>
          setUploadPreviewIndex((index) =>
            Math.min(pendingUploads.length - 1, index + 1)
          )
        }
      />

      <AdminPostPreview
        open={showFormPreview}
        post={{
          ...formToPreview(form),
          slug: editingSlug ?? undefined,
        }}
        saving={saving}
        onClose={() => setShowFormPreview(false)}
        onSaveDraft={() => savePost(false)}
        onPublish={() => savePost(true)}
      />

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
          <div className="p-4 surface-card">
            <h4 className="font-mono">Upload Markdown</h4>
            <p className="mt-1 text-xs text-(--text-muted)">
              Choose .md files to preview before saving. Optional YAML frontmatter:
              title, excerpt, tags, cover, author, slug, readTime.
            </p>
            <div className="mt-3">
              <label
                htmlFor="markdown-upload"
                className="inline-block btn-accent px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
              >
                {uploading ? "Parsing…" : "Choose .md files"}
              </label>
              <input
                id="markdown-upload"
                type="file"
                accept=".md,.markdown,text/markdown"
                multiple
                disabled={uploading || saving}
                className="sr-only"
                onChange={(event) => {
                  parseMarkdownFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>
            {uploadMessage && (
              <p className="mt-2 text-sm text-green-400" role="status">
                {uploadMessage}
              </p>
            )}
            {uploadErrors.length > 0 && (
              <ul className="mt-2 space-y-1" role="alert">
                {uploadErrors.map((error) => (
                  <li key={error} className="text-sm text-red-400">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
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

            {editingSlug && !editingPublished && (
              <p className="mt-2 text-xs font-mono text-amber-400">
                Editing a draft — use Publish when ready.
              </p>
            )}

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
                onClick={() => {
                  if (!form.title.trim() || !form.content.trim()) {
                    setFormError("Title and content are required to preview.");
                    return;
                  }
                  setFormError("");
                  setShowFormPreview(true);
                }}
                disabled={loadingPost}
                className="px-4 py-2 text-sm font-medium border border-(--surface-border) rounded-lg hover:border-(--accent) disabled:opacity-50"
              >
                Preview
              </button>
              {!editingSlug || !editingPublished ? (
                <button
                  type="button"
                  onClick={() => savePost(false)}
                  disabled={saving || loadingPost}
                  className="px-4 py-2 text-sm font-medium border border-(--surface-border) rounded-lg hover:border-(--accent) disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save as Draft"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => savePost(true)}
                disabled={saving || loadingPost}
                className="btn-accent px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving
                  ? "Saving…"
                  : editingSlug && editingPublished
                    ? "Save Changes"
                    : "Publish"}
              </button>
            </div>

            {formError && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {formError}
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-mono">Posts ({posts.length})</h4>
          <ul className="mt-3 space-y-2">
            {posts.map((post) => {
              const draft = post.published === false;
              return (
                <li
                  key={post.slug}
                  className="p-3 surface-card flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{post.title}</div>
                      {draft && (
                        <span className="shrink-0 text-[0.65rem] font-mono px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400">
                          Draft
                        </span>
                      )}
                    </div>
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
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {draft && (
                      <>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-xs font-mono border border-(--surface-border) rounded hover:border-(--accent)"
                        >
                          Preview
                        </a>
                        <button
                          type="button"
                          onClick={() => publishExistingPost(post.slug)}
                          disabled={publishingSlug === post.slug}
                          className="px-2 py-1 text-xs font-mono border border-(--accent)/40 text-(--accent) rounded hover:border-(--accent) disabled:opacity-50"
                        >
                          {publishingSlug === post.slug ? "…" : "Publish"}
                        </button>
                      </>
                    )}
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
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
