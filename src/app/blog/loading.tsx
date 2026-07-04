export default function BlogLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading blog">
      <div className="h-8 w-32 rounded bg-[var(--surface)]" />
      <div className="mt-6 h-10 w-full max-w-md rounded bg-[var(--surface)]" />
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-section)]"
          />
        ))}
      </div>
    </div>
  );
}
