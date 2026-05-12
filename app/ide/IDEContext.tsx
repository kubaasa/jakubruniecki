"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type {
  IDEAction,
  IDEState,
  TerminalLine,
} from "./types";
import { initialTestSuites } from "@/data/testRuns";

const welcomeLines: TerminalLine[] = [
  { kind: "system", text: "portfolio · zsh" },
  {
    kind: "system",
    text: "Welcome. Type 'help' for commands, or click files in the explorer.",
  },
  { kind: "output", text: "" },
];

const initialState: IDEState = {
  openTabs: [{ path: "README.md" }],
  activeTabPath: "README.md",
  treeOpenFolders: {
    jakubruniecki: true,
    portfolio: true,
    tests: true,
    "case-studies": true,
  },
  openEditorsCollapsed: false,
  filesCollapsed: false,
  panelHeightPx: 336,
  sidebarTimelineHeightPx: 130,
  terminalLines: welcomeLines,
  testSuites: initialTestSuites,
  isPaletteOpen: false,
  activeActivityAction: "explorer",
  cursorLine: 1,
  cursorCol: 1,
};

function clampPanel(px: number): number {
  if (px < 120) return 120;
  if (px > 600) return 600;
  return px;
}

function clampTimeline(px: number): number {
  if (px < 60) return 60;
  if (px > 320) return 320;
  return px;
}

export function ideReducer(state: IDEState, action: IDEAction): IDEState {
  switch (action.type) {
    case "OPEN_FILE": {
      const exists = state.openTabs.some((t) => t.path === action.path);
      const openTabs = exists
        ? state.openTabs
        : [...state.openTabs, { path: action.path }];
      return { ...state, openTabs, activeTabPath: action.path };
    }
    case "CLOSE_TAB": {
      const idx = state.openTabs.findIndex((t) => t.path === action.path);
      if (idx < 0) return state;
      const openTabs = state.openTabs.filter((t) => t.path !== action.path);
      let activeTabPath = state.activeTabPath;
      if (state.activeTabPath === action.path) {
        const next = openTabs[idx - 1] ?? openTabs[idx] ?? null;
        activeTabPath = next ? next.path : null;
      }
      return { ...state, openTabs, activeTabPath };
    }
    case "SET_ACTIVE_TAB":
      return { ...state, activeTabPath: action.path };
    case "REORDER_TABS": {
      const { fromIdx, toIdx } = action;
      if (
        fromIdx === toIdx ||
        fromIdx < 0 ||
        toIdx < 0 ||
        fromIdx >= state.openTabs.length ||
        toIdx >= state.openTabs.length
      ) {
        return state;
      }
      const openTabs = [...state.openTabs];
      const [moved] = openTabs.splice(fromIdx, 1);
      if (!moved) return state;
      openTabs.splice(toIdx, 0, moved);
      return { ...state, openTabs };
    }
    case "TOGGLE_FOLDER":
      return {
        ...state,
        treeOpenFolders: {
          ...state.treeOpenFolders,
          [action.path]: !state.treeOpenFolders[action.path],
        },
      };
    case "TOGGLE_OPEN_EDITORS":
      return { ...state, openEditorsCollapsed: !state.openEditorsCollapsed };
    case "TOGGLE_FILES_SECTION":
      return { ...state, filesCollapsed: !state.filesCollapsed };
    case "SET_PANEL_HEIGHT":
      return { ...state, panelHeightPx: clampPanel(action.px) };
    case "SET_SIDEBAR_TIMELINE_HEIGHT":
      return {
        ...state,
        sidebarTimelineHeightPx: clampTimeline(action.px),
      };
    case "TERMINAL_APPEND":
      return {
        ...state,
        terminalLines: [...state.terminalLines, action.line],
      };
    case "TERMINAL_CLEAR":
      return { ...state, terminalLines: [] };
    case "TEST_UPDATE": {
      const testSuites = state.testSuites.map((suite, sIdx) => {
        if (sIdx !== action.suiteIdx) return suite;
        return {
          ...suite,
          cases: suite.cases.map((c, cIdx) =>
            cIdx === action.caseIdx ? { ...c, status: action.status } : c,
          ),
        };
      });
      return { ...state, testSuites };
    }
    case "TEST_RESET": {
      const testSuites = state.testSuites.map((suite) => ({
        ...suite,
        cases: suite.cases.map((c) => ({ ...c, status: "idle" as const })),
      }));
      return { ...state, testSuites };
    }
    case "TOGGLE_PALETTE":
      return {
        ...state,
        isPaletteOpen:
          typeof action.open === "boolean" ? action.open : !state.isPaletteOpen,
      };
    case "SET_ACTIVITY":
      return { ...state, activeActivityAction: action.action };
    case "SET_CURSOR":
      return { ...state, cursorLine: action.line, cursorCol: action.col };
    default:
      return state;
  }
}

type IDEContextValue = {
  state: IDEState;
  dispatch: Dispatch<IDEAction>;
};

const IDEContext = createContext<IDEContextValue | null>(null);

export function IDEProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ideReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <IDEContext.Provider value={value}>{children}</IDEContext.Provider>;
}

export function useIDE(): IDEContextValue {
  const ctx = useContext(IDEContext);
  if (!ctx) {
    throw new Error("useIDE() must be called inside <IDEProvider>");
  }
  return ctx;
}
