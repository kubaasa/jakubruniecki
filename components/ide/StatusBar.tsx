"use client";

import { useEffect, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { BranchIcon, BellIcon, ErrorDot, WarningDot } from "@/components/ui/Icon";

const EMAIL = "jakubruniecki@gmail.com";
const CV_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent("CV Request")}`;

function languageLabel(path: string | null): string {
  if (!path) return "Plain";
  const f = getFileByPath(path);
  if (!f) return "Plain";
  if (f.language === "ts") return "TypeScript";
  if (f.language === "md") return "Markdown";
  return "Plain";
}

function useWarsawClock(): string {
  const [time, setTime] = useState<string>("--:--:-- CET");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Warsaw",
    });
    function tick() {
      setTime(`${fmt.format(new Date())} CET`);
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function StatusBar() {
  const { state } = useIDE();
  const clock = useWarsawClock();
  return (
    <footer
      role="contentinfo"
      aria-label="Status bar"
      className="flex h-[var(--ide-statusbar-h)] items-center justify-between border-t border-border bg-accent-blue-dim/30 px-3 font-mono text-[11px] text-fg"
    >
      <div className="flex items-center gap-4">
        <a
          href={CV_HREF}
          className="rounded px-1 hover:bg-bg-elevated"
        >
          CV on request
        </a>
        <span className="flex items-center gap-1">
          <BranchIcon className="h-3 w-3" width={12} height={12} />
          main
        </span>
        <span className="flex items-center gap-1">
          <span
            className="h-2 w-2 rounded-full bg-accent-green"
            style={{ animation: "live-pulse 1.6s ease-in-out infinite" }}
            aria-hidden
          />
          build passing
        </span>
        <span className="flex items-center gap-1">
          <ErrorDot className="h-3 w-3" width={12} height={12} />0
        </span>
        <span className="flex items-center gap-1">
          <WarningDot className="h-3 w-3" width={12} height={12} />0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span suppressHydrationWarning>{clock}</span>
        <span>
          Ln {state.cursorLine}, Col {state.cursorCol}
        </span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>{languageLabel(state.activeTabPath)}</span>
        <BellIcon className="h-3 w-3" width={12} height={12} />
      </div>
    </footer>
  );
}
