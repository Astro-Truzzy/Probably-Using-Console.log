import type { PostSummary } from "@lib/types";
import Link from "next/link";

function formatLogDate(date?: string): string {
  if (!date) return "---- -- --";
  try {
    return new Date(date).toISOString().slice(0, 10);
  } catch {
    return date;
  }
}

export default function BlogCard({ post }: { post: PostSummary }) {
  return (
    <article className="log-card bg-[var(--bg-section)] p-5 rounded-xl shadow-sm border border-[var(--surface-border)]">
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-(--text-muted)">
        <span>[INFO] {formatLogDate(post.date)}</span>
        <span className="log-open-hint">&gt; open post</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {post.tags?.map((tag) => (
          <span key={tag} className="tag-flag">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-2 font-mono text-xl">{post.title}</h3>
      <p className="mt-2 text-sm text-(--text-muted)">{post.excerpt ?? ""}</p>
      <div className="mt-4 flex items-center justify-between font-mono text-sm">
        <Link href={`/blog/${post.slug}`} className="text-(--accent) hover:underline">
          open {post.slug}
        </Link>
        <div className="text-(--text-muted)">
          {post.readTime ?? 0} min read
        </div>
      </div>
    </article>
  );
}
