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
      className="h-[3px] flex-shrink-0 cursor-row-resize bg-border-subtle hover:bg-accent-blue-dim active:bg-accent-blue"
    />
  );
}
