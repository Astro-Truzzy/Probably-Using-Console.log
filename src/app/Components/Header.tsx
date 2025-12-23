import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-40 glass py-3 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-lg text-(--accent)">
            probably using console.log()
          </Link>
          <span className="hidden md:inline text-sm text-(--text-muted)">
            Debugging life, one log at a time.
          </span>
        </div>

        <div className=" pt-lg-2">

        </div>

        <nav className="flex items-center gap-4">
          <Link href="/blog" className="text-sm hover:text-(--accent)">
            Blogs
          </Link>
          <Link href="/about" className="text-sm hover:text-(--accent)">
            About
          </Link>
          <Link href="/contact" className="text-sm hover:text-(--accent)">
            Contact
          </Link>
          <Link href="/admin" className="text-sm hover:text-(--accent)">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
