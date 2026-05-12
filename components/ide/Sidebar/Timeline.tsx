"use client";

import { useIDE } from "@/app/ide/IDEContext";

const ITEMS: ReadonlyArray<string> = [
  "2026 · Senior QA · open to remote",
  "2024 · 3d → 4h regression",
  "2023 · Playwright + CI",
  "2020 · First QA role",
];

export function Timeline() {
  const { state } = useIDE();
  return (
    <section
      aria-label="Timeline"
      style={{ height: state.sidebarTimelineHeightPx }}
      className="flex flex-shrink-0 flex-col overflow-y-auto border-t border-border-subtle px-3 py-1.5"
    >
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
        Timeline
      </div>
      <ul className="space-y-0.5 font-mono text-[11px] leading-tight text-fg-muted">
        {ITEMS.map((text) => (
          <li key={text} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-blue"
              aria-hidden
            />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
