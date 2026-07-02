import type { MetadataRoute } from "next";
import { siteDescription, siteName, siteUrl } from "@lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "console.log",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "en",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
