import { extractHeadings } from "@lib/markdown-headings";

interface BlogTableOfContentsProps {
  content: string;
}

export default function BlogTableOfContents({
  content,
}: BlogTableOfContentsProps) {
  const headings = extractHeadings(content);
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="blog-toc">
      <p className="blog-toc-label font-mono">$ cat --toc</p>
      <ol className="blog-toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={
              heading.level === 3 ? "blog-toc-item blog-toc-item-nested" : "blog-toc-item"
            }
          >
            <a href={`#${heading.id}`} className="blog-toc-link">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
