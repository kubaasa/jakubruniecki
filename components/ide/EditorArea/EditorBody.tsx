"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { SyntaxHighlight } from "@/components/ui/SyntaxHighlight";

export function EditorBody() {
  const { state } = useIDE();
  const file = state.activeTabPath ? getFileByPath(state.activeTabPath) : null;
  if (!file) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-fg-muted">
        No file open. Use the explorer or run <code className="mx-1">open &lt;file&gt;</code> in the terminal.
      </div>
    );
  }
  const lineCount = file.content.split("\n").length;
  return (
    <div className="flex h-full overflow-auto bg-bg-base">
      <div
        aria-hidden
        className="select-none border-r border-border-subtle px-3 py-3 text-right font-mono text-[12px] leading-[1.6] text-fg-subtle"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="flex-1 px-4 py-3">
        <SyntaxHighlight content={file.content} language={file.language} />
      </pre>
    </div>
  );
}
