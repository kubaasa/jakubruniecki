type WindowChromeProps = {
  title?: string;
  children: React.ReactNode;
};

export function WindowChrome({ title, children }: WindowChromeProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-base shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border bg-bg-surface px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        {title ? (
          <span className="ml-auto font-mono text-xs text-fg-muted">
            {title}
          </span>
        ) : null}
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
