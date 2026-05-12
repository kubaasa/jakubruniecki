"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { fileTree } from "@/data/files";
import { ChevronIcon } from "@/components/ui/Icon";
import { FileTreeNode } from "./FileTreeNode";

export function FileTree() {
  const { state, dispatch } = useIDE();
  const collapsed = state.filesCollapsed;
  return (
    <section aria-label="Files" className="border-b border-border-subtle">
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_FILES_SECTION" })}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-1 px-3 py-1 text-left font-mono text-[11px] uppercase tracking-wide text-fg-muted hover:text-fg"
      >
        <ChevronIcon
          className={`h-3 w-3 transition-transform ${collapsed ? "" : "rotate-90"}`}
          width={12}
          height={12}
        />
        jakubruniecki
      </button>
      {collapsed ? null : (
        <div role="tree" aria-label="Project files" className="pb-2">
          {fileTree[0]?.type === "folder"
            ? fileTree[0].children.map((node) => (
                <FileTreeNode key={node.path} node={node} depth={0} />
              ))
            : null}
        </div>
      )}
    </section>
  );
}
