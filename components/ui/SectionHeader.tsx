type SectionHeaderProps = {
  comment: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ comment, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="mb-10">
      <div className="font-mono text-sm text-fg-muted">{comment}</div>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-prose text-fg-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6 h-px w-12 bg-border" aria-hidden />
    </header>
  );
}
