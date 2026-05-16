"use client";

import type { RefObject } from "react";
import { useIDE } from "@/app/ide/IDEContext";

export function SidebarSplitter({
  sidebarRef,
}: {
  sidebarRef: RefObject<HTMLElement | null>;
}) {
  const { dispatch } = useIDE();

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const rect = sidebar.getBoundingClientRect();
    dispatch({
      type: "SET_SIDEBAR_TIMELINE_HEIGHT",
      px: rect.bottom - e.clientY,
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize bottom dock"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="h-1.5 flex-shrink-0 cursor-row-resize touch-none border-t border-border-subtle hover:border-accent-blue-dim/60 active:border-accent-blue"
    />
  );
}
