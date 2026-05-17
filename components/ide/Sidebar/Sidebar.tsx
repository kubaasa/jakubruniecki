"use client";

import { useRef } from "react";
import { NewFileIcon, RefreshIcon, CollapseIcon } from "@/components/ui/Icon";
import { OpenEditors } from "./OpenEditors";
import { FileTree } from "./FileTree";
import { BottomDock } from "./BottomDock";
import { SidebarSplitter } from "./SidebarSplitter";

export function Sidebar() {
  const sidebarRef = useRef<HTMLElement | null>(null);
  return (
    <aside
      ref={sidebarRef}
      aria-label="Explorer"
      className="flex w-[var(--ide-sidebar-w)] flex-col border-r border-border bg-bg-surface"
    >
      <div className="flex h-8 flex-shrink-0 items-center justify-between border-b border-border-subtle px-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-fg-muted">
          Explorer
        </span>
        <div className="flex items-center gap-1 text-fg-muted">
          <button type="button" title="New file (soon)" aria-label="New file (soon)" className="rounded p-1 hover:text-fg">
            <NewFileIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
          <button type="button" title="Refresh (soon)" aria-label="Refresh (soon)" className="rounded p-1 hover:text-fg">
            <RefreshIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
          <button type="button" title="Collapse all (soon)" aria-label="Collapse all (soon)" className="rounded p-1 hover:text-fg">
            <CollapseIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <OpenEditors />
        <FileTree />
      </div>
      <SidebarSplitter sidebarRef={sidebarRef} />
      <BottomDock />
    </aside>
  );
}
