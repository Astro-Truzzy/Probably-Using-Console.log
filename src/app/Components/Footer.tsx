import { socialLinks } from "@lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  const socialItems = [
    { label: "GitHub", href: socialLinks.github },
    { label: "Twitter", href: socialLinks.twitter },
    { label: "LinkedIn", href: socialLinks.linkedIn },
  ].filter((item) => item.href);

  return (
    <footer className="w-full bg-(--bg-footer) text-(--text-muted) py-8 font-mono text-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-(--text-main)">
            <span className="text-(--accent)">process.exit(0)</span>
            {" — "}
            Powered by Trust Williams
          </div>
          {socialItems.length > 0 && (
            <div className="mt-2 text-xs flex flex-wrap items-center gap-1">
              <span>Follow:</span>
              {socialItems.map((item, index) => (
                <span key={item.label}>
                  {index > 0 ? " · " : " "}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--accent) hover:underline"
                  >
                    {item.label}
                  </a>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs">
          © {year} Trust Williams — probably using console.log()
        </div>
      </div>
    </footer>
  );
}
