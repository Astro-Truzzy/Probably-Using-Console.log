export default function About() {
  return (
    <section>
      <h1 className="text-3xl font-mono">About</h1>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div className="terminal">
          <p>
            Trust Williams — developer-founder. Building products, teaching, and
            shipping things to production.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Mission</h4>
          <p className="mt-2 text-[var(--text-muted)]">
            Share practical lessons in engineering and startups.
          </p>
        </div>
      </div>
    </section>
  );
}
