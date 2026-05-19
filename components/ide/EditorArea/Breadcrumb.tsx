"use client";

import { useIDE } from "@/app/ide/IDEContext";

export function Breadcrumb() {
  const { state } = useIDE();
  const path = state.activeTabPath;
  if (!path) return null;
  const parts = path.split("/");
  const segments = ["portfolio", ...parts];
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-6 items-center overflow-x-auto whitespace-nowrap border-b border-border-subtle bg-bg-base px-3 font-mono text-[11px] text-fg-muted [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex shrink-0 items-center">
          {i > 0 ? <span className="mx-1 text-fg-subtle">›</span> : null}
          {seg}
        </span>
      ))}
    </nav>
  );
}
