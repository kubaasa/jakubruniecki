"use client";

import { useIDE } from "@/app/ide/IDEContext";

export function SidebarSplitter() {
  const { dispatch } = useIDE();

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    function onMove(ev: MouseEvent) {
      const sidebar = document.querySelector('[aria-label="Explorer"]');
      if (!sidebar) return;
      const rect = sidebar.getBoundingClientRect();
      dispatch({
        type: "SET_SIDEBAR_TIMELINE_HEIGHT",
        px: rect.bottom - ev.clientY,
      });
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize timeline"
      onMouseDown={onMouseDown}
      className="h-1.5 flex-shrink-0 cursor-row-resize bg-border hover:bg-accent-blue-dim active:bg-accent-blue"
    />
  );
}
