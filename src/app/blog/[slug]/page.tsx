import { getPostBySlug, getAllPosts } from "../../../../Lib/posts";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { articleJsonLd, articleMetadata } from "@lib/seo";
import { siteUrl } from "@lib/config";
import JsonLd from "../../Components/JsonLd";
import LikeButton from "../../Components/LikeButton";
import Comments from "../../Components/Comments";
import NewsletterForm from "../../Components/NewsletterForm";
import ShareButtons from "../../Components/ShareButtons";
import ConsoleBreadcrumb from "../../Components/terminal/ConsoleBreadcrumb";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
  return articleMetadata(post);
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <JsonLd data={articleJsonLd(post)} />
      <ConsoleBreadcrumb segments={["blog", post.slug]} />
      <h1 className="text-3xl font-mono">{post.title}</h1>
      <div className="text-sm text-(--text-muted) mt-1 font-mono">
        [INFO] {post.date} · {post.author} · {post.readTime} min read
      </div>
      <div className="mt-3 flex gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <LikeButton slug={post.slug} />
          <ShareButtons
            title={post.title}
            slug={post.slug}
            url={`${siteUrl}/blog/${post.slug}`}
          />
        </div>
        <div className="text-sm text-(--text-muted) font-mono">
          {post.tags?.map((tag) => `#${tag}`).join(" ")}
        </div>
      </div>
      {post.cover && (
        <div className="mt-6 blog-post-cover">
          <Image
            src={post.cover}
            alt={post.title}
            width={1200}
            height={675}
            className="blog-post-cover-image"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}
      <div className="mt-6 prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      <Comments slug={post.slug} />
      <NewsletterForm />
    </article>
  );
}
