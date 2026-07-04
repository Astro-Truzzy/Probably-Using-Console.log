import ConsoleBreadcrumb from "../Components/terminal/ConsoleBreadcrumb";
import type { PostSummary } from "@lib/types";
import BlogExplorer from "./BlogExplorer";

export default function BlogListing({
  posts,
  initialTag = null,
}: {
  posts: PostSummary[];
  initialTag?: string | null;
}) {
  return (
    <section>
      <ConsoleBreadcrumb segments={["blog"]} />
      <h1 className="text-3xl font-mono">All Logs</h1>
      <BlogExplorer posts={posts} initialTag={initialTag} />
    </section>
  );
}
