"use client";

import { useIDE } from "@/app/ide/IDEContext";
import type { ActivityAction } from "@/app/ide/types";
import {
  ExplorerIcon,
  SearchIcon,
  GitIcon,
  RunActivityIcon,
  StopIcon,
  ExtensionsIcon,
  SettingsIcon,
} from "@/components/ui/Icon";

type Entry = {
  action: ActivityAction;
  label: string;
  Icon: typeof ExplorerIcon;
};

const TOP_ENTRIES: Entry[] = [
  { action: "explorer", label: "Explorer", Icon: ExplorerIcon },
  { action: "search", label: "Search", Icon: SearchIcon },
  { action: "git", label: "Source control (soon)", Icon: GitIcon },
  { action: "run", label: "Run tests", Icon: RunActivityIcon },
  { action: "ext", label: "Extensions (soon)", Icon: ExtensionsIcon },
];

const BOTTOM_ENTRIES: Entry[] = [
  { action: "settings", label: "Settings (soon)", Icon: SettingsIcon },
];

function ActivityButton({ entry }: { entry: Entry }) {
  const { state, dispatch } = useIDE();
  const { action, label, Icon } = entry;
  const active = state.activeActivityAction === action;
  const isRunToggle = action === "run";
  const testRunning = isRunToggle && state.isTestRunning;

  return (
    <button
      type="button"
      title={testRunning ? "Stop tests" : label}
      aria-label={testRunning ? "Stop tests" : label}
      aria-pressed={active}
      aria-expanded={
        action === "explorer" ? !state.sidebarHidden : undefined
      }
      data-action={action}
      onClick={() => {
        dispatch({ type: "SET_ACTIVITY", action });
        if (action === "explorer") {
          dispatch({ type: "TOGGLE_SIDEBAR" });
        } else if (action === "search") {
          dispatch({ type: "TOGGLE_PALETTE", open: true });
        } else if (action === "run") {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent(
                state.isTestRunning ? "ide:stop-tests" : "ide:run-all-tests",
              ),
            );
          }
        }
      }}
      className={`relative flex h-10 w-10 items-center justify-center text-fg-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue ${
        active ? "text-fg" : ""
      }`}
    >
      {active ? (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-accent-green"
        />
      ) : null}
      {testRunning ? (
        <StopIcon className="h-5 w-5" width={20} height={20} />
      ) : (
        <Icon className="h-5 w-5" width={20} height={20} />
      )}
    </button>
  );
}

export function ActivityBar() {
  return (
    <nav
      aria-label="Activity bar"
      style={{ animationDelay: "60ms" }}
      className="boot-reveal flex w-[var(--ide-activitybar-w)] flex-col items-center border-r border-border bg-bg-deeper py-2"
    >
      <div className="flex flex-col items-center gap-1">
        {TOP_ENTRIES.map((entry) => (
          <ActivityButton key={entry.action} entry={entry} />
        ))}
      </div>
      <div className="flex-1" aria-hidden />
      <div className="flex flex-col items-center gap-1">
        {BOTTOM_ENTRIES.map((entry) => (
          <ActivityButton key={entry.action} entry={entry} />
        ))}
      </div>
    </nav>
  );
}
