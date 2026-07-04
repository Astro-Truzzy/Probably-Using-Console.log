import type { MetadataRoute } from "next";
import { getRequestSiteUrl } from "@lib/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getRequestSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}