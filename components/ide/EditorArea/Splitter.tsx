"use client";

export function Splitter() {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize bottom panel"
      className="h-[var(--ide-splitter-h)] cursor-row-resize bg-border hover:bg-accent-blue-dim"
    />
  );
}
