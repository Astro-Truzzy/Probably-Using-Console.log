import type { Metadata } from "next";
import type { Post } from "./types";
import {
  authorEmail,
  authorName,
  googleSiteVerification,
  siteDescription,
  siteName,
  siteUrl,
} from "./config";

export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteName,
};

function resolveTwitterImages(
  images: NonNullable<Metadata["openGraph"]>["images"]
): string[] {
  const list = Array.isArray(images) ? images : images ? [images] : [];
  if (list.length === 0) return [defaultOgImage.url];
  return list.map((image) => {
    if (typeof image === "string") return image;
    if (image instanceof URL) return image.toString();
    return image.url.toString();
  });
}

const siteKeywords = [
  "Trust Williams",
  "developer blog",
  "full-stack developer",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "React",
  "Web3",
  "debugging",
  "console.log",
  "Ridely",
  "Ownbase",
  "Nigeria developer",
];

export function rootMetadata(): Metadata {
  const verification: Metadata["verification"] = {};
  if (googleSiteVerification) {
    verification.google = googleSiteVerification;
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    applicationName: siteName,
    keywords: siteKeywords,
    authors: [{ name: authorName, url: `${siteUrl}/about` }],
    creator: authorName,
    publisher: authorName,
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: siteUrl,
      siteName,
      locale: "en_US",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [defaultOgImage.url],
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

export function pageMetadata({
  title,
  description,
  path = "",
  openGraphType = "website",
  noIndex = false,
  images,
}: {
  title?: string;
  description?: string;
  path?: string;
  openGraphType?: "website" | "article";
  noIndex?: boolean;
  images?: NonNullable<Metadata["openGraph"]>["images"];
}): Metadata {
  const url = `${siteUrl}${path}`;
  const desc = description ?? siteDescription;
  const ogImages = images ?? [defaultOgImage];
  const resolvedTitle = title ?? siteName;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: resolvedTitle,
      description: desc,
      url,
      siteName,
      locale: "en_US",
      type: openGraphType,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: desc,
      images: resolveTwitterImages(ogImages),
    },
  };
}

export function articleMetadata(post: Post): Metadata {
  const path = `/blog/${post.slug}`;
  const description =
    post.excerpt || post.description || post.content?.slice(0, 160);
  const images = post.cover
    ? [{ url: post.cover, alt: post.title }]
    : [defaultOgImage];

  return {
    ...pageMetadata({
      title: post.title,
      description,
      path,
      openGraphType: "article",
      images,
    }),
    openGraph: {
      title: post.title,
      description,
      url: `${siteUrl}${path}`,
      siteName,
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author || authorName],
      tags: post.tags,
      images,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "en-US",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon`,
        },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: authorName,
        url: `${siteUrl}/about`,
        email: authorEmail,
        jobTitle: "Full-Stack Developer",
        worksFor: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export function articleJsonLd(post: Post) {
  const canonical = `${siteUrl}/blog/${post.slug}`;
  const description =
    post.excerpt || post.description || post.content?.slice(0, 160);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    author: {
      "@type": "Person",
      name: post.author || authorName,
      url: `${siteUrl}/about`,
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    url: canonical,
    image: post.cover ? [post.cover] : [`${siteUrl}/opengraph-image`],
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon`,
      },
    },
    keywords: post.tags?.join(", "),
    inLanguage: "en-US",
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: authorName,
      email: authorEmail,
      url: `${siteUrl}/about`,
      jobTitle: "Full-Stack Developer & Founder",
      description: siteDescription,
      knowsAbout: [
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Web3",
        "UI/UX Design",
        "Data Analysis",
      ],
      worksFor: [
        { "@type": "Organization", name: "Ridely" },
        { "@type": "Organization", name: "Ownbase" },
      ],
    },
  };
}
