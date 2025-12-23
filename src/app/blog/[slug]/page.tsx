import { getPostBySlug, getAllPosts } from "../../../../Lib/posts";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import LikeButton from "../../Components/LikeButton";
import Comments from "../../Components/Comments";
import NewsletterForm from "../../Components/NewsletterForm";
import ShareButtons from "../../Components/ShareButtons";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const SITE_URL = "https://probably-using-console.log";
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description:
      post.excerpt || post.description || post.content?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.description,
      url,
      type: "article",
      images: post.cover
        ? [{ url: post.cover }]
        : [{ url: `${SITE_URL}/og-image.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.description,
      images: post.cover ? [post.cover] : [`${SITE_URL}/og-image.png`],
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return <div>Not found</div>;

  const SITE_URL = "https://probably-using-console.log";
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content?.slice(0, 160),
    author: { "@type": "Person", name: post.author || "Trust Williams" },
    datePublished: post.date,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Organization",
      name: "Probably Using Console.log()",
    },
  };

  return (
    <article>
      <h1 className="text-3xl font-mono">{post.title}</h1>
      <div className="text-sm text-(--text-muted) mt-1">
        {post.author} · {post.readTime} min
      </div>
      <div className="mt-3 flex gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <LikeButton slug={post.slug} />
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
        <div className="text-sm text-(--text-muted)">
          {post.tags?.join(", ")}
        </div>
      </div>
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
