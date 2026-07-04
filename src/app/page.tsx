import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "./Components/BlogCard";
import HeroTerminal from "./Components/terminal/HeroTerminal";
import { getPostSummaries } from "@lib/posts";
import { pageMetadata } from "@lib/seo";
import "./styles/blog.css";

export const metadata: Metadata = pageMetadata({
  description:
    "Developer blog by Trust Williams — JavaScript, full-stack engineering, Web3, debugging, and lessons from building Ridely and Ownbase.",
  path: "/",
});

const FEATURED_TAGS = ["JavaScript", "Web3", "UI/UX", "Debugging", "Tools"];

export default async function Home() {
  const posts = await getPostSummaries();
  const featured = posts.slice(0, 3);

  return (
    <section>
      <h1 className="sr-only">
        Probably Using Console.log() — Developer Blog by Trust Williams
      </h1>
      <p className="sr-only">
        Articles on JavaScript, TypeScript, Next.js, Web3, debugging, and
        full-stack engineering lessons from building products like Ridely and
        Ownbase.
      </p>
      <header className="mb-12">
        <HeroTerminal posts={posts} />
      </header>

      <section aria-labelledby="featured-posts-heading">
        <h2
          id="featured-posts-heading"
          className="text-xl font-mono text-(--text-muted) mb-4"
        >
          $ ls posts --featured
        </h2>
        <div className="grid md:grid-cols-3 gap-6 fade-up-stagger">
          {featured.map((p: (typeof featured)[number]) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="tags-heading">
        <h2 id="tags-heading" className="text-xl font-mono">
          $ ls tags
        </h2>
        <div className="mt-3 flex gap-3 flex-wrap">
          {FEATURED_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="category-flag no-underline"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
