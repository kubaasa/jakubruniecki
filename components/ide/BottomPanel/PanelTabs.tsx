"use client";

import { useIDE } from "@/app/ide/IDEContext";

export function PanelTabs() {
  const { state } = useIDE();
  const passed = state.testSuites
    .flatMap((s) => s.cases)
    .filter((c) => c.status === "pass").length;
  const testResultsMeta = passed > 0 ? String(passed) : "·";

  return (
    <div className="flex h-8 items-center justify-between border-b border-border-subtle bg-bg-surface px-3 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
      <div className="flex items-center gap-4">
        <span>
          PROBLEMS<span className="ml-1 text-fg-subtle">(0)</span>
        </span>
        <span>OUTPUT</span>
        <span className="flex items-center gap-1 text-fg">
          <span className="text-accent-green">●</span>
          TERMINAL
        </span>
        <span>
          TEST RESULTS
          <span
            className={`ml-1 ${passed > 0 ? "text-accent-green" : "text-fg-subtle"}`}
          >
            ({testResultsMeta})
          </span>
        </span>
      </div>
      <div className="font-mono text-[11px] normal-case text-fg-muted">
        zsh — portfolio | node v20.11.0
      </div>
    </div>
  );
}
