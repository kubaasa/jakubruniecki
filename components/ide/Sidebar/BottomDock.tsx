"use client";

import { useIDE } from "@/app/ide/IDEContext";
import {
  AUTOMATION_START,
  QA_START,
  formatYears,
  yearsBetween,
} from "@/lib/experience";

type ImpactRow = { metric: string; label: string };
type NowRow = { kind: string; value: string };

const NOW: ReadonlyArray<NowRow> = [
  { kind: "building", value: "AI-augmented E2E suite · Asseco" },
  { kind: "learning", value: "RAG · Obsidian · OpenClaw · Claude OS" },
  { kind: "open to", value: "remote" },
];

export function BottomDock() {
  const { state } = useIDE();

  const totalYears = `${formatYears(yearsBetween(QA_START))}y`;
  const manualYears = formatYears(
    yearsBetween(QA_START, AUTOMATION_START.getTime()),
  );
  const autoYears = formatYears(yearsBetween(AUTOMATION_START));

  const impact: ReadonlyArray<ImpactRow> = [
    {
      metric: totalYears,
      label: `in QA · ${manualYears} manual ·\n${autoYears} auto`,
    },
    { metric: "senior", label: "manual · mid automation" },
    { metric: "ISTQB", label: "Foundation Level certified" },
    { metric: "2", label: "enterprise clients · Polsat · Plus" },
    { metric: "0 → 1", label: "built E2E framework from scratch" },
    { metric: "AI-fwd", label: "Cursor · Claude Code · Playwright MCP/CLI" },
  ];

  return (
    <section
      aria-label="Bottom dock"
      style={{ height: state.sidebarTimelineHeightPx }}
      className="flex flex-shrink-0 flex-col overflow-hidden border-t border-border-subtle px-3 py-2"
    >
      <section aria-labelledby="dock-impact-label">
        <div
          id="dock-impact-label"
          className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted"
        >
          Impact
        </div>
        <ul className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-[11px] leading-tight tabular-nums">
          {impact.map(({ metric, label }) => (
            <li key={metric} className="contents">
              <span
                className="text-center text-accent-blue"
                suppressHydrationWarning
              >
                {metric}
              </span>
              <span
                className="whitespace-pre-line text-fg-muted"
                suppressHydrationWarning
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-2 border-t border-border-subtle" />

      <section aria-labelledby="dock-now-label">
        <div
          id="dock-now-label"
          className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted"
        >
          Now
        </div>
        <ul className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[11px] leading-tight">
          {NOW.map(({ kind, value }) => (
            <li key={kind} className="contents">
              <span className="text-accent-blue" aria-hidden>
                ▸
              </span>
              <span className="text-fg-muted">{kind}</span>
              <span className="text-fg">{value}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
