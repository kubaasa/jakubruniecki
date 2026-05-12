export type Language = "ts" | "md" | "env";

export type FileNode =
  | {
      type: "file";
      name: string;
      path: string;
      language: Language;
      content: string;
    }
  | {
      type: "folder";
      name: string;
      path: string;
      children: FileNode[];
      defaultOpen?: boolean;
    };

export type Tab = { path: string };

export type TerminalLine =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string }
  | { kind: "system"; text: string; href?: string }
  | { kind: "cmd"; text: string }
  | { kind: "success"; text: string }
  | { kind: "warn"; text: string }
  | { kind: "helpRow"; cmd: string; desc: string };

export type TestStatus = "idle" | "running" | "pass" | "fail";

export type TestCase = {
  name: string;
  durMs: number;
  status: TestStatus;
  displayDurMs?: number;
};

export type TestSuite = {
  name: string;
  file: string;
  cases: TestCase[];
};

export type ActivityAction =
  | "explorer"
  | "search"
  | "git"
  | "run"
  | "ext"
  | "settings";

export type IDEState = {
  openTabs: Tab[];
  activeTabPath: string | null;
  treeOpenFolders: Record<string, boolean>;
  openEditorsCollapsed: boolean;
  filesCollapsed: boolean;
  panelHeightPx: number;
  sidebarTimelineHeightPx: number;
  terminalLines: TerminalLine[];
  testSuites: TestSuite[];
  isPaletteOpen: boolean;
  activeActivityAction: ActivityAction;
  cursorLine: number;
  cursorCol: number;
};

export type IDEAction =
  | { type: "OPEN_FILE"; path: string }
  | { type: "CLOSE_TAB"; path: string }
  | { type: "SET_ACTIVE_TAB"; path: string }
  | { type: "REORDER_TABS"; fromIdx: number; toIdx: number }
  | { type: "TOGGLE_FOLDER"; path: string }
  | { type: "TOGGLE_OPEN_EDITORS" }
  | { type: "TOGGLE_FILES_SECTION" }
  | { type: "SET_PANEL_HEIGHT"; px: number }
  | { type: "SET_SIDEBAR_TIMELINE_HEIGHT"; px: number }
  | { type: "TERMINAL_APPEND"; line: TerminalLine }
  | { type: "TERMINAL_CLEAR" }
  | {
      type: "TEST_UPDATE";
      suiteIdx: number;
      caseIdx: number;
      status: TestStatus;
      displayDurMs?: number;
    }
  | { type: "TEST_RESET" }
  | { type: "TOGGLE_PALETTE"; open?: boolean }
  | { type: "SET_ACTIVITY"; action: ActivityAction }
  | { type: "SET_CURSOR"; line: number; col: number };
