"use client";

import { IDEProvider } from "./IDEContext";
import { TitleBar } from "@/components/ide/TitleBar";
import { ActivityBar } from "@/components/ide/ActivityBar";
import { Sidebar } from "@/components/ide/Sidebar/Sidebar";
import { EditorArea } from "@/components/ide/EditorArea/EditorArea";
import { StatusBar } from "@/components/ide/StatusBar";

export function IDE() {
  return (
    <IDEProvider>
      <div
        role="application"
        aria-label="Jakub Bruniecki — portfolio IDE"
        className="hidden h-screen flex-col bg-bg-base text-fg md:flex"
      >
        <TitleBar />
        <div className="flex min-h-0 flex-1">
          <ActivityBar />
          <Sidebar />
          <EditorArea />
        </div>
        <StatusBar />
      </div>
    </IDEProvider>
  );
}
