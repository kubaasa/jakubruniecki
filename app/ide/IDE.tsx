"use client";

import { useEffect } from "react";
import { IDEProvider, useIDE } from "./IDEContext";
import { TitleBar } from "@/components/ide/TitleBar";
import { ActivityBar } from "@/components/ide/ActivityBar";
import { Sidebar } from "@/components/ide/Sidebar/Sidebar";
import { EditorArea } from "@/components/ide/EditorArea/EditorArea";
import { StatusBar } from "@/components/ide/StatusBar";
import { CommandPalette } from "@/components/ide/CommandPalette";

function GlobalShortcuts() {
  const { dispatch } = useIDE();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dispatch({ type: "TOGGLE_PALETTE" });
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        dispatch({ type: "TOGGLE_SIDEBAR" });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dispatch]);
  return null;
}

function ConsoleEgg() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.console) return;
    const green = "color:#3fb950;font-family:monospace;font-size:12px";
    const muted = "color:#7d8590;font-family:monospace";
    console.log("%cJakub Bruniecki - QA Automation Engineer", green);
    console.log("%cIf you're reading this, you have to hire me now.", muted);
    console.log("%cjakubruniecki@gmail.com", muted);
  }, []);
  return null;
}

export function IDE() {
  return (
    <IDEProvider>
      <a
        href="#seo-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-bg-elevated focus:px-3 focus:py-2 focus:font-mono focus:text-sm"
      >
        Skip to readable content
      </a>
      <GlobalShortcuts />
      <ConsoleEgg />
      <div
        role="application"
        aria-label="Jakub Bruniecki - portfolio IDE"
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
      <CommandPalette />
    </IDEProvider>
  );
}
