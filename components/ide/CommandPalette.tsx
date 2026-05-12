"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { allFiles } from "@/data/files";
import { contactLinks, cvRequestHref } from "@/data/contact";
import { fuzzyMatch } from "@/components/ui/fuzzyMatch";

type PaletteItem = {
  label: string;
  kind: "FILE" | "ACTION";
  action: () => void;
};

const GITHUB_URL = "https://github.com/jakubruniecki";

export function CommandPalette() {
  const { state, dispatch } = useIDE();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const items = useMemo<PaletteItem[]>(() => {
    const fileItems: PaletteItem[] = allFiles.map((f) => ({
      label: f.path,
      kind: "FILE",
      action: () => dispatch({ type: "OPEN_FILE", path: f.path }),
    }));
    const email = contactLinks.find((c) => c.icon === "email");
    const linkedin = contactLinks.find((c) => c.icon === "linkedin");
    const actionItems: PaletteItem[] = [
      {
        label: "Request CV",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") window.open(cvRequestHref, "_blank");
        },
      },
      {
        label: "Copy email",
        kind: "ACTION",
        action: () => {
          if (email && typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(email.value).catch(() => {});
            dispatch({
              type: "TERMINAL_APPEND",
              line: { kind: "output", text: `✓ email copied: ${email.value}` },
            });
          }
        },
      },
      {
        label: "Open GitHub",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") window.open(GITHUB_URL, "_blank");
        },
      },
      {
        label: "Open LinkedIn",
        kind: "ACTION",
        action: () => {
          if (linkedin && typeof window !== "undefined")
            window.open(linkedin.href, "_blank");
        },
      },
      {
        label: "Run all tests",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("ide:run-all-tests"));
          }
        },
      },
      {
        label: "Toggle terminal focus",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("ide:focus-terminal"));
          }
        },
      },
    ];
    return [...fileItems, ...actionItems];
  }, [dispatch]);

  const matched = useMemo(
    () => fuzzyMatch(items, query, (i) => i.label).slice(0, 8),
    [items, query],
  );

  useEffect(() => {
    if (!state.isPaletteOpen) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setQuery("");
    setSelectedIdx(0);
    /* eslint-enable react-hooks/set-state-in-effect */
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [state.isPaletteOpen]);

  if (!state.isPaletteOpen) return null;

  function close() {
    dispatch({ type: "TOGGLE_PALETTE", open: false });
  }

  function execute(idx: number) {
    const entry = matched[idx];
    if (!entry) return;
    close();
    entry.item.action();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(matched.length - 1, i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(0, i - 1));
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      execute(selectedIdx);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-[min(640px,90vw)] overflow-hidden rounded-md border border-border bg-bg-surface shadow-2xl">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIdx(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a file name or command…  (⌘K / Ctrl+K to toggle)"
          aria-label="Palette search"
          className="w-full bg-transparent px-4 py-3 font-mono text-sm text-fg outline-none placeholder:text-fg-subtle"
        />
        <ul className="max-h-72 overflow-y-auto border-t border-border">
          {matched.length === 0 ? (
            <li className="px-4 py-3 font-mono text-xs text-fg-muted">
              No matches.
            </li>
          ) : (
            matched.map((m, idx) => (
              <li key={`${m.item.kind}:${m.item.label}`}>
                <button
                  type="button"
                  onMouseEnter={() => setSelectedIdx(idx)}
                  onClick={() => execute(idx)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-1.5 text-left font-mono text-[13px] ${
                    idx === selectedIdx ? "bg-bg-elevated text-fg" : "text-fg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-fg-subtle">›</span>
                    {m.item.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
                    {m.item.kind}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
