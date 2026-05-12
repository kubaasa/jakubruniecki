"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { fileTree } from "@/data/files";
import { runCommand } from "@/data/commands";

export function Terminal() {
  const { state, dispatch } = useIDE();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [state.terminalLines]);

  useEffect(() => {
    function onFocus() {
      inputRef.current?.focus();
    }
    window.addEventListener("ide:focus-terminal", onFocus);
    return () => window.removeEventListener("ide:focus-terminal", onFocus);
  }, []);

  function submit(raw: string) {
    const value = raw.trim();
    dispatch({ type: "TERMINAL_APPEND", line: { kind: "input", text: value } });
    if (!value) return;
    historyRef.current = [...historyRef.current, value];
    setHistoryIdx(-1);
    const lines = runCommand(value, { files: fileTree, dispatch });
    for (const line of lines) {
      dispatch({ type: "TERMINAL_APPEND", line });
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(draft);
      setDraft("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const hist = historyRef.current;
      if (!hist.length) return;
      const nextIdx = historyIdx < 0 ? hist.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setDraft(hist[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const hist = historyRef.current;
      if (historyIdx < 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= hist.length) {
        setHistoryIdx(-1);
        setDraft("");
      } else {
        setHistoryIdx(nextIdx);
        setDraft(hist[nextIdx] ?? "");
      }
    }
  }

  return (
    <div
      className="flex h-full flex-1 flex-col bg-bg-base font-mono text-[12px] leading-[1.6]"
      onClick={() => inputRef.current?.focus()}
      role="region"
      aria-label="Terminal"
    >
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-3 py-2"
      >
        {state.terminalLines.map((line, i) => {
          if (line.kind === "input") {
            return (
              <div key={i} className="flex gap-2">
                <span className="text-accent-green">jakub@portfolio</span>
                <span className="text-accent-blue">~/portfolio</span>
                <span className="text-accent-green">❯</span>
                <span className="text-fg">{line.text}</span>
              </div>
            );
          }
          if (line.kind === "error") {
            return (
              <div key={i} className="text-accent-red">
                {line.text || " "}
              </div>
            );
          }
          if (line.kind === "cmd") {
            return (
              <div key={i} className="flex gap-2 text-accent-green">
                <span>›</span>
                <span>{line.text}</span>
              </div>
            );
          }
          if (line.kind === "success") {
            return (
              <div key={i} className="text-accent-green">
                {line.text || " "}
              </div>
            );
          }
          if (line.kind === "warn") {
            return (
              <div key={i} className="text-accent-yellow">
                {line.text || " "}
              </div>
            );
          }
          if (line.kind === "helpRow") {
            return (
              <div key={i} className="flex gap-4 pl-2">
                <span className="min-w-[110px] text-accent-green">
                  {line.cmd}
                </span>
                <span className="text-fg-muted">{line.desc}</span>
              </div>
            );
          }
          if (line.kind === "system") {
            if (line.href) {
              return (
                <div key={i}>
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    {line.text}
                  </a>
                </div>
              );
            }
            return (
              <div key={i} className="text-accent-blue">
                {line.text || " "}
              </div>
            );
          }
          return (
            <div key={i} className="text-fg-muted">
              {line.text || " "}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border-subtle px-3 py-1.5">
        <span className="text-accent-green">jakub@portfolio</span>
        <span className="text-accent-blue">~/portfolio</span>
        <span className="text-accent-green">❯</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle"
          placeholder="type 'help'"
        />
      </div>
    </div>
  );
}
