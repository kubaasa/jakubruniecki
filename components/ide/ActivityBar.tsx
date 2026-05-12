"use client";

import { useIDE } from "@/app/ide/IDEContext";
import type { ActivityAction } from "@/app/ide/types";
import {
  ExplorerIcon,
  SearchIcon,
  GitIcon,
  PlayIcon,
  ExtensionsIcon,
  SettingsIcon,
} from "@/components/ui/Icon";

type Entry = {
  action: ActivityAction;
  label: string;
  Icon: typeof ExplorerIcon;
};

const ENTRIES: Entry[] = [
  { action: "explorer", label: "Explorer", Icon: ExplorerIcon },
  { action: "search", label: "Search", Icon: SearchIcon },
  { action: "git", label: "Source control", Icon: GitIcon },
  { action: "run", label: "Run tests", Icon: PlayIcon },
  { action: "ext", label: "Extensions", Icon: ExtensionsIcon },
  { action: "settings", label: "Settings", Icon: SettingsIcon },
];

export function ActivityBar() {
  const { state, dispatch } = useIDE();
  return (
    <nav
      aria-label="Activity bar"
      className="flex w-[var(--ide-activitybar-w)] flex-col items-center gap-1 border-r border-border bg-bg-deeper py-2"
    >
      {ENTRIES.map(({ action, label, Icon }) => {
        const active = state.activeActivityAction === action;
        return (
          <button
            key={action}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            data-action={action}
            onClick={() => {
              dispatch({ type: "SET_ACTIVITY", action });
              if (action === "search") {
                dispatch({ type: "TOGGLE_PALETTE", open: true });
              } else if (action === "run") {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("ide:run-all-tests"));
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
            <Icon className="h-5 w-5" width={20} height={20} />
          </button>
        );
      })}
    </nav>
  );
}
