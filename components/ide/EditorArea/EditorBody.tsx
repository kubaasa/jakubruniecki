"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
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
  const { state } = useIDE();
  const file = state.activeTabPath ? getFileByPath(state.activeTabPath) : null;
  const [typed, setTyped] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const typedSetRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!file) return;
    if (file.language === "png") return;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typedSetRef.current.has(file.path) || prefersReducedMotion()) {
      setTyped(file.content);
      typedSetRef.current.add(file.path);
      return;
    }
    setTyped("");
    const startId = window.setTimeout(() => {
      let i = 0;
      timerRef.current = window.setInterval(() => {
        i += CHARS_PER_TICK;
        if (i >= file.content.length) {
          setTyped(file.content);
          typedSetRef.current.add(file.path);
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
        } else {
          setTyped(file.content.slice(0, i));
        }
      }, TICK_MS);
    }, TYPE_DELAY_MS);
    return () => {
      window.clearTimeout(startId);
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
  const lineCount = Math.max(1, typed.split("\n").length);
  return (
    <div className="relative flex h-full overflow-auto bg-bg-base">
      <div
        aria-hidden
        className="select-none border-r border-border-subtle px-3 py-3 text-right font-mono text-[13px] leading-[1.6] text-fg-subtle"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="min-w-0 flex-1 px-4 py-3">
        <SyntaxHighlight content={typed} language={file.language} onCopy={handleCopy} />
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
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-accent-green/40 bg-accent-green/10 px-3 py-1.5 font-mono text-[12px] text-accent-green shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
