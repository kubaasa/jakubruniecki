"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { ChevronIcon, CloseIcon, FileIcon } from "@/components/ui/Icon";

export function OpenEditors() {
  const { state, dispatch } = useIDE();
  const collapsed = state.openEditorsCollapsed;
  return (
    <section aria-label="Open editors" className="border-b border-border-subtle">
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_OPEN_EDITORS" })}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-1 px-3 py-1 text-left font-mono text-[11px] uppercase tracking-wide text-fg-muted hover:text-fg"
      >
        <ChevronIcon
          className={`h-3 w-3 transition-transform ${collapsed ? "" : "rotate-90"}`}
          width={12}
          height={12}
        />
        Open editors
      </button>
      {collapsed ? null : (
        <ul className="pb-1">
          {state.openTabs.map((tab) => {
            const file = getFileByPath(tab.path);
            if (!file) return null;
            const active = state.activeTabPath === tab.path;
            return (
              <li key={tab.path}>
                <div
                  className={`group flex items-center gap-1 px-4 py-0.5 text-[13px] ${
                    active ? "bg-bg-elevated text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "SET_ACTIVE_TAB", path: tab.path })
                    }
                    className="flex flex-1 items-center gap-1.5 text-left"
                  >
                    <FileIcon
                      language={file.language}
                      className="h-3.5 w-3.5"
                      width={14}
                      height={14}
                    />
                    {file.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Close ${file.name}`}
                    onClick={() => dispatch({ type: "CLOSE_TAB", path: tab.path })}
                    className="rounded p-0.5 text-fg-muted opacity-0 hover:bg-bg-subtle hover:text-fg group-hover:opacity-100"
                  >
                    <CloseIcon
                      className="h-3 w-3"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
