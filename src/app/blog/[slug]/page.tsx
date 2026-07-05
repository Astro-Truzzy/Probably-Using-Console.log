import { getPostBySlug, getPublishedPosts } from "../../../../Lib/posts";
import { canAccessAdminFromCookies } from "@lib/auth-crypto";
import { isPublished } from "@lib/post-utils";
import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cookies } from "next/headers";
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
  const posts = await getPublishedPosts();
  return posts.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
  const metadata = articleMetadata(post);
  if (!isPublished(post)) {
    return { ...metadata, robots: { index: false, follow: false } };
  }
  return metadata;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const isAdmin = await canAccessAdminFromCookies(await cookies());
  const draft = !isPublished(post);
  if (draft && !isAdmin) notFound();

  return (
    <article>
      {draft && (
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 font-mono text-sm text-amber-200">
          Draft preview — only visible to admins. Publish from the admin dashboard to make this live.
        </div>
      )}
      <JsonLd data={articleJsonLd(post)} />
      <ConsoleBreadcrumb segments={["blog", post.slug]} />
      <h1 className="text-3xl font-mono">{post.title}</h1>
      <div className="text-sm text-(--text-muted) mt-1 font-mono">
        [INFO] {post.date} · {post.author} · {post.readTime} min read
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LikeButton slug={post.slug} />
          <ShareButtons
            title={post.title}
            slug={post.slug}
            url={`${siteUrl}/blog/${post.slug}`}
          />
        </div>
        <div className="text-sm text-(--text-muted) font-mono flex flex-wrap gap-x-2 gap-y-1">
          {post.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="tag-flag hover:underline"
            >
              {tag}
            </Link>
          ))}
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
      <BlogTableOfContents content={post.content} />
      <BlogMarkdown content={post.content} />
      <Comments slug={post.slug} />
      <NewsletterForm />
    </article>
  );
}
