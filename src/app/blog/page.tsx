import type { Metadata } from "next";
import { getPostSummaries } from "@lib/posts";
import { pageMetadata } from "@lib/seo";
import BlogListing from "./BlogListing";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Articles on JavaScript, full-stack development, Web3, debugging, and shipping products — by Trust Williams.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPostSummaries();
  return <BlogListing posts={posts} />;
}
