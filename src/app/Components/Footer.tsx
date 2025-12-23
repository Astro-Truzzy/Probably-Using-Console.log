export default function Footer() {
  return (
    <footer className="w-full bg-[#020617] text-(--text-muted) py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <strong>
            Powered by Trust Williams — Probably Using Console.log()
          </strong>
          <div className="text-sm mt-2">
            Follow: GitHub · Twitter · LinkedIn
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-sm">
          © {new Date().getFullYear()} Trust Williams
        </div>
      </div>
    </footer>
  );
}
