"use client";

import Image from "next/image";
import BlogMarkdown from "../Components/BlogMarkdown";

export interface PreviewPost {
  slug?: string;
  title: string;
  excerpt?: string;
  content: string;
  author?: string;
  readTime?: number;
  tags?: string[];
  cover?: string;
}

interface AdminPostPreviewProps {
  open: boolean;
  post: PreviewPost | null;
  filename?: string;
  currentIndex?: number;
  total?: number;
  saving?: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function AdminPostPreview({
  open,
  post,
  filename,
  currentIndex = 0,
  total = 1,
  saving = false,
  onClose,
  onSaveDraft,
  onPublish,
  onPrevious,
  onNext,
}: AdminPostPreviewProps) {
  if (!open || !post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close preview"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[95vh] w-full max-w-4xl flex-col surface-card border border-(--surface-border) sm:rounded-xl">
        <div className="flex items-start justify-between gap-4 border-b border-(--surface-border) px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-mono text-(--text-muted)">
              Preview
              {total > 1 ? ` (${currentIndex + 1} of ${total})` : ""}
              {filename ? ` · ${filename}` : ""}
            </p>
            <h3 id="preview-title" className="mt-1 truncate font-mono text-lg">
              {post.title}
            </h3>
            {post.slug && (
              <p className="mt-0.5 truncate text-xs font-mono text-(--text-muted)">
                /blog/{post.slug}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-2 py-1 text-xs font-mono border border-(--surface-border) rounded hover:border-(--accent)"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          {post.excerpt && (
            <p className="mb-4 text-sm text-(--text-muted)">{post.excerpt}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
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

          {post.cover && (
            <div className="mb-6 blog-post-cover">
              <Image
                src={post.cover}
                alt={post.title}
                width={1200}
                height={675}
                className="blog-post-cover-image"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <BlogMarkdown content={post.content} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--surface-border) px-4 py-3">
          <div className="flex gap-2">
            {total > 1 && onPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                disabled={currentIndex === 0 || saving}
                className="px-3 py-1.5 text-xs font-mono border border-(--surface-border) rounded hover:border-(--accent) disabled:opacity-50"
              >
                Previous
              </button>
            )}
            {total > 1 && onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={currentIndex >= total - 1 || saving}
                className="px-3 py-1.5 text-xs font-mono border border-(--surface-border) rounded hover:border-(--accent) disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium border border-(--surface-border) rounded-lg hover:border-(--accent) disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={saving}
              className="btn-accent px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
