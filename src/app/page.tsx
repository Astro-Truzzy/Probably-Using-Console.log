import Link from "next/link";
import BlogCard from "./Components/BlogCard";
import { getAllPosts } from "../../Lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  const featured = posts.slice(0, 3);

  return (
    <section>
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-mono neon">
          probably using console.log()
        </h1>
        <p className="mt-3 text-(--text-muted)">
          Debugging life, one log at a time.
        </p>
        <div className="mt-6">
          <Link
            href="/blog"
            className="inline-block px-4 py-2 bg-(--accent) hover:bg-(--accent-hover) rounded-md text-black"
          >
            View Blog
          </Link>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        {featured.map((p: typeof featured[number]) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-semibold">Categories</h3>
        <div className="mt-3 flex gap-3 flex-wrap">
          {["JavaScript", "Web3", "UI/UX", "Debugging", "Tools"].map((c) => (
            <span key={c} className="px-3 py-1 bg-white/5 rounded-full text-sm">
              {c}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
