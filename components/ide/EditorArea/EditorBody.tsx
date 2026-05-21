"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { allFiles, getFileByPath } from "@/data/files";
import { SyntaxHighlight } from "@/components/ui/SyntaxHighlight";
import { ReadmePreview } from "./ReadmePreview";
import { ImagePreview } from "./ImagePreview";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const TYPE_DELAY_MS = 700;
const CHARS_PER_TICK = 12;
const TICK_MS = 16;
const TOAST_VISIBLE_MS = 1800;

export function EditorBody() {
  const { state, dispatch } = useIDE();
  const file = state.activeTabPath ? getFileByPath(state.activeTabPath) : null;
  const [typed, setTyped] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const typedSetRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionsRef = useRef<Map<string, number>>(new Map());

  function handleOpenPng(filename: string) {
    const target = allFiles.find(
      (f) => f.language === "png" && f.name === filename,
    );
    if (target) dispatch({ type: "OPEN_FILE", path: target.path });
  }

  function handleCopy(value: string) {
    const preview =
      value.length > 24 ? `${value.slice(0, 12)}…${value.slice(-8)}` : value;
    setToast(`Copied  ${preview}  to clipboard`);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, TOAST_VISIBLE_MS);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // VS Code-like per-file scroll memory: restore on file open, save on switch.
  useEffect(() => {
    if (!file) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const path = file.path;
    const positions = scrollPositionsRef.current;
    const saved = positions.get(path) ?? 0;
    container.scrollTop = saved;
    return () => {
      positions.set(path, container.scrollTop);
    };
  }, [file]);

  useEffect(() => {
    if (!file) return;
    if (file.language === "png") return;
    // Snapshot content once - some files use a getter that recomputes on each access.
    const content = file.content;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typedSetRef.current.has(file.path) || prefersReducedMotion()) {
      setTyped(content);
      typedSetRef.current.add(file.path);
      return;
    }
    setTyped("");
    let cancelled = false;
    let startId: number | null = null;
    const fontsReady =
      typeof document !== "undefined" && document.fonts?.ready
        ? document.fonts.ready
        : Promise.resolve();
    fontsReady.then(() => {
      if (cancelled) return;
      startId = window.setTimeout(() => {
        let i = 0;
        timerRef.current = window.setInterval(() => {
          i += CHARS_PER_TICK;
          if (i >= content.length) {
            setTyped(content);
            typedSetRef.current.add(file.path);
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
          } else {
            setTyped(content.slice(0, i));
          }
        }, TICK_MS);
      }, TYPE_DELAY_MS);
    });
    return () => {
      cancelled = true;
      if (startId !== null) window.clearTimeout(startId);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [file]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-fg-muted">
        No file open. Use the explorer or run <code className="mx-1">open &lt;file&gt;</code> in the terminal.
      </div>
    );
  }
  if (file.path === "README.md") {
    return <ReadmePreview />;
  }
  if (file.language === "png") {
    return <ImagePreview src={file.content} alt={file.name} />;
  }
  const totalLineCount = Math.max(1, file.content.split("\n").length);
  return (
    <div className="relative h-full">
      <div
        ref={scrollContainerRef}
        className="flex h-full overflow-auto bg-bg-base [scrollbar-gutter:stable]"
      >
        <pre className="min-w-0 flex-1 py-3">
          <SyntaxHighlight
            key={file.path}
            content={typed}
            language={file.language}
            onCopy={handleCopy}
            onOpenPng={handleOpenPng}
            totalLines={totalLineCount}
          />
          <span
            aria-hidden
            className="ml-0.5 inline-block w-2 bg-fg"
            style={{
              animation: "caret-blink 1s steps(1) infinite",
              height: "1em",
              verticalAlign: "-2px",
            }}
          />
        </pre>
      </div>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-md border border-accent-green/40 bg-bg-surface px-3 py-1.5 font-mono text-[12px] text-accent-green shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
