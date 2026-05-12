"use client";

const TABS: ReadonlyArray<{ label: string; meta?: string; active?: boolean }> = [
  { label: "PROBLEMS", meta: "0" },
  { label: "OUTPUT" },
  { label: "TERMINAL", active: true },
  { label: "TEST RESULTS", meta: "·" },
];

export function PanelTabs() {
  return (
    <div className="flex h-8 items-center justify-between border-b border-border-subtle bg-bg-surface px-3 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
      <div className="flex items-center gap-4">
        {TABS.map((t) => (
          <span
            key={t.label}
            className={t.active ? "flex items-center gap-1 text-fg" : ""}
          >
            {t.active ? <span className="text-accent-green">●</span> : null}
            {t.label}
            {t.meta ? <span className="ml-1 text-fg-subtle">({t.meta})</span> : null}
          </span>
        ))}
      </div>
      <div className="font-mono text-[11px] normal-case text-fg-muted">
        zsh — portfolio | node v20.11.0
      </div>
    </div>
  );
}
