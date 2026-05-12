"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { PanelTabs } from "./PanelTabs";
import { Terminal } from "./Terminal";
import { TestRunner } from "./TestRunner";

export function BottomPanel() {
  const { state } = useIDE();
  return (
    <section
      aria-label="Bottom panel"
      style={{ height: state.panelHeightPx }}
      className="flex flex-col border-t border-border bg-bg-base"
    >
      <PanelTabs />
      <div className="flex min-h-0 flex-1">
        <Terminal />
        <TestRunner />
      </div>
    </section>
  );
}
