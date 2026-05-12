"use client";

import { useEffect, useRef } from "react";
import { useIDE } from "@/app/ide/IDEContext";

export function Splitter() {
  const { dispatch } = useIDE();
  const draggingRef = useRef(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const area = document.querySelector('[aria-label="Editor"]');
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const distFromBottom = rect.bottom - e.clientY;
      const next = Math.max(120, Math.min(600, distFromBottom));
      dispatch({ type: "SET_PANEL_HEIGHT", px: next });
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
      aria-label="Resize bottom panel"
      onMouseDown={(e) => {
        e.preventDefault();
        draggingRef.current = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
      }}
      className="h-[var(--ide-splitter-h)] cursor-row-resize bg-border hover:bg-accent-blue-dim active:bg-accent-blue"
    />
  );
}
