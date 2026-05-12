"use client";

import { NewFileIcon, RefreshIcon, CollapseIcon } from "@/components/ui/Icon";
import { OpenEditors } from "./OpenEditors";
import { FileTree } from "./FileTree";
import { Timeline } from "./Timeline";

export function Sidebar() {
  return (
    <aside
      aria-label="Explorer"
      className="flex w-[var(--ide-sidebar-w)] flex-col border-r border-border bg-bg-surface"
    >
      <div className="flex h-8 items-center justify-between border-b border-border-subtle px-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-fg-muted">
          Explorer
        </span>
        <div className="flex items-center gap-1 text-fg-muted">
          <button type="button" aria-label="New file" className="rounded p-1 hover:text-fg">
            <NewFileIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
          <button type="button" aria-label="Refresh" className="rounded p-1 hover:text-fg">
            <RefreshIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
          <button type="button" aria-label="Collapse all" className="rounded p-1 hover:text-fg">
            <CollapseIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <OpenEditors />
        <FileTree />
        <Timeline />
      </div>
    </aside>
  );
}
