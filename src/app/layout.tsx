import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import PageWrapper from "./Components/PageWrapper";
import JsonLd from "./Components/JsonLd";
import TerminalShell from "./Components/terminal/TerminalShell";
import { rootMetadata, websiteJsonLd } from "@lib/seo";
import { getPostSummaries } from "@lib/posts";
import { firaCode, inter } from "./fonts";

export const metadata: Metadata = rootMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme")||"dark";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){document.documentElement.classList.add("dark")}})()`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPostSummaries();

  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-(--bg-main) text-(--text-main) antialiased scroll-smooth font-sans">
        <JsonLd data={websiteJsonLd()} />
        <TerminalShell posts={posts}>
          <Header />
          <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
            <PageWrapper>{children}</PageWrapper>
          </main>
          <Footer />
        </TerminalShell>
      </body>
    </html>
  );
}
