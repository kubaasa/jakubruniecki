"use client";

import { useIDE } from "@/app/ide/IDEContext";

const TABS: ReadonlyArray<{ label: string; meta?: string }> = [
  { label: "PROBLEMS", meta: "0" },
  { label: "OUTPUT" },
  { label: "TERMINAL" },
  { label: "TEST RESULTS", meta: "·" },
];

export function BottomPanel() {
  const { state } = useIDE();
  return (
    <section
      aria-label="Bottom panel"
      style={{ height: state.panelHeightPx }}
      className="flex flex-col border-t border-border bg-bg-base"
    >
      <div className="flex h-8 items-center justify-between border-b border-border-subtle bg-bg-surface px-3 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
        <div className="flex items-center gap-4">
          {TABS.map((t, i) => (
            <span
              key={t.label}
              className={i === 2 ? "flex items-center gap-1 text-fg" : ""}
            >
              {i === 2 ? <span className="text-accent-green">●</span> : null}
              {t.label}
              {t.meta ? <span className="ml-1 text-fg-subtle">({t.meta})</span> : null}
            </span>
          ))}
        </div>
        <div className="font-mono text-[11px] normal-case text-fg-muted">
          zsh — portfolio | node v20.11.0
        </div>
      </div>
      <div className="flex-1 overflow-hidden" aria-hidden />
    </section>
  );
}
