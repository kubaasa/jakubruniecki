"use client";

import { useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { CloseIcon, FileIcon } from "@/components/ui/Icon";

type DropTarget = { idx: number; side: "before" | "after" };

export function TabBar() {
  const { state, dispatch } = useIDE();
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  function reset() {
    setDraggingIdx(null);
    setDropTarget(null);
  }

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
        const isDragging = draggingIdx === idx;
        const showBefore =
          dropTarget?.idx === idx && dropTarget.side === "before";
        const showAfter =
          dropTarget?.idx === idx && dropTarget.side === "after";
        return (
          <div
            key={tab.path}
            role="tab"
            aria-selected={active}
            draggable
            onDragStart={(e) => {
              setDraggingIdx(idx);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(idx));
            }}
            onDragOver={(e) => {
              if (draggingIdx === null || draggingIdx === idx) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              const rect = e.currentTarget.getBoundingClientRect();
              const side: "before" | "after" =
                e.clientX < rect.left + rect.width / 2 ? "before" : "after";
              setDropTarget((prev) =>
                prev && prev.idx === idx && prev.side === side
                  ? prev
                  : { idx, side },
              );
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggingIdx === null || draggingIdx === idx) {
                reset();
                return;
              }
              const rect = e.currentTarget.getBoundingClientRect();
              const side =
                e.clientX < rect.left + rect.width / 2 ? "before" : "after";
              const from = draggingIdx;
              const insertion = side === "before" ? idx : idx + 1;
              // After removing `from`, indices to the right shift down by 1.
              const toIdx = insertion > from ? insertion - 1 : insertion;
              dispatch({ type: "REORDER_TABS", fromIdx: from, toIdx });
              reset();
            }}
            onDragEnd={reset}
            className={`group relative flex cursor-pointer items-center gap-2 border-r border-border px-3 text-[13px] transition-opacity ${
              active
                ? "bg-bg-base text-fg"
                : "bg-bg-surface text-fg-muted hover:text-fg"
            } ${isDragging ? "opacity-40" : ""}`}
          >
            {active ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent-blue"
              />
            ) : null}
            {showBefore ? (
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
              />
            ) : null}
            {showAfter ? (
              <span
                aria-hidden
                className="pointer-events-none absolute right-0 top-0 h-full w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
              />
            ) : null}
            <button
              type="button"
              title={file.name}
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_TAB", path: tab.path })
              }
              className="flex items-center gap-2"
            >
              <FileIcon
                language={file.language}
                path={file.path}
                className="h-3.5 w-3.5 shrink-0"
                width={14}
                height={14}
              />
              <span className="block max-w-[100px] truncate whitespace-nowrap sm:max-w-[160px] md:max-w-[220px] lg:max-w-none">
                {file.name}
              </span>
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
