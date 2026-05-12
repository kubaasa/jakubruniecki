# Portfolio IDE Redesign — Design Spec

**Date:** 2026-05-12
**Owner:** Jakub Bruniecki
**Status:** Draft — awaiting review

## 1. Goal

Replace the current scroll-based portfolio (`Hero` / `About` / `Skills` / `Projects` / `Contact`) with a high-fidelity, interactive mock of a VS Code IDE as the entire landing page. The IDE is the portfolio. Inspiration: `c:/Users/Kuba/Desktop/jakubruniecki-portfolio.html` — a self-contained HTML artifact that simulates a full code-editor workspace.

The redesign keeps the existing Next.js 16 / React 19 / Tailwind v4 stack, preserves `data/*.ts` as the source of truth for content, and adds a virtual filesystem of "files" displayed inside the IDE.

## 2. Functional requirements (full scope — 1:1 with inspiration)

Everything in the inspiration file is in scope. Out-of-scope is empty.

### Title bar
- Three "traffic light" dots (red / yellow / green) on the left — decorative, hover changes opacity.
- Workspace label in center: `● jakubruniecki — portfolio.code` with a green pin dot.
- Right slot: empty (reserved for future live pill).

### Activity bar (left vertical, 48px wide)
- Six icons: Explorer (active by default), Search, Source control, Run tests, Extensions, Settings.
- All icons are clickable. Click toggles the `active` class (cosmetic).
- Two icons have real handlers:
  - **Search** → opens command palette.
  - **Run tests** → triggers `RUN ALL` on test runner.
- All other icons: visual-only toggle.

### Sidebar (Explorer, 248px wide)
- Head: `EXPLORER` label + three action icons (new file, refresh, collapse-all — all decorative).
- Section: `OPEN EDITORS` — collapsible. Lists currently open tabs with a close (`✕`) button per item. Click on entry → set active tab. Click on `✕` → close that tab.
- Section: `JAKUBRUNIECKI` — collapsible. Renders the file tree (recursive `FileTree` component). Folders have chevron that rotates on expand/collapse. Files have per-language icons.
- Section: `TIMELINE` — static list of 4 milestones:
  - `● 2026 · Senior QA · open to remote`
  - `● 2024 · 3d → 4h regression`
  - `● 2023 · Playwright + CI`
  - `● 2020 · First QA role`

### Editor area
- Tab bar: horizontal list of open tabs. Each tab: file-type icon + filename + close button. Active tab styled with `--bg-base` background.
- **Drag-and-drop reorder**: `dragstart` / `dragover` / `drop` / `dragend` — tabs can be reordered by dragging.
- Breadcrumb under tabs: `portfolio › about.ts` (or equivalent path with `›` separators).
- Editor body: scrollable area with line numbers (gutter on left) + syntax-highlighted content.
- **Boot typewriter animation**: on first mount, after ~700ms delay, the initial file content types out character-by-character (skipped if `prefers-reduced-motion`).
- Horizontal splitter between editor body and bottom panel. **Draggable** — `mousedown` + `mousemove` + `mouseup` resize the panel height between configured min and max.

### Bottom panel
- Panel tabs (top of panel): `PROBLEMS (0)`, `OUTPUT`, `● TERMINAL` (active by default), `TEST RESULTS (·)`, with right-side meta `zsh — portfolio | node v20.11.0`.
- Body: two columns side-by-side (Terminal + Test Runner) separated by a vertical divider.

#### Terminal
- Output area (`#term-output`) — scrollable line history with auto-scroll on append.
- Prompt: `jakub@portfolio ~/portfolio ❯` followed by `<input>` for commands.
- Welcome message rendered on mount.
- Supported commands (full set):
  - `help` — lists all commands with one-line descriptions.
  - `cv` — prints "Opening CV request email…" then `window.open(cvRequestHref)`.
  - `contact` — prints email / linkedin / location / phone. Email is clickable; on click also copies to clipboard and prints `✓ email copied`.
  - `projects` — lists projects from `data/projects.ts` with GitHub links.
  - `skills` — pretty-printed table grouped by category (manual / automation / tools).
  - `open <file>` — opens file by path or fuzzy name. Unknown file → `error: no such file: <name>`. Ambiguous fuzzy → suggestion list.
  - `clear` — empties terminal output.
  - `whoami` — prints `jakubruniecki @ Warsaw · CET · open-to-work`.
  - Unknown command → `command not found: <x>. Try 'help'.`
- Command history: `↑` / `↓` cycles previous inputs.
- Focus auto-targets the input when clicking anywhere on the terminal area.

#### Test Runner
- Toolbar: `RUN ALL` button (green play icon), `STOP` button (disabled when idle), summary on the right (`ready` / `Running N/M · 0.6s` / `12 passed in 1.4s`).
- Body: list of suites. Each suite: name + cumulative tick when all green. Each test: status icon (`○` idle, `⟳` running with spin animation, `✓` pass green, `✗` fail red) + name + duration `(11ms)`.
- **Auto-run on mount**: ~800ms after page load, sequentially walks through every test:
  1. Mark `running`.
  2. `setTimeout(durMs)` then mark `pass`.
  3. Advance to next test.
- **RUN ALL**: resets all to `idle`, restarts the cycle.
- **STOP**: aborts the in-flight cycle, leaves completed tests as-is, sets remaining to `idle`.
- **Reduced motion**: `prefers-reduced-motion: reduce` → skip animation, set all tests to `pass` immediately with final summary.
- **Click on test name** → opens the spec file in the editor and scrolls the editor body to the line containing that test (`.tick`-style highlight, ~600ms pulse).

Suites (from inspiration `data/testRuns.ts`):

| Suite | File | Cases |
|---|---|---|
| Jakub Bruniecki — candidate | `tests/candidate.spec.ts` | has 5 years of QA experience (12ms) · writes maintainable Playwright code (18ms) · cuts regression from 3d to 4h (11ms) |
| soft skills | `tests/soft-skills.spec.ts` | communicates clearly (9ms) · mentors juniors (7ms) · owns the outcome (14ms) |
| availability | `tests/availability.spec.ts` | is open to work (6ms) · responds within 24h (8ms) · considers remote roles (7ms) |
| the bottom line | `tests/hire-me.spec.ts` | hire me (22ms) |

### Status bar (bottom, 24px high)
- Left segments:
  - `CV on request` (clickable, opens mailto `cvRequestHref`).
  - `main` (git branch icon).
  - `● build passing` (green, pulsing live dot).
  - Errors `0` + warnings `0` (icons + count).
- Right segments:
  - Live clock `HH:mm:ss CET` (Warsaw timezone, updates every 1s). Renders placeholder `--:--:-- CET` on SSR to avoid hydration mismatch.
  - `Ln {n}, Col {m}` (cosmetic — defaults to `Ln 1, Col 1`).
  - `Spaces: 2` (static).
  - `UTF-8` (static).
  - `LF` (static).
  - Language indicator (`TypeScript` / `Markdown` / `Plain`) based on active tab.
  - Notifications bell icon (decorative).

### Command Palette
- Triggers:
  - `Cmd+K` / `Ctrl+K` (global `keydown` listener, `preventDefault`).
  - Activity bar `Search` icon.
- Overlay: `fixed inset-0` with `bg-black/40` backdrop. Centered modal with input + results list.
- Input placeholder: `Type a file name or command…  (⌘K / Ctrl+K to toggle)`.
- Searchable items:
  - All files from the virtual filesystem → action: open file.
  - Commands:
    - `Request CV` → opens mailto.
    - `Copy email` → clipboard + terminal toast.
    - `Open GitHub` → `window.open`.
    - `Open LinkedIn` → `window.open`.
    - `Run all tests` → reset + restart cycle.
    - `Toggle terminal focus` → focus terminal input.
- Fuzzy match: every char of query must appear in label in order (case-insensitive). Score = boost for consecutive char matches. Sort desc by score.
- Keyboard: `↑` / `↓` move selection, `Enter` or `Tab` execute, `Esc` or backdrop click close.
- Max 8 results visible, scrollable beyond.

### Mobile fallback (≤768px Tailwind `md` breakpoint)
- IDE hidden via `hidden md:block` on `<IDE />`.
- `<MobileFallback />` shown via `block md:hidden`.
- Content: avatar 64px + name + role line + notice box (`Open on desktop for the full experience…`) + two bio paragraphs + `// contact` heading + contact list + `✉ Request CV` CTA.
- No IDE chrome, no terminal, no palette.

### SEO content (SSR, accessible, visually hidden)
- `<SEOContent />` server component in `app/seo/SEOContent.tsx`.
- Rendered in `app/page.tsx` before `<IDE />`.
- Wrapped in `<div className="sr-only">` (Tailwind's accessible-hidden utility).
- Contains:
  - `<h1>Jakub Bruniecki — Senior QA Engineer</h1>`
  - `<section aria-label="About">` with both bio paragraphs from `profile.ts`.
  - `<section aria-label="Skills">` with `<ul>` of skill names + category.
  - `<section aria-label="Projects">` with `<article>` per project: title, description, metrics/highlights.
  - `<section aria-label="Contact">` with `<ul>` of contact links.
- Result: Googlebot, LinkedIn preview, and screen readers see full content; sighted users see only the IDE.

### Console easter egg
- On client mount, log to `console`:
  ```
  %cJB — Senior QA Engineer       (color: green, mono)
  %cIf you're reading this, you know how to read.
     email: jakubruniecki@gmail.com    (color: muted, mono)
  ```

## 3. Architecture

### High-level
- **Server side** (Next.js RSC): `app/layout.tsx` (fonts, metadata, html shell), `app/page.tsx` (renders `<SEOContent />` + `<IDE />`), `app/seo/SEOContent.tsx`.
- **Client side** (`'use client'`): `<IDE />` and everything nested under it. State managed by a single `IDEContext` driven by `useReducer`.
- **Static data**: `data/*.ts` (existing) + `data/files/` (new virtual filesystem) + `data/testRuns.ts` (new test definitions) + `data/commands.ts` (new terminal command map).

### State management
A single `IDEContext` exposed through `useIDE()` hook. Backed by `useReducer(ideReducer, initialState)`. Rationale: native React, zero external deps, tractable for a portfolio.

### State shape (`app/ide/types.ts` and `app/ide/IDEContext.tsx`)

```ts
type Language = "ts" | "md" | "env";

type FileNode =
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

type Tab = { path: string };

type TerminalLine =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string }
  | { kind: "system"; text: string; href?: string };

type TestStatus = "idle" | "running" | "pass" | "fail";
type TestCase = { name: string; durMs: number; status: TestStatus };
type TestSuite = { name: string; file: string; cases: TestCase[] };

type ActivityAction = "explorer" | "search" | "git" | "run" | "ext" | "settings";

type IDEState = {
  openTabs: Tab[];
  activeTabPath: string | null;
  treeOpenFolders: Record<string, boolean>;
  openEditorsCollapsed: boolean;
  filesCollapsed: boolean;
  panelHeightPx: number;
  terminalLines: TerminalLine[];
  testSuites: TestSuite[];
  isPaletteOpen: boolean;
  activeActivityAction: ActivityAction;
  cursorLine: number;
  cursorCol: number;
};

type IDEAction =
  | { type: "OPEN_FILE"; path: string }
  | { type: "CLOSE_TAB"; path: string }
  | { type: "SET_ACTIVE_TAB"; path: string }
  | { type: "REORDER_TABS"; fromIdx: number; toIdx: number }
  | { type: "TOGGLE_FOLDER"; path: string }
  | { type: "TOGGLE_OPEN_EDITORS" }
  | { type: "TOGGLE_FILES_SECTION" }
  | { type: "SET_PANEL_HEIGHT"; px: number }
  | { type: "TERMINAL_APPEND"; line: TerminalLine }
  | { type: "TERMINAL_CLEAR" }
  | { type: "TEST_UPDATE"; suiteIdx: number; caseIdx: number; status: TestStatus }
  | { type: "TEST_RESET" }
  | { type: "TOGGLE_PALETTE"; open?: boolean }
  | { type: "SET_ACTIVITY"; action: ActivityAction }
  | { type: "SET_CURSOR"; line: number; col: number };
```

### Initial state
- `openTabs`: `[{ path: "README.md" }]`.
- `activeTabPath`: `"README.md"`.
- `treeOpenFolders`: `{ "portfolio": true, "tests": true, "case-studies": true }`.
- `openEditorsCollapsed`: `false`.
- `filesCollapsed`: `false`.
- `panelHeightPx`: `336`.
- `terminalLines`: welcome message (3 lines).
- `testSuites`: from `data/testRuns.ts`, all `idle`.
- `isPaletteOpen`: `false`.
- `activeActivityAction`: `"explorer"`.
- `cursorLine`: `1`, `cursorCol`: `1`.

## 4. File structure (after refactor)

```
app/
  layout.tsx                       // unchanged
  page.tsx                         // SSR: <SEOContent /> + <IDE />
  globals.css                      // expanded tokens (see §6)
  icon.tsx                         // unchanged
  ide/
    IDE.tsx                        // 'use client', wraps IDEProvider + tree
    IDEContext.tsx                 // reducer + Provider + useIDE hook
    types.ts                       // FileNode, Tab, TerminalLine, etc.
    boot.ts                        // boot typewriter + auto-run-tests effects
  seo/
    SEOContent.tsx                 // server, sr-only semantic markup

components/
  ide/
    TitleBar.tsx
    ActivityBar.tsx
    Sidebar/
      Sidebar.tsx                  // grid: head + sections
      OpenEditors.tsx
      FileTree.tsx                 // recursive
      FileTreeNode.tsx
      Timeline.tsx
    EditorArea/
      EditorArea.tsx               // grid: tabbar + crumb + body + splitter + panel
      TabBar.tsx                   // drag-and-drop reorder
      Breadcrumb.tsx
      EditorBody.tsx               // renderer dispatcher + boot typewriter
      Splitter.tsx                 // mouse drag resize
      renderers/
        TSRenderer.tsx
        MDRenderer.tsx
        EnvRenderer.tsx
    BottomPanel/
      BottomPanel.tsx              // tabs + body
      PanelTabs.tsx
      Terminal.tsx
      TestRunner.tsx
    StatusBar.tsx
    CommandPalette.tsx
    MobileFallback.tsx
  ui/
    SyntaxHighlight.tsx            // regex-based per-language highlighter
    Icon.tsx                       // shared inline SVG icons (file type, chev, etc.)

data/
  profile.ts                       // unchanged
  skills.ts                        // unchanged
  projects.ts                      // unchanged
  contact.ts                       // unchanged
  files/
    index.ts                       // assembles FileNode tree + content map
    readme.ts                      // README.md content (derived from profile/skills)
    aboutTs.ts                     // about.ts content (derived from profile)
    skillsTs.ts                    // skills.ts content (derived from skills)
    projectsTs.ts                  // projects.ts content (derived from projects)
    contactTs.ts                   // contact.ts content (derived from contact)
    env.ts                         // .env content (decorative)
    tests/
      candidateSpec.ts             // candidate.spec.ts content
      softSkillsSpec.ts            // soft-skills.spec.ts content
      availabilitySpec.ts          // availability.spec.ts content
      hireMeSpec.ts                // hire-me.spec.ts content
    caseStudies/
      fintechRegression.ts         // fintech-regression.md content
      ecommerceE2e.ts              // ecommerce-e2e.md content
  testRuns.ts                      // TestSuite[] definitions
  commands.ts                      // terminal command map

types/
  index.ts                         // existing types + new IDE types re-export

public/
  photo.jpg                        // existing, used in MobileFallback
  og-image.png                     // existing
```

### Files to delete
- `components/sections/Hero.tsx`
- `components/sections/About.tsx`
- `components/sections/Skills.tsx`
- `components/sections/Projects.tsx`
- `components/sections/Contact.tsx`
- `components/ui/Avatar.tsx`
- `components/ui/Badge.tsx`
- `components/ui/CodeBlock.tsx`
- `components/ui/NavBar.tsx`
- `components/ui/ProjectCard.tsx`
- `components/ui/SectionHeader.tsx`
- `components/ui/WindowChrome.tsx`

`components/icons/` is kept (used by `MobileFallback`).

## 5. Virtual filesystem content

The file tree mirrors the inspiration:

```
jakubruniecki/
├── README.md
├── portfolio/
│   ├── about.ts
│   ├── skills.ts
│   ├── projects.ts
│   └── contact.ts
├── tests/
│   ├── candidate.spec.ts
│   ├── soft-skills.spec.ts
│   ├── availability.spec.ts
│   └── hire-me.spec.ts
├── case-studies/
│   ├── fintech-regression.md
│   └── ecommerce-e2e.md
└── .env
```

### Content sources
- **`about.ts`** — TypeScript export of profile object, derived from `data/profile.ts`.
- **`skills.ts`** — derived from `data/skills.ts`, grouped object literal by category.
- **`projects.ts`** — derived from `data/projects.ts`, includes highlights/metrics.
- **`contact.ts`** — derived from `data/contact.ts`.
- **`README.md`** — markdown intro: TL;DR, "open files to read more", terminal hint.
- **`tests/*.spec.ts`** — Playwright-style spec files. Drafts will be written in Phase 3 for Kuba's approval. Each maps to a suite in `testRuns.ts`. Example for `candidate.spec.ts`:
  ```ts
  import { test, expect } from "@playwright/test";
  import { candidate } from "./fixtures";

  test.describe("Jakub Bruniecki — candidate", () => {
    test("has 5 years of QA experience", async () => {
      expect(candidate.yearsOfExperience).toBe(5);
    });
    test("writes maintainable Playwright code", async () => {
      expect(candidate.automation.framework).toBe("Playwright + TS");
    });
    test("cuts regression from 3d to 4h", async () => {
      expect(candidate.impact.regression).toEqual({ before: "3d", after: "4h" });
    });
  });
  ```
- **`case-studies/fintech-regression.md`** — expansion of the "3d → 4h regression" project from `projects.ts`: context, problem, approach, outcome, what I'd do differently.
- **`case-studies/ecommerce-e2e.md`** — expansion of the "E-commerce E2E Test Suite" project: architecture (POM, fixtures), parallel execution, CI integration, results.
- **`.env`** — decorative:
  ```
  OPEN_TO_WORK=true
  ROLE=Senior QA Engineer
  LOCATION=Warsaw, Poland
  TIMEZONE=Europe/Warsaw
  CV_DELIVERY=on-request
  # secrets are .gitignored 😉
  ```

All draft content (specs + case studies + README) will be presented to Kuba for review in Phase 3 before commit.

## 6. Styling

### Tailwind v4 tokens (`app/globals.css`)
Extend the existing `@theme` block with the inspiration's full palette and IDE dimensions:

```css
@theme {
  /* Surfaces */
  --color-bg-base: #0d1117;
  --color-bg-surface: #161b22;
  --color-bg-elevated: #1c2128;
  --color-bg-subtle: #21262d;
  --color-bg-deeper: #010409;

  /* Borders */
  --color-border: #30363d;
  --color-border-subtle: #21262d;
  --color-border-strong: #444c56;

  /* Foregrounds */
  --color-fg: #e6edf3;
  --color-fg-muted: #7d8590;
  --color-fg-subtle: #484f58;

  /* Accents */
  --color-accent-green: #3fb950;
  --color-accent-green-dim: #238636;
  --color-accent-blue: #79c0ff;
  --color-accent-blue-dim: #1f6feb;
  --color-accent-red: #f85149;
  --color-accent-yellow: #d29922;

  /* Syntax */
  --color-sx-comment: #7d8590;
  --color-sx-keyword: #ff7b72;
  --color-sx-string: #a5d6ff;
  --color-sx-number: #d2a8ff;
  --color-sx-fn: #d2a8ff;
  --color-sx-prop: #79c0ff;
  --color-sx-const: #79c0ff;
  --color-sx-tag: #7ee787;
  --color-sx-punct: #c9d1d9;

  /* Fonts (existing) */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  /* IDE dimensions (custom, used via var()) */
  --ide-titlebar-h: 32px;
  --ide-activitybar-w: 48px;
  --ide-sidebar-w: 248px;
  --ide-statusbar-h: 24px;
  --ide-panel-h-default: 336px;
  --ide-panel-h-min: 120px;
  --ide-panel-h-max: 600px;
  --ide-tabbar-h: 36px;
  --ide-splitter-h: 4px;

  /* Glows */
  --glow-green: 0 0 24px -8px var(--color-accent-green);
  --glow-blue: 0 0 24px -8px var(--color-accent-blue);
}
```

### Animations
Defined in `globals.css`:
- `@keyframes live-pulse` — for status bar green dot.
- `@keyframes caret-blink` — for terminal caret.
- `@keyframes spin` — for `⟳` running test icon.
- `@keyframes tick-flash` — for "scroll to test line" highlight (600ms).

### Page overflow
The `<html>` and `<body>` need `overflow: hidden` on desktop (so IDE fills the viewport without page scroll) but `overflow: auto` on mobile. Achieve by applying `md:overflow-hidden` to `<body>` in `app/layout.tsx`.

## 7. Syntax highlighting

Build a small regex-based highlighter in `components/ui/SyntaxHighlight.tsx`. No external dependency.

- **TS**: tokens for `keyword` (import/export/const/let/function/return/async/await/type/interface/from/as), `string` (single/double/template), `number`, `comment` (`//`, `/* */`), `fn` (identifier followed by `(`), `prop` (`.identifier`), `const` (UPPER_CASE).
- **MD**: heading (`# `, `## `, `### `), `**bold**`, `*italic*`, inline `` `code` ``, links `[text](url)`, list bullets.
- **ENV**: `KEY=` styled as keyword, `value` as string, `# comment` as comment.

Output: an array of `{ type, text }` tokens rendered as `<span class="text-sx-keyword">…</span>`.

### Line numbers
Editor body renders a left gutter `<div class="gutter">` with line numbers and a right `<pre>` with highlighted content. Both are wrapped in a flex container with `overflow: auto`. Line numbers are `aria-hidden="true"`.

## 8. Terminal commands (`data/commands.ts`)

```ts
type CommandCtx = {
  files: FileNode[];           // for `open` fuzzy match
  dispatch: React.Dispatch<IDEAction>;
};

type Command = {
  name: string;
  description: string;
  run: (args: string[], ctx: CommandCtx) => TerminalLine[];
};

export const commands: Record<string, Command> = {
  help: { ... },
  cv:   { ... },
  contact: { ... },
  projects: { ... },
  skills: { ... },
  open: { ... },
  clear: { ... },
  whoami: { ... },
};
```

Side effects (e.g., `window.open`, `navigator.clipboard.writeText`, `dispatch(OPEN_FILE)`) happen inside `run()`. The returned `TerminalLine[]` is what gets appended to the terminal.

## 9. Boot sequence (on `<IDE />` mount)

In `app/ide/boot.ts`:
1. `t=0` — mount initial state.
2. `t=0` — start console easter egg.
3. `t=0` — start clock interval (`setInterval(..., 1000)`).
4. `t=700ms` — start boot typewriter on `README.md` content (skipped if `prefers-reduced-motion`).
5. `t=800ms` — start test-runner auto-run cycle (skipped if `prefers-reduced-motion`, instead set all to `pass`).

All effects are cleaned up on unmount.

## 10. Accessibility

- `<SEOContent />` provides full semantic markup for screen readers.
- IDE elements have ARIA roles: `role="application"` on `.ide` root, `aria-label` on nav/sidebar/editor/panel regions.
- Focus management:
  - Command palette traps focus when open; restores focus on close.
  - File tree: nodes are `role="treeitem"` with `aria-expanded` / `aria-level`.
  - Tabs: `role="tablist"` + `role="tab"` + `aria-selected`.
- Keyboard nav:
  - `Cmd+K` / `Ctrl+K` — toggle palette.
  - `Esc` — close palette.
  - `↑` / `↓` — palette result nav, terminal history.
  - `Enter` — palette execute, terminal submit.
- Reduced motion respected for typewriter, test runner animation, live dot pulse.

## 11. Implementation phases (commits)

Each phase ends in one commit (Kuba's stated preference). All phases pass `lint` + `typecheck` + `build` before commit.

1. **Phase 1 — Shell, tokens, cleanup**
   Expand `globals.css` tokens. Build layout grid `<IDE />` skeleton with empty regions (title bar dots, empty sidebar/editor/panel/statusbar). Delete old `components/sections` + `components/ui` (except icons). Build `<MobileFallback />` and `<SEOContent />`. `app/page.tsx` wires them. Site loads to an empty-but-correct IDE frame on desktop and stacked content on mobile.

2. **Phase 2 — Sidebar, file tree, IDEContext, tabs, editor body**
   Implement `IDEContext` + reducer. Render `Sidebar` (with `OpenEditors`, `FileTree`, `Timeline`) and `EditorArea` (`TabBar`, `Breadcrumb`, `EditorBody` with line numbers + `SyntaxHighlight`). Clicking files opens tabs; close/active works. Drag-and-drop tab reorder. Folder collapse. File-type icons. Open Editors list stays in sync.

3. **Phase 3 — Content (data/files/*)**
   Populate every virtual file with real content. Drafts for `README.md`, all four `tests/*.spec.ts`, both `case-studies/*.md`, `.env` presented to Kuba for approval before commit.

4. **Phase 4 — Bottom panel, terminal, command map**
   Implement `BottomPanel`, `PanelTabs`, `Terminal`. Welcome message. All 8 commands functional. History (↑/↓). Auto-scroll. Clipboard write for email.

5. **Phase 5 — Test runner + animation + STOP + reduced motion**
   Implement `TestRunner`. Auto-run on mount. `RUN ALL` / `STOP`. Reduced-motion fast path. Click test → open spec + scroll-to-line + tick flash.

6. **Phase 6 — Splitter (panel resize) + boot typewriter**
   Implement `Splitter` (mouse drag, clamped between min/max). Implement boot typewriter in `EditorBody` (one-time, on first `README.md` open after mount, respects reduced motion).

7. **Phase 7 — Command palette + activity bar handlers**
   Implement `CommandPalette`. Cmd/Ctrl+K global listener. Fuzzy match. Keyboard nav. Activity bar wired: Search → palette, Run → tests, others → cosmetic toggle.

8. **Phase 8 — Status bar live elements + console easter egg + polish**
   Live clock (Warsaw TZ). CV pill mailto. Build-passing live dot animation. Language/Ln/Col from active tab. Console easter egg. A11y polish (focus rings, ARIA labels, skip link to SEO content).

## 12. Risks and trade-offs

- **State complexity**: `IDEState` is large (~14 fields). Mitigation: keep reducer pure, write small focused reducer files if it grows past 300 lines, add type-narrowing helpers.
- **Hydration mismatch on clock**: rendered as placeholder server-side, fixed in §2 (StatusBar).
- **Bundle size**: client-side IDE is non-trivial (~30 components). Acceptable for a single-page portfolio; consider tree-shaking checks in Phase 8.
- **Mobile UX**: `≤768px` cuts off IDE entirely — accepted. Tablets in landscape between 768px and ~1024px will get a cramped IDE; we accept this and may revisit.
- **SEO under sr-only**: Google indexes sr-only content normally, but spammy patterns get penalized. Mitigation: `sr-only` content is identical in meaning to what the IDE displays, not keyword-stuffing.
- **Drag-and-drop a11y**: native HTML5 DnD has known a11y issues. For MVP, tabs remain operable via click; reordering is a sighted-mouse feature.

## 13. Open questions

None at spec time. Phase 3 will present content drafts (specs, case studies, README, .env) before commit.
