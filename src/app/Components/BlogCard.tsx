import type { PostSummary } from "@lib/types";
import Image from "next/image";
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
  const href = `/blog/${post.slug}`;

  return (
    <Link
      href={href}
      className="log-card block bg-[var(--bg-section)] rounded-xl shadow-sm border border-[var(--surface-border)] overflow-hidden no-underline text-inherit cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-main)"
    >
      {post.cover && (
        <div className="blog-card-cover">
          <Image
            src={post.cover}
            alt=""
            width={640}
            height={360}
            className="blog-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
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
          <span className="text-(--accent)">open {post.slug}</span>
          <span className="text-(--text-muted)">
            {post.readTime ?? 0} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
