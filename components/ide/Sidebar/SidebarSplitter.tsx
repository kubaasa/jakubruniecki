"use client";

import { useEffect, useRef } from "react";
import { useIDE } from "@/app/ide/IDEContext";

export function SidebarSplitter() {
  const { dispatch } = useIDE();
  const draggingRef = useRef(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const sidebar = document.querySelector('[aria-label="Explorer"]');
      if (!sidebar) return;
      const rect = sidebar.getBoundingClientRect();
      const distFromBottom = rect.bottom - e.clientY;
      dispatch({ type: "SET_SIDEBAR_TIMELINE_HEIGHT", px: distFromBottom });
    }
    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dispatch]);

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize timeline"
      onMouseDown={(e) => {
        e.preventDefault();
        draggingRef.current = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
      }}
      className="group relative h-2 flex-shrink-0 cursor-row-resize hover:bg-accent-blue-dim/30 active:bg-accent-blue-dim/50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border group-hover:bg-accent-blue group-active:bg-accent-blue"
      />
    </div>
  );
}
