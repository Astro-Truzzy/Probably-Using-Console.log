import Image from "next/image";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@lib/markdown-headings";

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(String).join("");
  return String(children ?? "");
}

const components: Components = {
  h1: ({ children }) => {
    const text = headingText(children);
    const id = slugifyHeading(text);
    return (
      <h2 id={id} className="blog-prose-h2">
        {children}
      </h2>
    );
  },
  h2: ({ children }) => {
    const text = headingText(children);
    const id = slugifyHeading(text);
    return (
      <h2 id={id} className="blog-prose-h2">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = headingText(children);
    const id = slugifyHeading(text);
    return (
      <h3 id={id} className="blog-prose-h3">
        {children}
      </h3>
    );
  },
  h4: ({ children }) => (
    <h4 className="blog-prose-h4">{children}</h4>
  ),
  p: ({ children }) => <p className="blog-prose-p">{children}</p>,
  ul: ({ children }) => <ul className="blog-prose-ul">{children}</ul>,
  ol: ({ children }) => <ol className="blog-prose-ol">{children}</ol>,
  li: ({ children }) => <li className="blog-prose-li">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="blog-prose-blockquote">{children}</blockquote>
  ),
  hr: () => <hr className="blog-prose-hr" />,
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className="blog-prose-link"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="blog-prose-strong">{children}</strong>
  ),
  em: ({ children }) => <em className="blog-prose-em">{children}</em>,
  pre: ({ children }) => <pre className="blog-prose-pre">{children}</pre>,
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={`blog-prose-code-block ${className ?? ""}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="blog-prose-code-inline" {...props}>
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="blog-prose-table-wrap">
      <table className="blog-prose-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="blog-prose-thead">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="blog-prose-tr">{children}</tr>,
  th: ({ children }) => <th className="blog-prose-th">{children}</th>,
  td: ({ children }) => <td className="blog-prose-td">{children}</td>,
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <figure className="blog-prose-figure">
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={675}
          className="blog-prose-image"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        {alt ? <figcaption className="blog-prose-caption">{alt}</figcaption> : null}
      </figure>
    );
  },
};

interface BlogMarkdownProps {
  content: string;
}

export default function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
