"use client";

const ITEMS: ReadonlyArray<string> = [
  "2026 · Senior QA · open to remote",
  "2024 · 3d → 4h regression",
  "2023 · Playwright + CI",
  "2020 · First QA role",
];

export function Timeline() {
  return (
    <section aria-label="Timeline" className="px-3 py-2">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
        Timeline
      </div>
      <ul className="space-y-1 font-mono text-[12px] text-fg-muted">
        {ITEMS.map((text) => (
          <li key={text} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent-blue"
              aria-hidden
            />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
