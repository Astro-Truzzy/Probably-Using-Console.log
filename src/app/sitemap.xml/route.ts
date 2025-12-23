import { getAllPosts } from "../../../Lib/posts";

interface Post {
  slug: string;
}

export async function GET() {
  const SITE_URL = 'https://probably-using-console.log';
  const posts = await getAllPosts();

  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/blog`,
    ...posts.map((p: Post) => `${SITE_URL}/blog/${p.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((url) => {
        return `<url><loc>${url}</loc></url>`;
      })
      .join('')}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
