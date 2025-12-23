/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import PageWrapper from "./Components/PageWrapper";

const SITE_URL = "https://probably-using-console.log";

export const metadata = {
  title: "Probably Using Console.log()",
  description:
    "Debugging life, one log at a time. Developer blog by Trust Williams.",
  keywords: [
    "developer",
    "blog",
    "javascript",
    "web3",
    "debugging",
    "console.log",
  ],
  authors: [{ name: "Trust Williams" }],
  themeColor: "#020617",
  openGraph: {
    title: "Probably Using Console.log()",
    description:
      "Debugging life, one log at a time. Developer blog by Trust Williams.",
    url: SITE_URL,
    siteName: "Probably Using Console.log()",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Probably Using Console.log()",
    description:
      "Debugging life, one log at a time. Developer blog by Trust Williams.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Fira+Code:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#020617] text-(--text-light) antialiased scroll-smooth mi">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
          <PageWrapper>{children}</PageWrapper>
        </main>
        <Footer />
      </body>
    </html>
  );
}
