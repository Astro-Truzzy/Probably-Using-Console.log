interface ConsoleBreadcrumbProps {
  segments: string[];
}

export default function ConsoleBreadcrumb({ segments }: ConsoleBreadcrumbProps) {
  const path = segments.length > 0 ? `~/${segments.join("/")}` : "~";
  return (
    <div className="console-breadcrumb font-mono text-sm text-(--text-muted) mb-4">
      <span className="prompt-user">visitor</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">console.log</span>
      <span className="prompt-colon">:</span>
      <span className="prompt-path">{path}</span>
      <span className="prompt-dollar"> $</span>
    </div>
  );
}
