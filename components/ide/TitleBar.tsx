"use client";

export function TitleBar() {
  return (
    <header
      className="flex h-[var(--ide-titlebar-h)] items-center border-b border-border bg-bg-surface px-3"
      role="banner"
    >
      <div className="flex items-center gap-2" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-70" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-70" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-70" />
      </div>
      <div className="flex flex-1 items-center justify-center gap-2 font-mono text-xs text-fg-muted">
        <span className="h-2 w-2 rounded-full bg-accent-green" aria-hidden />
        jakubruniecki - portfolio.code
      </div>
      <div className="w-16" aria-hidden />
    </header>
  );
}
