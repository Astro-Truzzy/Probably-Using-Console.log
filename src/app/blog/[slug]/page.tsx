import { getPostBySlug, getAllPosts } from "../../../../Lib/posts";
import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import "highlight.js/styles/github-dark.min.css";
import BlogMarkdown from "../../Components/BlogMarkdown";
import BlogTableOfContents from "../../Components/BlogTableOfContents";
import { articleJsonLd, articleMetadata } from "@lib/seo";
import { siteUrl } from "@lib/config";
import JsonLd from "../../Components/JsonLd";
import ConsoleBreadcrumb from "../../Components/terminal/ConsoleBreadcrumb";

const LikeButton = dynamic(() => import("../../Components/LikeButton"));
const ShareButtons = dynamic(() => import("../../Components/ShareButtons"));
const Comments = dynamic(() => import("../../Components/Comments"));
const NewsletterForm = dynamic(() => import("../../Components/NewsletterForm"));
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
        <div className="text-sm text-(--text-muted) font-mono flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="tag-flag hover:underline"
            >
              {tag}
            </Link>
          ))}
        </div>      </div>
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
      <BlogTableOfContents content={post.content} />
      <BlogMarkdown content={post.content} />
      <Comments slug={post.slug} />
      <NewsletterForm />
    </article>
  );
}
