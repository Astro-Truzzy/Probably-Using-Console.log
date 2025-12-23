import Link from "next/link";

interface BlogPost {
  tags?: string[];
  title: string;
  excerpt: string;
  slug: string;
  readTime: number;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-[rgba(255,255,255,0.03)] p-4 rounded-lg hover:-translate-y-2 transition-transform shadow-md">
      <div className="text-sm text-(--text-muted)">
        {post.tags?.join(", ")}
      </div>
      <h3 className="mt-2 font-mono text-xl">{post.title}</h3>
      <p className="mt-2 text-sm text-(--text-muted)">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <Link href={`/blog/${post.slug}`} className="text-(--accent)">
          Read
        </Link>
        <div className="text-sm text-(--text-muted)">
          {post.readTime} min
        </div>
      </div>
    </article>
  );
}
