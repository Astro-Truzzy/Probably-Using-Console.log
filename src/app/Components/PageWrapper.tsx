export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen fade-up">{children}</div>;
}
