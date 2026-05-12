"use client";

import { useIDE } from "@/app/ide/IDEContext";
import type { FileNode } from "@/app/ide/types";
import { ChevronIcon, FileIcon, FolderIcon } from "@/components/ui/Icon";

export function FileTreeNode({
  node,
  depth,
}: {
  node: FileNode;
  depth: number;
}) {
  const { state, dispatch } = useIDE();
  const indent = { paddingLeft: 8 + depth * 12 };

  if (node.type === "folder") {
    const open = state.treeOpenFolders[node.path] ?? false;
    return (
      <>
        <button
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_FOLDER", path: node.path })}
          aria-expanded={open}
          style={indent}
          className="flex w-full items-center gap-1 py-0.5 text-left text-[13px] text-fg hover:bg-bg-subtle"
        >
          <ChevronIcon
            className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
            width={12}
            height={12}
          />
          <FolderIcon className="h-3.5 w-3.5 text-accent-blue" width={14} height={14} />
          <span>{node.name}</span>
        </button>
        {open
          ? node.children.map((child) => (
              <FileTreeNode key={child.path} node={child} depth={depth + 1} />
            ))
          : null}
      </>
    );
  }

  const active = state.activeTabPath === node.path;
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "OPEN_FILE", path: node.path })}
      style={indent}
      className={`flex w-full items-center gap-1 py-0.5 text-left text-[13px] ${
        active ? "bg-bg-elevated text-fg" : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
      }`}
    >
      <span className="w-3" aria-hidden />
      <FileIcon
        language={node.language}
        className="h-3.5 w-3.5"
        width={14}
        height={14}
      />
      <span>{node.name}</span>
    </button>
  );
}
