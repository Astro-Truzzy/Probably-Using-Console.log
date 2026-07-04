export default function PostLoading() {
  return (
    <article className="animate-pulse" aria-busy="true" aria-label="Loading post">
      <div className="h-6 w-24 rounded bg-[var(--surface)]" />
      <div className="mt-4 h-10 w-3/4 rounded bg-[var(--surface)]" />
      <div className="mt-3 h-4 w-48 rounded bg-[var(--surface)]" />
      <div className="mt-6 aspect-video rounded-xl bg-[var(--surface)]" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-[var(--surface)]" />
        <div className="h-4 w-full rounded bg-[var(--surface)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--surface)]" />
      </div>
    </article>
  );
}
