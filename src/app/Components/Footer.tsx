export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-(--bg-footer) text-(--text-muted) py-8 font-mono text-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-(--text-main)">
            <span className="text-(--accent)">process.exit(0)</span>
            {" — "}
            Powered by Trust Williams
          </div>
          <div className="mt-2 text-xs">
            Follow: GitHub · Twitter · LinkedIn
          </div>
        </div>
        <div className="text-xs">
          © {year} Trust Williams — probably using console.log()
        </div>
      </div>
    </footer>
  );
}
