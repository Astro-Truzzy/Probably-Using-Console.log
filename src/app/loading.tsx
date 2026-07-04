export default function Loading() {
  return (
    <div className="py-12 animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-48 rounded bg-[var(--surface)]" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-[var(--surface)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--surface)]" />
        <div className="h-4 w-4/6 rounded bg-[var(--surface)]" />
      </div>
    </div>
  );
}
