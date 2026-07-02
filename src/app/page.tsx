import type { Metadata } from "next";
import BlogCard from "./Components/BlogCard";
import HeroTerminal from "./Components/terminal/HeroTerminal";
import { getPostSummaries } from "@lib/posts";
import { pageMetadata } from "@lib/seo";

export const metadata: Metadata = pageMetadata({
  description:
    "Developer blog by Trust Williams — JavaScript, full-stack engineering, Web3, debugging, and lessons from building Ridely and Ownbase.",
  path: "/",
});

export default async function Home() {
  const posts = await getPostSummaries();
  const featured = posts.slice(0, 3);

  return (
    <section>
      <p className="sr-only">
        Probably Using Console.log() is a developer blog by Trust Williams
        covering JavaScript, TypeScript, Next.js, Web3, debugging, and
        full-stack engineering lessons from building products like Ridely and
        Ownbase.
      </p>
      <header className="mb-12">
        <HeroTerminal posts={posts} />
      </header>

      <section>
        <h2 className="text-xl font-mono text-(--text-muted) mb-4">
          $ ls posts --featured
        </h2>
        <div className="grid md:grid-cols-3 gap-6 fade-up-stagger">
          {featured.map((p: (typeof featured)[number]) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-xl font-mono">$ ls tags</h3>
        <div className="mt-3 flex gap-3 flex-wrap">
          {["JavaScript", "Web3", "UI/UX", "Debugging", "Tools"].map((c) => (
            <span key={c} className="category-flag">
              {c}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
