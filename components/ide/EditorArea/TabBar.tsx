"use client";

import { useRef } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { CloseIcon, FileIcon } from "@/components/ui/Icon";

export function TabBar() {
  const { state, dispatch } = useIDE();
  const dragFromIdx = useRef<number | null>(null);
  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="flex h-[var(--ide-tabbar-h)] items-stretch overflow-x-auto border-b border-border bg-bg-surface"
    >
      {state.openTabs.map((tab, idx) => {
        const file = getFileByPath(tab.path);
        if (!file) return null;
        const active = state.activeTabPath === tab.path;
        return (
          <div
            key={tab.path}
            role="tab"
            aria-selected={active}
            draggable
            onDragStart={(e) => {
              dragFromIdx.current = idx;
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(idx));
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const from = dragFromIdx.current;
              if (from === null || from === idx) return;
              dispatch({ type: "REORDER_TABS", fromIdx: from, toIdx: idx });
              dragFromIdx.current = null;
            }}
            onDragEnd={() => {
              dragFromIdx.current = null;
            }}
            className={`group flex cursor-pointer items-center gap-2 border-r border-border px-3 text-[13px] ${
              active
                ? "bg-bg-base text-fg"
                : "bg-bg-surface text-fg-muted hover:text-fg"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_TAB", path: tab.path })
              }
              className="flex items-center gap-2"
            >
              <FileIcon
                language={file.language}
                className="h-3.5 w-3.5"
                width={14}
                height={14}
              />
              <span>{file.name}</span>
            </button>
            <button
              type="button"
              aria-label={`Close ${file.name}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "CLOSE_TAB", path: tab.path });
              }}
              className="rounded p-0.5 text-fg-muted opacity-0 hover:bg-bg-subtle hover:text-fg group-hover:opacity-100"
            >
              <CloseIcon className="h-3 w-3" width={12} height={12} />
            </button>
          </div>
        );
      })}
      <div className="flex-1 bg-bg-deeper" aria-hidden />
    </div>
  );
}
