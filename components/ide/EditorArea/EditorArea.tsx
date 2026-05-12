"use client";

import { TabBar } from "./TabBar";
import { Breadcrumb } from "./Breadcrumb";
import { EditorBody } from "./EditorBody";
import { Splitter } from "./Splitter";
import { BottomPanel } from "@/components/ide/BottomPanel/BottomPanel";

export function EditorArea() {
  return (
    <section
      aria-label="Editor"
      className="flex min-w-0 flex-1 flex-col bg-bg-base"
    >
      <TabBar />
      <Breadcrumb />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          <EditorBody />
        </div>
        <Splitter />
        <BottomPanel />
      </div>
    </section>
  );
}
