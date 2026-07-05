import matter from "gray-matter";
import { estimateReadTime, slugify } from "./post-utils";
import type { PostPayload } from "./types";

function parseTags(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return undefined;
}

function titleFromContent(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

function slugFromFilename(filename?: string): string | undefined {
  if (!filename) return undefined;
  const base = filename.replace(/\.md$/i, "").trim();
  if (!base) return undefined;
  return slugify(base) || undefined;
}

export interface ParsedMarkdownPost extends PostPayload {
  slug?: string;
}

export function parseMarkdownPost(
  raw: string,
  filename?: string
): ParsedMarkdownPost {
  const { data, content } = matter(raw);
  const body = content.trim();

  const title =
    (typeof data.title === "string" && data.title.trim()) ||
    titleFromContent(body) ||
    undefined;

  const excerpt =
    (typeof data.excerpt === "string" && data.excerpt.trim()) ||
    (typeof data.description === "string" && data.description.trim()) ||
    undefined;

  const slug =
    (typeof data.slug === "string" && data.slug.trim()) ||
    slugFromFilename(filename) ||
    (title ? slugify(title) : undefined);

  const readTime =
    typeof data.readTime === "number"
      ? data.readTime
      : typeof data.read_time === "number"
        ? data.read_time
        : estimateReadTime(body);

  const author =
    typeof data.author === "string" ? data.author.trim() : undefined;

  const cover =
    typeof data.cover === "string" ? data.cover.trim() : undefined;

  const tags = parseTags(data.tags);

  if (!title) {
    throw new Error(
      "Markdown must include a title in frontmatter, a # heading, or a filename."
    );
  }

  if (!body) {
    throw new Error("Markdown file has no content.");
  }

  return {
    title,
    excerpt: excerpt || body.slice(0, 180),
    content: body,
    author,
    readTime,
    tags,
    cover: cover || undefined,
    slug,
  };
}
