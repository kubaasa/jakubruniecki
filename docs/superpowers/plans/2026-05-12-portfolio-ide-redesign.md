# Portfolio IDE Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current scroll-based portfolio with a full interactive mock of a VS Code IDE as the entire landing page, preserving SEO via SSR'd semantic content and keeping the existing Next.js 16 / React 19 / Tailwind v4 stack.

**Architecture:** Single client-side IDE rooted in `<IDE />` (a `'use client'` wrapper) with state managed by one `IDEContext` driven by `useReducer`. Server renders a hidden semantic `<SEOContent />` for crawlers and screen readers, plus a `<MobileFallback />` shown ≤768px. A virtual filesystem under `data/files/` defines the file tree displayed by the IDE.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first `@theme`), `next/font/google` (Inter + JetBrains Mono). No new runtime dependencies — syntax highlighting and fuzzy matching are implemented locally.

**Source spec:** `docs/superpowers/specs/2026-05-12-portfolio-ide-redesign.md`

**User context:** Kuba is a Senior QA engineer (5y), comfortable with TypeScript from Playwright work, beginner-intermediate with React/Next.js. Plan includes "why" notes where React/Next.js conventions are non-obvious. Package manager: **npm**. No unit test framework in the repo — verification per task is `npx tsc --noEmit`, `npm run lint`, `npm run build`, and visual check in `npm run dev`.

---

## File map

Everything the plan creates, modifies, or deletes. Paths are relative to the repo root.

| Path | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Expand `@theme` with full IDE token palette + `@keyframes` (`live-pulse`, `caret-blink`, `spin`, `tick-flash`) + `md:overflow-hidden` body rule |
| `app/layout.tsx` | Modify | Remove `<NavBar />`; add `md:overflow-hidden` to `<body>` |
| `app/page.tsx` | Modify | Render `<SEOContent />` (SSR) + `<IDE />` (client) + `<MobileFallback />` |
| `app/ide/types.ts` | Create | `FileNode`, `Tab`, `TerminalLine`, `TestStatus`, `TestCase`, `TestSuite`, `ActivityAction`, `IDEState`, `IDEAction` |
| `app/ide/IDEContext.tsx` | Create | Reducer, `IDEProvider`, `useIDE()` hook |
| `app/ide/IDE.tsx` | Create | `'use client'` root that wires Provider + every IDE region |
| `app/ide/boot.ts` | Create | Boot-time effects helper (typewriter scheduling, test auto-run, console egg) |
| `app/seo/SEOContent.tsx` | Create | Server component, `sr-only` semantic markup |
| `components/ide/TitleBar.tsx` | Create | Traffic lights + workspace label |
| `components/ide/ActivityBar.tsx` | Create | Six-icon vertical bar |
| `components/ide/StatusBar.tsx` | Create | Bottom status strip (clock, build pill, language, etc.) |
| `components/ide/CommandPalette.tsx` | Create | Cmd/Ctrl+K modal overlay with fuzzy search |
| `components/ide/MobileFallback.tsx` | Create | ≤768px static page replacement |
| `components/ide/Sidebar/Sidebar.tsx` | Create | Explorer head + three sections |
| `components/ide/Sidebar/OpenEditors.tsx` | Create | Collapsible list of open tabs |
| `components/ide/Sidebar/FileTree.tsx` | Create | Root recursive tree |
| `components/ide/Sidebar/FileTreeNode.tsx` | Create | Single recursive node (folder or file row) |
| `components/ide/Sidebar/Timeline.tsx` | Create | Static 4-item milestone list |
| `components/ide/EditorArea/EditorArea.tsx` | Create | Grid wrapping TabBar + Breadcrumb + Body + Splitter + BottomPanel |
| `components/ide/EditorArea/TabBar.tsx` | Create | HTML5 DnD tab strip |
| `components/ide/EditorArea/Breadcrumb.tsx` | Create | `portfolio › about.ts` path crumbs |
| `components/ide/EditorArea/EditorBody.tsx` | Create | Gutter + syntax-highlighted content + boot typewriter |
| `components/ide/EditorArea/Splitter.tsx` | Create | Mouse-drag panel resize |
| `components/ide/BottomPanel/BottomPanel.tsx` | Create | Panel tabs + body (Terminal + TestRunner) |
| `components/ide/BottomPanel/PanelTabs.tsx` | Create | `PROBLEMS / OUTPUT / TERMINAL / TEST RESULTS` strip |
| `components/ide/BottomPanel/Terminal.tsx` | Create | Output history + input + command dispatcher |
| `components/ide/BottomPanel/TestRunner.tsx` | Create | Toolbar + suite list + auto-run effect |
| `components/ui/Icon.tsx` | Create | Inline SVG icon set used across the IDE |
| `components/ui/SyntaxHighlight.tsx` | Create | Regex-based TS/MD/ENV highlighter |
| `components/ui/fuzzyMatch.ts` | Create | Subsequence + consecutive-bonus scorer |
| `data/files/index.ts` | Create | Assembles the `FileNode` tree from per-file modules |
| `data/files/readme.ts` | Create | `README.md` content |
| `data/files/aboutTs.ts` | Create | `portfolio/about.ts` content |
| `data/files/skillsTs.ts` | Create | `portfolio/skills.ts` content |
| `data/files/projectsTs.ts` | Create | `portfolio/projects.ts` content |
| `data/files/contactTs.ts` | Create | `portfolio/contact.ts` content |
| `data/files/env.ts` | Create | `.env` content |
| `data/files/tests/candidateSpec.ts` | Create | `tests/candidate.spec.ts` content |
| `data/files/tests/softSkillsSpec.ts` | Create | `tests/soft-skills.spec.ts` content |
| `data/files/tests/availabilitySpec.ts` | Create | `tests/availability.spec.ts` content |
| `data/files/tests/hireMeSpec.ts` | Create | `tests/hire-me.spec.ts` content |
| `data/files/caseStudies/fintechRegression.ts` | Create | `case-studies/fintech-regression.md` content |
| `data/files/caseStudies/ecommerceE2e.ts` | Create | `case-studies/ecommerce-e2e.md` content |
| `data/testRuns.ts` | Create | `TestSuite[]` definitions (the 4 suites) |
| `data/commands.ts` | Create | Terminal command map (8 commands) |
| `components/sections/Hero.tsx` | Delete | Replaced by IDE |
| `components/sections/About.tsx` | Delete | Replaced by IDE |
| `components/sections/Skills.tsx` | Delete | Replaced by IDE |
| `components/sections/Projects.tsx` | Delete | Replaced by IDE |
| `components/sections/Contact.tsx` | Delete | Replaced by IDE |
| `components/ui/Avatar.tsx` | Delete | Inlined in `MobileFallback` |
| `components/ui/Badge.tsx` | Delete | Not used by IDE |
| `components/ui/CodeBlock.tsx` | Delete | Replaced by `SyntaxHighlight` |
| `components/ui/NavBar.tsx` | Delete | IDE has its own title bar |
| `components/ui/ProjectCard.tsx` | Delete | Not used by IDE |
| `components/ui/SectionHeader.tsx` | Delete | Not used by IDE |
| `components/ui/WindowChrome.tsx` | Delete | IDE has its own chrome |
| `types/index.ts` | Modify | Optional re-export of IDE types (kept for downstream imports) |

`components/icons/` is kept — it is consumed by `MobileFallback`.

---

## Phase 1 — IDE shell + sidebar + tabs + editor body

### Task 1: Expand `app/globals.css` with the full IDE token palette

**Files:**
- Modify: `app/globals.css` (extend `@theme`, replace `@layer base`, add `@keyframes`)

**Why:** Tailwind v4 reads tokens from `@theme` at build time to generate utilities. Adding every IDE color / dimension upfront means later tasks reference `bg-bg-base`, `text-sx-keyword`, `h-[var(--ide-titlebar-h)]` etc. without ever touching the CSS file again. Keyframes live next to the tokens for the same reason — defined once, referenced via `animate-[name]` arbitrary-value utilities.

- [ ] **Step 1: Rewrite `app/globals.css` entirely**

```css
@import "tailwindcss";

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

  /* Fonts */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  /* IDE dimensions */
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

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    text-rendering: optimizeLegibility;
  }

  /* Desktop locks the viewport so the IDE fills it; mobile scrolls normally. */
  @media (min-width: 768px) {
    html,
    body {
      overflow: hidden;
      height: 100%;
    }
  }
}

@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(63, 185, 80, 0.6);
  }
  50% {
    opacity: 0.55;
    box-shadow: 0 0 0 6px rgba(63, 185, 80, 0);
  }
}

@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes tick-flash {
  0% {
    background-color: rgba(63, 185, 80, 0.35);
  }
  100% {
    background-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Typecheck (CSS is not type-checked but the build must still parse the file)**

Run: `npm run build`
Expected: build succeeds (still rendering the old portfolio — that's fine).

---

### Task 2: Strip old layout chrome (`NavBar` import + body classes)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jakubruniecki.vercel.app"),
  title: {
    default: "Jakub Bruniecki — Senior QA Engineer",
    template: "%s · Jakub Bruniecki",
  },
  description:
    "Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
  openGraph: {
    title: "Jakub Bruniecki — Senior QA Engineer",
    description:
      "Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
    url: "/",
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Jakub Bruniecki — Senior QA Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakub Bruniecki — Senior QA Engineer",
    description:
      "Senior QA Engineer · Manual leadership + Playwright automation · 5 years.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg-base text-fg font-sans antialiased md:h-screen md:overflow-hidden">
        {children}
      </body>
    </html>
  );
}
```

**Why dropping `<NavBar />`:** the IDE has its own title bar, activity bar, and status bar — adding a generic site nav above them would double-stack chrome and break the immersive metaphor.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: errors about `app/page.tsx` still importing deleted components are EXPECTED — they're fixed in Task 4. The layout itself must compile cleanly (no errors about `NavBar`).

---

### Task 3: Delete obsolete section + UI components

**Files:**
- Delete: `components/sections/Hero.tsx`
- Delete: `components/sections/About.tsx`
- Delete: `components/sections/Skills.tsx`
- Delete: `components/sections/Projects.tsx`
- Delete: `components/sections/Contact.tsx`
- Delete: `components/ui/Avatar.tsx`
- Delete: `components/ui/Badge.tsx`
- Delete: `components/ui/CodeBlock.tsx`
- Delete: `components/ui/NavBar.tsx`
- Delete: `components/ui/ProjectCard.tsx`
- Delete: `components/ui/SectionHeader.tsx`
- Delete: `components/ui/WindowChrome.tsx`

- [ ] **Step 1: Confirm the deletion set with the user before running**

Kuba's rule: never delete without explicit approval. Print the list above and wait for a "yes, delete" before proceeding.

- [ ] **Step 2: Remove the files**

```bash
rm components/sections/Hero.tsx
rm components/sections/About.tsx
rm components/sections/Skills.tsx
rm components/sections/Projects.tsx
rm components/sections/Contact.tsx
rm components/ui/Avatar.tsx
rm components/ui/Badge.tsx
rm components/ui/CodeBlock.tsx
rm components/ui/NavBar.tsx
rm components/ui/ProjectCard.tsx
rm components/ui/SectionHeader.tsx
rm components/ui/WindowChrome.tsx
```

- [ ] **Step 3: Remove the now-empty `components/sections/` directory if empty**

```bash
rmdir components/sections 2>/dev/null || true
```

- [ ] **Step 4: Verify `components/icons/` is still present (consumed by MobileFallback later)**

Run: `ls components/icons/`
Expected: at least `EmailIcon.tsx`, `LinkedInIcon.tsx`, `LocationIcon.tsx`, `PhoneIcon.tsx`, `GitHubIcon.tsx`, `index.ts`.

- [ ] **Step 5: Verify build is now broken in a predictable way**

Run: `npx tsc --noEmit`
Expected: TypeScript reports unresolved imports in `app/page.tsx`. This is fine — Task 4 / 31 fix `page.tsx`.

---

### Task 4: Temporary `app/page.tsx` stub so typecheck passes during Phase 1 build-out

**Files:**
- Modify: `app/page.tsx`

**Why:** Phase 1 has many tasks before `<IDE />` is wired up. Leaving `page.tsx` broken would block every per-task `npm run build` verification. A trivial stub here keeps the build green while the real IDE is assembled component-by-component. The stub is overwritten in Task 31.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
export default function HomePage() {
  return (
    <main className="p-8 font-mono text-fg-muted">
      IDE redesign in progress.
    </main>
  );
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: zero errors. `npm run build` produces an `out/` directory with `index.html` showing the placeholder.

---

### Task 5: Create `app/ide/types.ts`

**Files:**
- Create: `app/ide/types.ts`

- [ ] **Step 1: Make the directory**

```bash
mkdir -p app/ide
```

- [ ] **Step 2: Write `app/ide/types.ts`**

```ts
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
  | { kind: "system"; text: string; href?: string };

export type TestStatus = "idle" | "running" | "pass" | "fail";

export type TestCase = {
  name: string;
  durMs: number;
  status: TestStatus;
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
  | { type: "TERMINAL_APPEND"; line: TerminalLine }
  | { type: "TERMINAL_CLEAR" }
  | {
      type: "TEST_UPDATE";
      suiteIdx: number;
      caseIdx: number;
      status: TestStatus;
    }
  | { type: "TEST_RESET" }
  | { type: "TOGGLE_PALETTE"; open?: boolean }
  | { type: "SET_ACTIVITY"; action: ActivityAction }
  | { type: "SET_CURSOR"; line: number; col: number };
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 6: Create `data/testRuns.ts` (the 4 suites from spec §2)

**Files:**
- Create: `data/testRuns.ts`

- [ ] **Step 1: Write `data/testRuns.ts`**

```ts
import type { TestSuite } from "@/app/ide/types";

export const initialTestSuites: TestSuite[] = [
  {
    name: "Jakub Bruniecki — candidate",
    file: "tests/candidate.spec.ts",
    cases: [
      { name: "has 5 years of QA experience", durMs: 12, status: "idle" },
      { name: "writes maintainable Playwright code", durMs: 18, status: "idle" },
      { name: "cuts regression from 3d to 4h", durMs: 11, status: "idle" },
    ],
  },
  {
    name: "soft skills",
    file: "tests/soft-skills.spec.ts",
    cases: [
      { name: "communicates clearly", durMs: 9, status: "idle" },
      { name: "mentors juniors", durMs: 7, status: "idle" },
      { name: "owns the outcome", durMs: 14, status: "idle" },
    ],
  },
  {
    name: "availability",
    file: "tests/availability.spec.ts",
    cases: [
      { name: "is open to work", durMs: 6, status: "idle" },
      { name: "responds within 24h", durMs: 8, status: "idle" },
      { name: "considers remote roles", durMs: 7, status: "idle" },
    ],
  },
  {
    name: "the bottom line",
    file: "tests/hire-me.spec.ts",
    cases: [{ name: "hire me", durMs: 22, status: "idle" }],
  },
];
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 7: Create stub virtual files under `data/files/`

**Files:**
- Create: `data/files/readme.ts`
- Create: `data/files/aboutTs.ts`
- Create: `data/files/skillsTs.ts`
- Create: `data/files/projectsTs.ts`
- Create: `data/files/contactTs.ts`
- Create: `data/files/env.ts`
- Create: `data/files/tests/candidateSpec.ts`
- Create: `data/files/tests/softSkillsSpec.ts`
- Create: `data/files/tests/availabilitySpec.ts`
- Create: `data/files/tests/hireMeSpec.ts`
- Create: `data/files/caseStudies/fintechRegression.ts`
- Create: `data/files/caseStudies/ecommerceE2e.ts`

**Why:** Phase 1 wires the whole tree end-to-end. Stubs let `Sidebar` + `EditorArea` render without waiting for Phase 2's real content. Each stub exports `{ path, language, content }` so the index assembler in Task 8 doesn't need to know which files are real yet.

- [ ] **Step 1: Make the directories**

```bash
mkdir -p data/files/tests data/files/caseStudies
```

- [ ] **Step 2: Write `data/files/readme.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const readme = {
  path: "README.md",
  name: "README.md",
  language: "md" as Language,
  content: "# content pending review (Phase 2)\n",
};
```

- [ ] **Step 3: Write `data/files/aboutTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const aboutTs = {
  path: "portfolio/about.ts",
  name: "about.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 4: Write `data/files/skillsTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const skillsTs = {
  path: "portfolio/skills.ts",
  name: "skills.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 5: Write `data/files/projectsTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const projectsTs = {
  path: "portfolio/projects.ts",
  name: "projects.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 6: Write `data/files/contactTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const contactTs = {
  path: "portfolio/contact.ts",
  name: "contact.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 7: Write `data/files/env.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const envFile = {
  path: ".env",
  name: ".env",
  language: "env" as Language,
  content: "# content pending review (Phase 2)\n",
};
```

- [ ] **Step 8: Write `data/files/tests/candidateSpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const candidateSpec = {
  path: "tests/candidate.spec.ts",
  name: "candidate.spec.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 9: Write `data/files/tests/softSkillsSpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const softSkillsSpec = {
  path: "tests/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 10: Write `data/files/tests/availabilitySpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const availabilitySpec = {
  path: "tests/availability.spec.ts",
  name: "availability.spec.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 11: Write `data/files/tests/hireMeSpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const hireMeSpec = {
  path: "tests/hire-me.spec.ts",
  name: "hire-me.spec.ts",
  language: "ts" as Language,
  content: "// content pending review (Phase 2)\n",
};
```

- [ ] **Step 12: Write `data/files/caseStudies/fintechRegression.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const fintechRegression = {
  path: "case-studies/fintech-regression.md",
  name: "fintech-regression.md",
  language: "md" as Language,
  content: "# content pending review (Phase 2)\n",
};
```

- [ ] **Step 13: Write `data/files/caseStudies/ecommerceE2e.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const ecommerceE2e = {
  path: "case-studies/ecommerce-e2e.md",
  name: "ecommerce-e2e.md",
  language: "md" as Language,
  content: "# content pending review (Phase 2)\n",
};
```

- [ ] **Step 14: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 8: Assemble the tree in `data/files/index.ts`

**Files:**
- Create: `data/files/index.ts`

**Why:** Components consume the tree shape (folders + files), but a flat lookup by path (`getFileByPath("portfolio/about.ts")`) is convenient for terminal `open` and palette navigation. Exporting both forms keeps consumer code simple.

- [ ] **Step 1: Write `data/files/index.ts`**

```ts
import type { FileNode } from "@/app/ide/types";
import { readme } from "./readme";
import { aboutTs } from "./aboutTs";
import { skillsTs } from "./skillsTs";
import { projectsTs } from "./projectsTs";
import { contactTs } from "./contactTs";
import { envFile } from "./env";
import { candidateSpec } from "./tests/candidateSpec";
import { softSkillsSpec } from "./tests/softSkillsSpec";
import { availabilitySpec } from "./tests/availabilitySpec";
import { hireMeSpec } from "./tests/hireMeSpec";
import { fintechRegression } from "./caseStudies/fintechRegression";
import { ecommerceE2e } from "./caseStudies/ecommerceE2e";

function file(stub: {
  path: string;
  name: string;
  language: "ts" | "md" | "env";
  content: string;
}): FileNode {
  return {
    type: "file",
    name: stub.name,
    path: stub.path,
    language: stub.language,
    content: stub.content,
  };
}

export const fileTree: FileNode[] = [
  {
    type: "folder",
    name: "jakubruniecki",
    path: "jakubruniecki",
    defaultOpen: true,
    children: [
      file(readme),
      {
        type: "folder",
        name: "portfolio",
        path: "portfolio",
        defaultOpen: true,
        children: [
          file(aboutTs),
          file(skillsTs),
          file(projectsTs),
          file(contactTs),
        ],
      },
      {
        type: "folder",
        name: "tests",
        path: "tests",
        defaultOpen: true,
        children: [
          file(candidateSpec),
          file(softSkillsSpec),
          file(availabilitySpec),
          file(hireMeSpec),
        ],
      },
      {
        type: "folder",
        name: "case-studies",
        path: "case-studies",
        defaultOpen: true,
        children: [file(fintechRegression), file(ecommerceE2e)],
      },
      file(envFile),
    ],
  },
];

function flatten(nodes: FileNode[]): Extract<FileNode, { type: "file" }>[] {
  const out: Extract<FileNode, { type: "file" }>[] = [];
  for (const n of nodes) {
    if (n.type === "file") out.push(n);
    else out.push(...flatten(n.children));
  }
  return out;
}

export const allFiles = flatten(fileTree);

const byPath = new Map(allFiles.map((f) => [f.path, f]));

export function getFileByPath(path: string) {
  return byPath.get(path);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 9: Create `app/ide/IDEContext.tsx` (reducer + Provider + `useIDE`)

**Files:**
- Create: `app/ide/IDEContext.tsx`

**Why:** All IDE state lives here. The reducer ships with every action defined in spec §3 — even ones whose UI arrives in Phase 3/4 — so later phases dispatch without churn. Welcome lines, initial tabs, default cursor all derived from spec §3 "Initial state".

- [ ] **Step 1: Write `app/ide/IDEContext.tsx`**

```tsx
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
        // Prefer the neighbour to the left, then to the right, then null.
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 10: Create the shared icon set in `components/ui/Icon.tsx`

**Files:**
- Create: `components/ui/Icon.tsx`

**Why:** Every IDE region needs tiny inline SVGs (file-type icons, folder, chevron, close, play, stop, etc.). One module avoids inlining 24-line SVGs in every consumer.

- [ ] **Step 1: Write `components/ui/Icon.tsx`**

```tsx
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function base(props: IconProps) {
  return {
    viewBox: "0 0 16 16",
    width: 16,
    height: 16,
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M2 4a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z" />
    </svg>
  );
}

export function TSIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect width="16" height="16" rx="2" fill="#1f6feb" />
      <text
        x="8"
        y="11"
        fontSize="7"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#fff"
      >
        TS
      </text>
    </svg>
  );
}

export function MDIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect width="16" height="16" rx="2" fill="#30363d" />
      <text
        x="8"
        y="11"
        fontSize="6"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#79c0ff"
      >
        MD
      </text>
    </svg>
  );
}

export function EnvIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect width="16" height="16" rx="2" fill="#1c2128" />
      <text
        x="8"
        y="11"
        fontSize="5.5"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#d29922"
      >
        ENV
      </text>
    </svg>
  );
}

export function FileIcon({ language, ...rest }: IconProps & { language: "ts" | "md" | "env" }) {
  if (language === "ts") return <TSIcon {...rest} />;
  if (language === "md") return <MDIcon {...rest} />;
  return <EnvIcon {...rest} />;
}

export function ExplorerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 3h5l1.5 1.5H14V13H2V3z" />
      <path d="M2 7h12" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="7" r="4" />
      <path d="M10 10l3.5 3.5" />
    </svg>
  );
}

export function GitIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="4" cy="4" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
      <path d="M4 5.5v5M5.5 4h2.5a2 2 0 0 1 2 2v.5" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M5 4l8 4-8 4V4z" />
    </svg>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect x="4" y="4" width="8" height="8" rx="1" />
    </svg>
  );
}

export function ExtensionsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1V9z" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" />
    </svg>
  );
}

export function NewFileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 2h5l3 3v9H4V2z" />
      <path d="M8 7v4M6 9h4" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8a5 5 0 1 1 1.4 3.5" />
      <path d="M3 13v-3h3" />
    </svg>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 6l3-3 3 3M3 10l3 3 3-3M11 5h2M11 11h2" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11V8a4 4 0 0 1 8 0v3l1 1H3l1-1zM7 13a1 1 0 0 0 2 0" />
    </svg>
  );
}

export function ErrorDot(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="5" />
      <path d="M8 5v3.5M8 11v.5" />
    </svg>
  );
}

export function WarningDot(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 2l6 11H2L8 2z" />
      <path d="M8 6v3.5M8 11v.5" />
    </svg>
  );
}

export function BranchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="4" cy="3" r="1.5" />
      <circle cx="4" cy="13" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
      <path d="M4 4.5v7M5.5 13c4 0 5-2 5-3.5" />
    </svg>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 11: Create the regex-based highlighter in `components/ui/SyntaxHighlight.tsx`

**Files:**
- Create: `components/ui/SyntaxHighlight.tsx`

**Why:** Spec §7 requires per-language highlighting without external deps. A regex pass per language keeps the implementation under ~120 lines, the bundle small, and the runtime negligible (each file is tokenised once at render time). The regex order matters — comments first, then strings, then keywords — because earlier tokens swallow characters and prevent later patterns from matching inside them.

- [ ] **Step 1: Write `components/ui/SyntaxHighlight.tsx`**

```tsx
import type { Language } from "@/app/ide/types";

type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "fn"
  | "prop"
  | "const"
  | "tag"
  | "punct"
  | "plain";

type Token = { type: TokenType; text: string };

const tsKeywords =
  /\b(import|export|from|as|const|let|var|function|return|async|await|type|interface|class|extends|implements|new|if|else|for|while|do|switch|case|break|continue|true|false|null|undefined|void|typeof|in|of)\b/;

// Order matters: comments and strings must win over keywords, so we scan them first.
const tsPatterns: Array<{ type: TokenType; re: RegExp }> = [
  { type: "comment", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { type: "string", re: /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
  { type: "keyword", re: tsKeywords },
  { type: "number", re: /\b\d+(?:\.\d+)?\b/ },
  { type: "const", re: /\b[A-Z][A-Z0-9_]{2,}\b/ },
  { type: "fn", re: /\b[a-zA-Z_$][\w$]*(?=\s*\()/ },
  { type: "prop", re: /(?<=\.)[a-zA-Z_$][\w$]*/ },
];

const envPatterns: Array<{ type: TokenType; re: RegExp }> = [
  { type: "comment", re: /#[^\n]*/ },
  { type: "keyword", re: /^[A-Z_][A-Z0-9_]*(?==)/m },
  { type: "string", re: /(?<==)[^\n]+/ },
];

function tokenizeLine(line: string, patterns: typeof tsPatterns): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;
  while (cursor < line.length) {
    let bestIdx = -1;
    let bestType: TokenType | null = null;
    let bestText = "";
    for (const { type, re } of patterns) {
      // Anchor each scan at the current cursor by slicing.
      const m = line.slice(cursor).match(re);
      if (!m || m.index === undefined) continue;
      if (bestIdx === -1 || m.index < bestIdx) {
        bestIdx = m.index;
        bestType = type;
        bestText = m[0];
      }
    }
    if (bestType === null || bestIdx === -1) {
      tokens.push({ type: "plain", text: line.slice(cursor) });
      break;
    }
    if (bestIdx > 0) {
      tokens.push({ type: "plain", text: line.slice(cursor, cursor + bestIdx) });
    }
    tokens.push({ type: bestType, text: bestText });
    cursor += bestIdx + bestText.length;
  }
  return tokens;
}

function tokenizeMdLine(line: string): Token[] {
  // Headings — whole-line.
  const heading = /^(#{1,6})\s+(.+)$/.exec(line);
  if (heading) {
    return [
      { type: "keyword", text: heading[1] + " " },
      { type: "tag", text: heading[2] ?? "" },
    ];
  }
  // List bullets.
  const bullet = /^(\s*[-*]\s)(.+)$/.exec(line);
  if (bullet) {
    return [
      { type: "keyword", text: bullet[1] ?? "" },
      ...inlineMd(bullet[2] ?? ""),
    ];
  }
  return inlineMd(line);
}

function inlineMd(text: string): Token[] {
  const out: Token[] = [];
  const re =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ type: "plain", text: text.slice(last, idx) });
    const tok = m[0];
    if (tok.startsWith("**")) out.push({ type: "keyword", text: tok });
    else if (tok.startsWith("`")) out.push({ type: "string", text: tok });
    else if (tok.startsWith("[")) out.push({ type: "fn", text: tok });
    else out.push({ type: "prop", text: tok });
    last = idx + tok.length;
  }
  if (last < text.length) out.push({ type: "plain", text: text.slice(last) });
  return out;
}

const classFor: Record<TokenType, string> = {
  keyword: "text-sx-keyword",
  string: "text-sx-string",
  number: "text-sx-number",
  comment: "text-sx-comment italic",
  fn: "text-sx-fn",
  prop: "text-sx-prop",
  const: "text-sx-const",
  tag: "text-sx-tag",
  punct: "text-sx-punct",
  plain: "text-fg",
};

export function SyntaxHighlight({
  content,
  language,
}: {
  content: string;
  language: Language;
}) {
  const lines = content.split("\n");
  return (
    <code className="block whitespace-pre font-mono text-[13px] leading-[1.6]">
      {lines.map((line, lineIdx) => {
        let tokens: Token[];
        if (language === "ts") tokens = tokenizeLine(line, tsPatterns);
        else if (language === "env") tokens = tokenizeLine(line, envPatterns);
        else tokens = tokenizeMdLine(line);
        return (
          <div key={lineIdx}>
            {tokens.length === 0 ? " " : null}
            {tokens.map((t, i) => (
              <span key={i} className={classFor[t.type]}>
                {t.text}
              </span>
            ))}
          </div>
        );
      })}
    </code>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 12: Create `components/ide/TitleBar.tsx`

**Files:**
- Create: `components/ide/TitleBar.tsx`

- [ ] **Step 1: Make the directory**

```bash
mkdir -p components/ide
```

- [ ] **Step 2: Write `components/ide/TitleBar.tsx`**

```tsx
"use client";

export function TitleBar() {
  return (
    <header
      className="flex h-[var(--ide-titlebar-h)] items-center border-b border-border bg-bg-surface px-3"
      role="banner"
    >
      <div className="flex items-center gap-2" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-70" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-70" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-70" />
      </div>
      <div className="flex flex-1 items-center justify-center gap-2 font-mono text-xs text-fg-muted">
        <span className="h-2 w-2 rounded-full bg-accent-green" aria-hidden />
        jakubruniecki — portfolio.code
      </div>
      <div className="w-16" aria-hidden />
    </header>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 13: Create `components/ide/ActivityBar.tsx`

**Files:**
- Create: `components/ide/ActivityBar.tsx`

**Why:** Phase 1 wires only the cosmetic `active` toggle. The two real handlers (Search → palette, Run → tests) are added in Phase 4 by reading `useIDE().dispatch`. Keeping the component shape stable now means Phase 4 changes are one-liners.

- [ ] **Step 1: Write `components/ide/ActivityBar.tsx`**

```tsx
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
            aria-label={label}
            aria-pressed={active}
            data-action={action}
            onClick={() => {
              dispatch({ type: "SET_ACTIVITY", action });
              // Real side-effects (palette, tests) are wired in Phase 4.
            }}
            className={`flex h-10 w-10 items-center justify-center rounded text-fg-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue ${
              active ? "border-l-2 border-fg text-fg" : ""
            }`}
          >
            <Icon className="h-5 w-5" width={20} height={20} />
          </button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 14: Create `components/ide/StatusBar.tsx` (static for Phase 1)

**Files:**
- Create: `components/ide/StatusBar.tsx`

**Why:** Clock + mailto + reactive language come online in Phase 4. Phase 1 ships a static strip so the layout grid is complete and the page builds.

- [ ] **Step 1: Write `components/ide/StatusBar.tsx`**

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { BranchIcon, BellIcon, ErrorDot, WarningDot } from "@/components/ui/Icon";

function languageLabel(path: string | null): string {
  if (!path) return "Plain";
  const f = getFileByPath(path);
  if (!f) return "Plain";
  if (f.language === "ts") return "TypeScript";
  if (f.language === "md") return "Markdown";
  return "Plain";
}

export function StatusBar() {
  const { state } = useIDE();
  return (
    <footer
      role="contentinfo"
      aria-label="Status bar"
      className="flex h-[var(--ide-statusbar-h)] items-center justify-between border-t border-border bg-accent-blue-dim/30 px-3 font-mono text-[11px] text-fg"
    >
      <div className="flex items-center gap-4">
        <span className="cursor-pointer hover:underline">CV on request</span>
        <span className="flex items-center gap-1">
          <BranchIcon className="h-3 w-3" width={12} height={12} />
          main
        </span>
        <span className="flex items-center gap-1">
          <span
            className="h-2 w-2 rounded-full bg-accent-green"
            style={{ animation: "live-pulse 1.6s ease-in-out infinite" }}
            aria-hidden
          />
          build passing
        </span>
        <span className="flex items-center gap-1">
          <ErrorDot className="h-3 w-3" width={12} height={12} />0
        </span>
        <span className="flex items-center gap-1">
          <WarningDot className="h-3 w-3" width={12} height={12} />0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span suppressHydrationWarning>--:--:-- CET</span>
        <span>
          Ln {state.cursorLine}, Col {state.cursorCol}
        </span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>{languageLabel(state.activeTabPath)}</span>
        <BellIcon className="h-3 w-3" width={12} height={12} />
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 15: Create `components/ide/Sidebar/OpenEditors.tsx`

**Files:**
- Create: `components/ide/Sidebar/OpenEditors.tsx`

- [ ] **Step 1: Make the directory**

```bash
mkdir -p components/ide/Sidebar
```

- [ ] **Step 2: Write `components/ide/Sidebar/OpenEditors.tsx`**

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { ChevronIcon, CloseIcon, FileIcon } from "@/components/ui/Icon";

export function OpenEditors() {
  const { state, dispatch } = useIDE();
  const collapsed = state.openEditorsCollapsed;
  return (
    <section aria-label="Open editors" className="border-b border-border-subtle">
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_OPEN_EDITORS" })}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-1 px-3 py-1 text-left font-mono text-[11px] uppercase tracking-wide text-fg-muted hover:text-fg"
      >
        <ChevronIcon
          className={`h-3 w-3 transition-transform ${collapsed ? "" : "rotate-90"}`}
          width={12}
          height={12}
        />
        Open editors
      </button>
      {collapsed ? null : (
        <ul className="pb-1">
          {state.openTabs.map((tab) => {
            const file = getFileByPath(tab.path);
            if (!file) return null;
            const active = state.activeTabPath === tab.path;
            return (
              <li key={tab.path}>
                <div
                  className={`group flex items-center gap-1 px-4 py-0.5 text-[13px] ${
                    active ? "bg-bg-elevated text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "SET_ACTIVE_TAB", path: tab.path })
                    }
                    className="flex flex-1 items-center gap-1.5 text-left"
                  >
                    <FileIcon
                      language={file.language}
                      className="h-3.5 w-3.5"
                      width={14}
                      height={14}
                    />
                    {file.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Close ${file.name}`}
                    onClick={() => dispatch({ type: "CLOSE_TAB", path: tab.path })}
                    className="rounded p-0.5 text-fg-muted opacity-0 hover:bg-bg-subtle hover:text-fg group-hover:opacity-100"
                  >
                    <CloseIcon
                      className="h-3 w-3"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 16: Create `components/ide/Sidebar/FileTreeNode.tsx`

**Files:**
- Create: `components/ide/Sidebar/FileTreeNode.tsx`

- [ ] **Step 1: Write `components/ide/Sidebar/FileTreeNode.tsx`**

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";
import type { FileNode } from "@/app/ide/types";
import { ChevronIcon, FileIcon, FolderIcon } from "@/components/ui/Icon";

export function FileTreeNode({
  node,
  depth,
}: {
  node: FileNode;
  depth: number;
}) {
  const { state, dispatch } = useIDE();
  const indent = { paddingLeft: 8 + depth * 12 };

  if (node.type === "folder") {
    const open = state.treeOpenFolders[node.path] ?? false;
    return (
      <>
        <button
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_FOLDER", path: node.path })}
          aria-expanded={open}
          style={indent}
          className="flex w-full items-center gap-1 py-0.5 text-left text-[13px] text-fg hover:bg-bg-subtle"
        >
          <ChevronIcon
            className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
            width={12}
            height={12}
          />
          <FolderIcon className="h-3.5 w-3.5 text-accent-blue" width={14} height={14} />
          <span>{node.name}</span>
        </button>
        {open
          ? node.children.map((child) => (
              <FileTreeNode key={child.path} node={child} depth={depth + 1} />
            ))
          : null}
      </>
    );
  }

  const active = state.activeTabPath === node.path;
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "OPEN_FILE", path: node.path })}
      style={indent}
      className={`flex w-full items-center gap-1 py-0.5 text-left text-[13px] ${
        active ? "bg-bg-elevated text-fg" : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
      }`}
    >
      <span className="w-3" aria-hidden />
      <FileIcon
        language={node.language}
        className="h-3.5 w-3.5"
        width={14}
        height={14}
      />
      <span>{node.name}</span>
    </button>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 17: Create `components/ide/Sidebar/FileTree.tsx`

**Files:**
- Create: `components/ide/Sidebar/FileTree.tsx`

- [ ] **Step 1: Write `components/ide/Sidebar/FileTree.tsx`**

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";
import { fileTree } from "@/data/files";
import { ChevronIcon } from "@/components/ui/Icon";
import { FileTreeNode } from "./FileTreeNode";

export function FileTree() {
  const { state, dispatch } = useIDE();
  const collapsed = state.filesCollapsed;
  return (
    <section aria-label="Files" className="border-b border-border-subtle">
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_FILES_SECTION" })}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-1 px-3 py-1 text-left font-mono text-[11px] uppercase tracking-wide text-fg-muted hover:text-fg"
      >
        <ChevronIcon
          className={`h-3 w-3 transition-transform ${collapsed ? "" : "rotate-90"}`}
          width={12}
          height={12}
        />
        jakubruniecki
      </button>
      {collapsed ? null : (
        <div role="tree" aria-label="Project files" className="pb-2">
          {fileTree[0]?.type === "folder"
            ? fileTree[0].children.map((node) => (
                <FileTreeNode key={node.path} node={node} depth={0} />
              ))
            : null}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 18: Create `components/ide/Sidebar/Timeline.tsx`

**Files:**
- Create: `components/ide/Sidebar/Timeline.tsx`

- [ ] **Step 1: Write `components/ide/Sidebar/Timeline.tsx`**

```tsx
"use client";

const ITEMS: ReadonlyArray<string> = [
  "2026 · Senior QA · open to remote",
  "2024 · 3d → 4h regression",
  "2023 · Playwright + CI",
  "2020 · First QA role",
];

export function Timeline() {
  return (
    <section aria-label="Timeline" className="px-3 py-2">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
        Timeline
      </div>
      <ul className="space-y-1 font-mono text-[12px] text-fg-muted">
        {ITEMS.map((text) => (
          <li key={text} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent-blue"
              aria-hidden
            />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 19: Create `components/ide/Sidebar/Sidebar.tsx`

**Files:**
- Create: `components/ide/Sidebar/Sidebar.tsx`

- [ ] **Step 1: Write `components/ide/Sidebar/Sidebar.tsx`**

```tsx
"use client";

import { NewFileIcon, RefreshIcon, CollapseIcon } from "@/components/ui/Icon";
import { OpenEditors } from "./OpenEditors";
import { FileTree } from "./FileTree";
import { Timeline } from "./Timeline";

export function Sidebar() {
  return (
    <aside
      aria-label="Explorer"
      className="flex w-[var(--ide-sidebar-w)] flex-col border-r border-border bg-bg-surface"
    >
      <div className="flex h-8 items-center justify-between border-b border-border-subtle px-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-fg-muted">
          Explorer
        </span>
        <div className="flex items-center gap-1 text-fg-muted">
          <button type="button" aria-label="New file" className="rounded p-1 hover:text-fg">
            <NewFileIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
          <button type="button" aria-label="Refresh" className="rounded p-1 hover:text-fg">
            <RefreshIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
          <button type="button" aria-label="Collapse all" className="rounded p-1 hover:text-fg">
            <CollapseIcon className="h-3.5 w-3.5" width={14} height={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <OpenEditors />
        <FileTree />
        <Timeline />
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 20: Create `components/ide/EditorArea/TabBar.tsx` with HTML5 DnD reorder

**Files:**
- Create: `components/ide/EditorArea/TabBar.tsx`

**Why:** Native HTML5 drag-and-drop is fiddly but dependency-free. Three handlers do the work: `dragstart` stashes the index in `dataTransfer`, `dragover` (with `preventDefault`) marks the drop target, and `drop` dispatches `REORDER_TABS`. A11y limitation noted in spec §12 — sighted-mouse only.

- [ ] **Step 1: Make the directory**

```bash
mkdir -p components/ide/EditorArea
```

- [ ] **Step 2: Write `components/ide/EditorArea/TabBar.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { CloseIcon, FileIcon } from "@/components/ui/Icon";

export function TabBar() {
  const { state, dispatch } = useIDE();
  const dragFromIdx = useRef<number | null>(null);
  return (
    <div
      role="tablist"
      aria-label="Open files"
      className="flex h-[var(--ide-tabbar-h)] items-stretch overflow-x-auto border-b border-border bg-bg-surface"
    >
      {state.openTabs.map((tab, idx) => {
        const file = getFileByPath(tab.path);
        if (!file) return null;
        const active = state.activeTabPath === tab.path;
        return (
          <div
            key={tab.path}
            role="tab"
            aria-selected={active}
            draggable
            onDragStart={(e) => {
              dragFromIdx.current = idx;
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(idx));
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const from = dragFromIdx.current;
              if (from === null || from === idx) return;
              dispatch({ type: "REORDER_TABS", fromIdx: from, toIdx: idx });
              dragFromIdx.current = null;
            }}
            onDragEnd={() => {
              dragFromIdx.current = null;
            }}
            className={`group flex cursor-pointer items-center gap-2 border-r border-border px-3 text-[13px] ${
              active
                ? "bg-bg-base text-fg"
                : "bg-bg-surface text-fg-muted hover:text-fg"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_TAB", path: tab.path })
              }
              className="flex items-center gap-2"
            >
              <FileIcon
                language={file.language}
                className="h-3.5 w-3.5"
                width={14}
                height={14}
              />
              <span>{file.name}</span>
            </button>
            <button
              type="button"
              aria-label={`Close ${file.name}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "CLOSE_TAB", path: tab.path });
              }}
              className="rounded p-0.5 text-fg-muted opacity-0 hover:bg-bg-subtle hover:text-fg group-hover:opacity-100"
            >
              <CloseIcon className="h-3 w-3" width={12} height={12} />
            </button>
          </div>
        );
      })}
      <div className="flex-1 bg-bg-deeper" aria-hidden />
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 21: Create `components/ide/EditorArea/Breadcrumb.tsx`

**Files:**
- Create: `components/ide/EditorArea/Breadcrumb.tsx`

- [ ] **Step 1: Write `components/ide/EditorArea/Breadcrumb.tsx`**

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";

export function Breadcrumb() {
  const { state } = useIDE();
  const path = state.activeTabPath;
  if (!path) return null;
  const parts = path.split("/");
  // Inspiration prefixes the workspace root onto every breadcrumb.
  const segments = ["portfolio", ...parts];
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-6 items-center border-b border-border-subtle bg-bg-base px-3 font-mono text-[11px] text-fg-muted"
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center">
          {i > 0 ? <span className="mx-1 text-fg-subtle">›</span> : null}
          {seg}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 22: Create `components/ide/EditorArea/EditorBody.tsx` (no typewriter yet)

**Files:**
- Create: `components/ide/EditorArea/EditorBody.tsx`

**Why:** Phase 1 renders the file content immediately; Phase 4 adds the boot typewriter by replacing the immediate text with a `useState`-tracked slice. Keeping this component small now makes that swap trivial.

- [ ] **Step 1: Write `components/ide/EditorArea/EditorBody.tsx`**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 23: Create `components/ide/EditorArea/Splitter.tsx` placeholder

**Files:**
- Create: `components/ide/EditorArea/Splitter.tsx`

**Why:** Phase 1 renders a static 4px horizontal bar so the grid math works. Drag handlers are added in Phase 3 (Task 50). Splitting the placeholder from the real component keeps Phase 1 commitable on its own.

- [ ] **Step 1: Write `components/ide/EditorArea/Splitter.tsx`**

```tsx
"use client";

export function Splitter() {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize bottom panel"
      className="h-[var(--ide-splitter-h)] cursor-row-resize bg-border hover:bg-accent-blue-dim"
    />
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 24: Create `components/ide/BottomPanel/BottomPanel.tsx` placeholder

**Files:**
- Create: `components/ide/BottomPanel/BottomPanel.tsx`

**Why:** Phase 1 renders the panel tabs strip and an empty body so the layout grid is complete. Real Terminal + TestRunner arrive in Phase 3.

- [ ] **Step 1: Make the directory**

```bash
mkdir -p components/ide/BottomPanel
```

- [ ] **Step 2: Write `components/ide/BottomPanel/BottomPanel.tsx`**

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";

const TABS: ReadonlyArray<{ label: string; meta?: string }> = [
  { label: "PROBLEMS", meta: "0" },
  { label: "OUTPUT" },
  { label: "TERMINAL" },
  { label: "TEST RESULTS", meta: "·" },
];

export function BottomPanel() {
  const { state } = useIDE();
  return (
    <section
      aria-label="Bottom panel"
      style={{ height: state.panelHeightPx }}
      className="flex flex-col border-t border-border bg-bg-base"
    >
      <div className="flex h-8 items-center justify-between border-b border-border-subtle bg-bg-surface px-3 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
        <div className="flex items-center gap-4">
          {TABS.map((t, i) => (
            <span
              key={t.label}
              className={i === 2 ? "flex items-center gap-1 text-fg" : ""}
            >
              {i === 2 ? <span className="text-accent-green">●</span> : null}
              {t.label}
              {t.meta ? <span className="ml-1 text-fg-subtle">({t.meta})</span> : null}
            </span>
          ))}
        </div>
        <div className="font-mono text-[11px] normal-case text-fg-muted">
          zsh — portfolio | node v20.11.0
        </div>
      </div>
      <div className="flex-1 overflow-hidden" aria-hidden>
        {/* Phase 3 fills this with Terminal + TestRunner. */}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 25: Create `components/ide/EditorArea/EditorArea.tsx`

**Files:**
- Create: `components/ide/EditorArea/EditorArea.tsx`

- [ ] **Step 1: Write `components/ide/EditorArea/EditorArea.tsx`**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 26: Create `components/ide/MobileFallback.tsx`

**Files:**
- Create: `components/ide/MobileFallback.tsx`

- [ ] **Step 1: Write `components/ide/MobileFallback.tsx`**

```tsx
import { profile } from "@/data/profile";
import { contactLinks, cvRequestHref } from "@/data/contact";
import {
  EmailIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";

const iconFor = {
  email: EmailIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};

export function MobileFallback() {
  return (
    <main className="block min-h-screen bg-bg-base px-6 py-10 text-fg md:hidden">
      <div className="flex flex-col items-center text-center">
        <img
          src="/photo.jpg"
          alt={profile.name}
          className="h-16 w-16 rounded-full border-2 border-border object-cover"
        />
        <h1 className="mt-4 text-xl font-semibold">{profile.name}</h1>
        <p className="mt-1 font-mono text-sm text-fg-muted">
          {profile.role} · {profile.tagline}
        </p>
      </div>

      <div className="mt-6 rounded-md border border-border bg-bg-surface p-4 font-mono text-xs text-fg-muted">
        Open on desktop for the full IDE experience — interactive file tree,
        terminal commands, and a live test runner.
      </div>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8">
        <div className="font-mono text-xs text-fg-muted">// contact</div>
        <ul className="mt-2 space-y-2">
          {contactLinks.map((c) => {
            const Icon = iconFor[c.icon];
            return (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="flex items-center gap-2 text-[14px] text-fg hover:text-accent-blue"
                >
                  <Icon className="h-4 w-4 text-fg-muted" />
                  {c.value}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href={cvRequestHref}
        className="mt-8 inline-flex items-center gap-2 rounded-md border border-accent-green/40 bg-accent-green/10 px-4 py-2 font-mono text-sm text-accent-green"
      >
        ✉ Request CV
      </a>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 27: Create `app/seo/SEOContent.tsx`

**Files:**
- Create: `app/seo/SEOContent.tsx`

**Why:** This is a server component (no `'use client'`). Server-rendered HTML is what Google, LinkedIn previews, and screen readers see. Wrapped in `sr-only` so sighted users see only the IDE.

- [ ] **Step 1: Make the directory**

```bash
mkdir -p app/seo
```

- [ ] **Step 2: Write `app/seo/SEOContent.tsx`**

```tsx
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { contactLinks } from "@/data/contact";

export function SEOContent() {
  return (
    <div id="seo-content" className="sr-only">
      <h1>
        {profile.name} — {profile.role}
      </h1>
      <p>{profile.tagline}</p>

      <section aria-label="About">
        <h2>About</h2>
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p>
          Location: {profile.location}. Status: {profile.status}. Experience:{" "}
          {profile.yearsOfExperience} years (
          {profile.experienceBreakdown.join(", ")}).
        </p>
      </section>

      <section aria-label="Skills">
        <h2>Skills</h2>
        <ul>
          {skills.map((s) => (
            <li key={s.name}>
              {s.name} — {s.level} ({s.category})
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Projects">
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.type === "demo-repo" ? (
              <>
                <p>Tech: {p.tech.join(", ")}</p>
                <ul>
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <p>
                  <a href={p.githubUrl}>GitHub</a>
                </p>
              </>
            ) : (
              <>
                <p>
                  {p.industry} · {p.role} · {p.duration}
                </p>
                <ul>
                  {p.metrics.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <p>Tech used: {p.techUsed.join(", ")}</p>
              </>
            )}
          </article>
        ))}
      </section>

      <section aria-label="Contact">
        <h2>Contact</h2>
        <ul>
          {contactLinks.map((c) => (
            <li key={c.label}>
              <a href={c.href}>
                {c.label}: {c.value}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 28: Create `app/ide/IDE.tsx`

**Files:**
- Create: `app/ide/IDE.tsx`

**Why:** This is the single `'use client'` boundary. Everything below it inherits client-side execution; `app/page.tsx` stays a server file that renders the SEO block + this wrapper. The grid here implements the full desktop layout (title bar / activity bar + sidebar + editor area + status bar).

- [ ] **Step 1: Write `app/ide/IDE.tsx`**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 29: Wire everything in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { SEOContent } from "@/app/seo/SEOContent";
import { IDE } from "@/app/ide/IDE";
import { MobileFallback } from "@/components/ide/MobileFallback";

export default function HomePage() {
  return (
    <>
      <SEOContent />
      <IDE />
      <MobileFallback />
    </>
  );
}
```

- [ ] **Step 2: Typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: zero errors.

---

### Task 30: Phase 1 visual verification

**Files:** (none — visual check)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000` at a desktop viewport (≥1024px).

- [ ] **Step 2: Confirm the following render correctly**

- Title bar at the top: three coloured dots on the left, `● jakubruniecki — portfolio.code` centred.
- Activity bar on the left (48px wide) with six icons; Explorer is highlighted.
- Sidebar (248px wide) with `EXPLORER` head + three action icons; `OPEN EDITORS` shows `README.md`; `JAKUBRUNIECKI` shows the full tree (portfolio/, tests/, case-studies/, .env); `TIMELINE` lists the four milestones.
- Editor area shows one tab (`README.md`), breadcrumb `portfolio › README.md`, and the stub content `# content pending review (Phase 2)` with line numbers.
- Bottom panel placeholder shows the four panel tabs (`PROBLEMS (0) / OUTPUT / ● TERMINAL / TEST RESULTS (·)`) and the right-aligned meta `zsh — portfolio | node v20.11.0`. Body is empty.
- Status bar at the bottom: left segments `CV on request · main · ● build passing · 0 · 0`; right segments `--:--:-- CET · Ln 1, Col 1 · Spaces: 2 · UTF-8 · LF · Markdown · 🔔`.
- Clicking a file in the tree adds a tab and switches active tab.
- Clicking the `✕` on a tab closes it; the neighbour to the left becomes active.
- Dragging a tab onto another reorders the tab strip.
- The chevron next to each folder rotates open/closed; the folder collapses.
- Resizing the window to ≤768px hides the IDE and shows `MobileFallback` (photo + bio + contacts + Request CV pill).

- [ ] **Step 3: Confirm the SEO block is present in the page source**

Open the page source (Ctrl+U) and confirm the markup contains:
- `<h1>Jakub Bruniecki — Senior QA Engineer</h1>`
- `<section aria-label="About">` with both bio paragraphs.
- `<section aria-label="Skills">` listing every skill.
- `<section aria-label="Projects">` with two `<article>` entries.
- `<section aria-label="Contact">` listing all four contact links.

- [ ] **Step 4: Stop the dev server (`Ctrl+C`)**

---

### Task 31: Phase 1 commit

**Files:**
- All Phase 1 files

- [ ] **Step 1: Stage everything**

```bash
git add .
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: redesign portfolio shell — IDE layout, sidebar, tabs, editor body"
```

- [ ] **Step 3: Verify clean tree**

Run: `git status`
Expected: `nothing to commit, working tree clean`.

---

## Phase 2 — Content (`data/files/*`)

Drafts — Kuba reviews before commit. Iterate if needed.

### Task 32: Populate `data/files/aboutTs.ts`

**Files:**
- Modify: `data/files/aboutTs.ts`

- [ ] **Step 1: Replace `data/files/aboutTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const aboutTs = {
  path: "portfolio/about.ts",
  name: "about.ts",
  language: "ts" as Language,
  content: `// about.ts — who I am, in code.

export const about = {
  name: "Jakub Bruniecki",
  role: "Senior QA Engineer",
  tagline: "Manual leadership + Playwright automation",
  yearsOfExperience: 5,
  breakdown: {
    manualTesting: "3.5y",
    automation: "1.5y",
    domains: ["Fintech", "E-commerce"],
  },
  location: "Warsaw, Poland",
  timezone: "Europe/Warsaw",
  openTo: "international remote",
  status: "open-to-work" as const,
  bio: [
    "I'm a QA engineer with 5 years of experience across fintech and e-commerce.",
    "Most of that was hands-on manual testing; the last 1.5 years I've focused",
    "on building Playwright automation suites that actually pay off — fewer",
    "regressions, faster releases, predictable outcomes.",
    "",
    "I treat tests as a feature, not a tax. The goal isn't coverage numbers —",
    "it's catching the issues that would have shipped, and giving the team",
    "enough confidence to move faster.",
  ],
};

export type About = typeof about;
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 33: Populate `data/files/skillsTs.ts`

**Files:**
- Modify: `data/files/skillsTs.ts`

- [ ] **Step 1: Replace `data/files/skillsTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const skillsTs = {
  path: "portfolio/skills.ts",
  name: "skills.ts",
  language: "ts" as Language,
  content: `// skills.ts — grouped by category, levelled honestly.

type Level = "advanced" | "intermediate" | "beginner";

export const skills: Record<string, { level: Level; years?: number }[]> = {
  automation: [
    { level: "intermediate", years: 1.5 }, // Playwright
    { level: "intermediate", years: 1.5 }, // TypeScript
    { level: "advanced", years: 4 },       // Postman
    { level: "intermediate" },             // Newman
    { level: "beginner" },                 // GitHub Actions
  ],
  manual: [
    { level: "advanced", years: 5 },       // Test design
    { level: "advanced", years: 5 },       // Exploratory testing
    { level: "advanced" },                 // JIRA
    { level: "advanced" },                 // TestRail
    { level: "intermediate" },             // Xray
    { level: "advanced" },                 // Bug triage
  ],
  tools: [
    { level: "intermediate" },             // Git
    { level: "advanced" },                 // REST APIs
    { level: "intermediate" },             // SQL
    { level: "advanced" },                 // Chrome DevTools
  ],
};

export const labels = {
  automation: ["Playwright", "TypeScript", "Postman", "Newman", "GitHub Actions"],
  manual: ["Test design", "Exploratory testing", "JIRA", "TestRail", "Xray", "Bug triage"],
  tools: ["Git", "REST APIs", "SQL", "Chrome DevTools"],
};
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 34: Populate `data/files/projectsTs.ts`

**Files:**
- Modify: `data/files/projectsTs.ts`

- [ ] **Step 1: Replace `data/files/projectsTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const projectsTs = {
  path: "portfolio/projects.ts",
  name: "projects.ts",
  language: "ts" as Language,
  content: `// projects.ts — the work I'd point a recruiter at.

export const projects = [
  {
    type: "demo-repo",
    title: "E-commerce E2E Test Suite",
    description:
      "Playwright + TypeScript test suite against a public e-commerce demo site. " +
      "POM architecture, fixtures, parallel execution, CI on every push.",
    tech: ["Playwright", "TypeScript", "GitHub Actions"],
    githubUrl: "https://github.com/REPLACE_WITH_REAL_URL",
    highlights: [
      "30+ end-to-end tests",
      "Page Object Model pattern",
      "Parallel runs, ~2 min total",
      "CI green badge on README",
    ],
    status: "active",
  },
  {
    type: "case-study",
    title: "Cutting regression cycle from 3 days to 4 hours",
    industry: "Fintech",
    role: "Senior QA Engineer",
    duration: "2023–2024",
    description:
      "Inherited a manual regression suite that blocked every release for three days. " +
      "Designed and built a Playwright suite covering critical user paths; " +
      "integrated into CI so regression ran on every PR.",
    metrics: [
      "3d → 4h regression cycle",
      "150+ automated E2E tests",
      "0 production incidents from covered paths post-launch",
    ],
    techUsed: ["Playwright", "TypeScript", "Postman", "JIRA"],
  },
] as const;
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 35: Populate `data/files/contactTs.ts`

**Files:**
- Modify: `data/files/contactTs.ts`

- [ ] **Step 1: Replace `data/files/contactTs.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const contactTs = {
  path: "portfolio/contact.ts",
  name: "contact.ts",
  language: "ts" as Language,
  content: `// contact.ts — how to reach me.

export const EMAIL = "jakubruniecki@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/REPLACE_WITH_REAL_HANDLE/";
export const LOCATION = "Warsaw, Poland · CET";
export const PHONE = "+48000000000";

export const contact = [
  {
    label: "Email",
    value: EMAIL,
    href: \`mailto:\${EMAIL}?subject=Hello%20Jakub\`,
  },
  {
    label: "LinkedIn",
    value: LINKEDIN_URL.replace(/^https?:\\/\\//, "").replace(/\\/$/, ""),
    href: LINKEDIN_URL,
  },
  {
    label: "Location",
    value: LOCATION,
    href: "https://maps.google.com/?q=Warsaw,Poland",
  },
  {
    label: "Phone",
    value: PHONE,
    href: \`tel:\${PHONE}\`,
  },
] as const;

export const cvRequestHref =
  \`mailto:\${EMAIL}?subject=CV%20Request&body=Hi%20Jakub%2C%20...\`;
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 36: Populate `data/files/readme.ts`

**Files:**
- Modify: `data/files/readme.ts`

- [ ] **Step 1: Replace `data/files/readme.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const readme = {
  path: "README.md",
  name: "README.md",
  language: "md" as Language,
  content: `# Jakub Bruniecki — Senior QA Engineer

**TL;DR:** 5 years in QA — 3.5y manual, 1.5y Playwright automation.
Fintech + e-commerce. Based in Warsaw, open to international remote roles.

## How to read this portfolio

This is a working VS Code mock. Everything is interactive:

- Click any file in the **Explorer** on the left.
- Open the **terminal** (already focused) and try \`help\`.
- Watch the **test runner** in the bottom-right — it runs on load.
- Hit **⌘K** / **Ctrl+K** for the command palette.

## Start here

- \`portfolio/about.ts\` — the short version.
- \`portfolio/projects.ts\` — what I've shipped.
- \`case-studies/fintech-regression.md\` — the 3d → 4h story.
- \`portfolio/contact.ts\` — how to reach me.

## Hire me

If the tests pass (they will), type \`cv\` in the terminal and I'll reply within 24h.
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 37: Populate `data/files/tests/candidateSpec.ts`

**Files:**
- Modify: `data/files/tests/candidateSpec.ts`

- [ ] **Step 1: Replace `data/files/tests/candidateSpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const candidateSpec = {
  path: "tests/candidate.spec.ts",
  name: "candidate.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("Jakub Bruniecki — candidate", () => {
  test("has 5 years of QA experience", async () => {
    expect(candidate.yearsOfExperience).toBe(5);
  });

  test("writes maintainable Playwright code", async () => {
    expect(candidate.automation.framework).toBe("Playwright + TS");
    expect(candidate.automation.patterns).toContain("Page Object Model");
  });

  test("cuts regression from 3d to 4h", async () => {
    expect(candidate.impact.regression).toEqual({
      before: "3d",
      after: "4h",
    });
  });
});
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 38: Populate `data/files/tests/softSkillsSpec.ts`

**Files:**
- Modify: `data/files/tests/softSkillsSpec.ts`

- [ ] **Step 1: Replace `data/files/tests/softSkillsSpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const softSkillsSpec = {
  path: "tests/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("soft skills", () => {
  test("communicates clearly", async () => {
    expect(candidate.communication.style).toBe("direct, written-first");
  });

  test("mentors juniors", async () => {
    expect(candidate.mentorship.junior).toBeGreaterThanOrEqual(2);
  });

  test("owns the outcome", async () => {
    expect(candidate.ownership).toBe(true);
  });
});
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 39: Populate `data/files/tests/availabilitySpec.ts`

**Files:**
- Modify: `data/files/tests/availabilitySpec.ts`

- [ ] **Step 1: Replace `data/files/tests/availabilitySpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const availabilitySpec = {
  path: "tests/availability.spec.ts",
  name: "availability.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("availability", () => {
  test("is open to work", async () => {
    expect(candidate.status).toBe("open-to-work");
  });

  test("responds within 24h", async () => {
    expect(candidate.responseSLA.hours).toBeLessThanOrEqual(24);
  });

  test("considers remote roles", async () => {
    expect(candidate.workMode).toContain("remote");
  });
});
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 40: Populate `data/files/tests/hireMeSpec.ts`

**Files:**
- Modify: `data/files/tests/hireMeSpec.ts`

- [ ] **Step 1: Replace `data/files/tests/hireMeSpec.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const hireMeSpec = {
  path: "tests/hire-me.spec.ts",
  name: "hire-me.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("the bottom line", () => {
  test("hire me", async () => {
    const decision = candidate.shouldHire();
    expect(decision).toBe("YES");
  });
});
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 41: Populate `data/files/caseStudies/fintechRegression.ts`

**Files:**
- Modify: `data/files/caseStudies/fintechRegression.ts`

- [ ] **Step 1: Replace `data/files/caseStudies/fintechRegression.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const fintechRegression = {
  path: "case-studies/fintech-regression.md",
  name: "fintech-regression.md",
  language: "md" as Language,
  content: `# Cutting regression cycle from 3 days to 4 hours

**Industry:** Fintech · **Role:** Senior QA Engineer · **Duration:** 2023–2024

## Context

I joined a fintech team where every release was gated by a three-day manual
regression pass. Two QAs ran a shared spreadsheet of ~400 cases by hand.
Releases shipped weekly; effectively half of every week was regression.

## Problem

- Regression was the slowest, most error-prone step in the pipeline.
- Manual coverage drifted: cases were skipped under deadline pressure.
- Bug feedback arrived 2–3 days after the change that caused it.

## Approach

1. **Mapped the critical user journeys** with product and engineering — 12
   end-to-end paths covered ~80% of the regression value.
2. **Built a Playwright + TypeScript suite** using POM, fixtures for auth /
   accounts, and a shared API client for test data setup.
3. **Wired it into CI** (GitHub Actions) so the suite ran on every PR with
   parallel workers; total suite time ~6 min.
4. **Triaged flakes ruthlessly** — every flaky test was either stabilised or
   deleted within a week.

## Outcome

- Regression cycle: **3 days → 4 hours**.
- 150+ automated E2E tests, green CI badge on the main branch.
- **0 production incidents** from covered paths in the 6 months after launch.
- The team gained a release cadence of ~2× per week.

## What I'd do differently

- Start with API-level tests for the data setup earlier — cut UI flakes.
- Invest in test-data isolation (per-run accounts) from day one, not month two.
- Document the "stable test" criteria up front so the team agrees on the bar.
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 42: Populate `data/files/caseStudies/ecommerceE2e.ts`

**Files:**
- Modify: `data/files/caseStudies/ecommerceE2e.ts`

- [ ] **Step 1: Replace `data/files/caseStudies/ecommerceE2e.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const ecommerceE2e = {
  path: "case-studies/ecommerce-e2e.md",
  name: "ecommerce-e2e.md",
  language: "md" as Language,
  content: `# E-commerce E2E Test Suite

**Type:** Public demo repository · **Tech:** Playwright + TypeScript + GitHub Actions

## Why this exists

I wanted a public, reviewable demo of how I structure an automation suite
from scratch. It runs against a public e-commerce demo site (saucedemo) so
anyone can clone it, run it, and read the code.

## Architecture

- **Page Object Model** — one POM per page (login, inventory, cart, checkout).
  Locators are getters; user actions are async methods.
- **Fixtures** — \`@playwright/test\` fixtures for logged-in users with
  different inventory states (empty cart, items in cart, etc.).
- **Test data** — a tiny TS module exports the demo users; tests reference
  it instead of hard-coded strings.
- **Selectors** — \`getByRole\` / \`getByTestId\` first, CSS as a last resort.
  Zero \`waitForTimeout\` calls in the suite.

## Parallel execution

Tests run in 4 workers with full isolation. Total suite time on CI: ~2 min for
30+ tests across the full purchase flow plus error / edge cases.

## CI integration

GitHub Actions workflow runs on every push and PR. Failures upload the
Playwright HTML report as an artifact and the trace viewer is one click away.

## Results

- **30+ end-to-end tests** covering the critical purchase path.
- **CI green badge** on the README; one-click HTML report on failure.
- **Public, reviewable code** — recruiters can read the actual implementation,
  not just the description.

## Repo

[github.com/jakubruniecki/ecommerce-e2e](https://github.com/REPLACE_WITH_REAL_URL)
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 43: Populate `data/files/env.ts`

**Files:**
- Modify: `data/files/env.ts`

- [ ] **Step 1: Replace `data/files/env.ts`**

```ts
import type { Language } from "@/app/ide/types";

export const envFile = {
  path: ".env",
  name: ".env",
  language: "env" as Language,
  content: `OPEN_TO_WORK=true
ROLE=Senior QA Engineer
LOCATION=Warsaw, Poland
TIMEZONE=Europe/Warsaw
CV_DELIVERY=on-request
# secrets are .gitignored 😉
`,
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 44: Verify Phase 2 visually

**Files:** (none — visual check)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000`.

- [ ] **Step 2: Confirm every file shows real content**

Click each entry in the tree and check the editor body:
- `README.md` — Markdown rendering with `#` heading highlighted, list bullets in keyword colour, inline `code` in string colour.
- `portfolio/about.ts` — TS with import/export/const keywords coloured, strings highlighted.
- `portfolio/skills.ts` — record literal with grouped categories.
- `portfolio/projects.ts` — array of objects.
- `portfolio/contact.ts` — `mailto:` template string highlighted.
- `tests/*.spec.ts` — Playwright spec files with `test.describe` / `expect(...)` chains.
- `case-studies/*.md` — Markdown headings, bullet lists, **bold** spans rendered.
- `.env` — `KEY=value` highlighting with the `# comment` line in muted colour.

- [ ] **Step 3: Run typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: zero errors.

- [ ] **Step 4: Stop the dev server (`Ctrl+C`)**

---

### Task 45: Phase 2 commit

**Files:**
- All Phase 2 file edits

- [ ] **Step 1: Stage everything**

```bash
git add .
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: populate IDE virtual filesystem with portfolio content"
```

---

## Phase 3 — Bottom panel: terminal + test runner + splitter

### Task 46: Create `data/commands.ts` (8-command map)

**Files:**
- Create: `data/commands.ts`

**Why:** Each command is a pure function `(args, ctx) => TerminalLine[]`. Side effects (`window.open`, clipboard, `dispatch`) happen inside `run()`; the returned lines are what the terminal appends. This keeps the Terminal component dumb — it only renders lines.

- [ ] **Step 1: Write `data/commands.ts`**

```ts
import type { Dispatch } from "react";
import type {
  FileNode,
  IDEAction,
  TerminalLine,
} from "@/app/ide/types";
import { allFiles } from "@/data/files";
import { contactLinks, cvRequestHref } from "@/data/contact";
import { projects } from "@/data/projects";

export type CommandCtx = {
  files: FileNode[];
  dispatch: Dispatch<IDEAction>;
};

export type Command = {
  name: string;
  description: string;
  run: (args: string[], ctx: CommandCtx) => TerminalLine[];
};

const out = (text: string): TerminalLine => ({ kind: "output", text });
const err = (text: string): TerminalLine => ({ kind: "error", text });
const sys = (text: string, href?: string): TerminalLine =>
  href ? { kind: "system", text, href } : { kind: "system", text };

function resolveFilePath(arg: string): string | null {
  if (allFiles.some((f) => f.path === arg)) return arg;
  for (const prefix of ["", "portfolio/", "tests/", "case-studies/"]) {
    const p = prefix + arg;
    if (allFiles.some((f) => f.path === p)) return p;
  }
  // Fuzzy: every char of the query appears in the path in order.
  const q = arg.toLowerCase();
  const candidates = allFiles.filter((f) => {
    let i = 0;
    const lower = f.path.toLowerCase();
    for (const ch of lower) {
      if (ch === q[i]) i++;
      if (i === q.length) return true;
    }
    return false;
  });
  if (candidates.length === 1) return candidates[0]!.path;
  return null;
}

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "list commands",
    run: () => {
      const rows: Array<[string, string]> = [
        ["help", "list commands"],
        ["cv", "open CV request mailto"],
        ["contact", "print email / linkedin / location / phone"],
        ["projects", "list projects"],
        ["skills", "list skills by category"],
        ["open <file>", "open a file in the editor"],
        ["clear", "clear the terminal"],
        ["whoami", "short bio line"],
      ];
      return [
        out("Available commands:"),
        ...rows.map(([c, d]) => out(`  ${c.padEnd(14)} ${d}`)),
      ];
    },
  },
  cv: {
    name: "cv",
    description: "open CV request mailto",
    run: () => {
      if (typeof window !== "undefined") {
        window.open(cvRequestHref, "_blank");
      }
      return [
        out("Opening CV request email…"),
        sys("✉  I reply within 24h."),
      ];
    },
  },
  contact: {
    name: "contact",
    description: "print contact details",
    run: () => {
      const lines: TerminalLine[] = [];
      for (const c of contactLinks) {
        lines.push(sys(`${c.label.padEnd(10)} ${c.value}`, c.href));
      }
      // Email copy side-effect.
      const email = contactLinks.find((c) => c.icon === "email");
      if (email && typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(email.value).catch(() => {
          /* permission denied — silent. */
        });
        lines.push(out(`✓ email copied: ${email.value}`));
      }
      return lines;
    },
  },
  projects: {
    name: "projects",
    description: "list public projects",
    run: () => {
      const lines: TerminalLine[] = [];
      for (const p of projects) {
        if (p.type === "demo-repo") {
          lines.push(out(`● ${p.title} — demo repo`));
          lines.push(out(`    ${p.tech.join(" · ")}`));
          lines.push(sys(`    ${p.githubUrl}`, p.githubUrl));
        } else {
          lines.push(out(`● ${p.title} — case study (${p.industry})`));
          lines.push(out(`    ${p.metrics.join(" · ")}`));
        }
        lines.push(out(""));
      }
      return lines;
    },
  },
  skills: {
    name: "skills",
    description: "list skills by category",
    run: () => [
      out("automation:"),
      out("  Playwright · TypeScript · Postman · Newman · GitHub Actions"),
      out("manual:"),
      out("  Test design · Exploratory · JIRA · TestRail · Xray · Bug triage"),
      out("tools:"),
      out("  Git · REST APIs · SQL · Chrome DevTools"),
    ],
  },
  open: {
    name: "open",
    description: "open a file in the editor",
    run: (args, ctx) => {
      const arg = args.join(" ").trim();
      if (!arg) return [err("open: missing file")];
      const path = resolveFilePath(arg);
      if (!path) return [err(`error: no such file: ${arg}`)];
      ctx.dispatch({ type: "OPEN_FILE", path });
      return [out(`opened ${path}`)];
    },
  },
  clear: {
    name: "clear",
    description: "clear the terminal",
    run: (_args, ctx) => {
      ctx.dispatch({ type: "TERMINAL_CLEAR" });
      return [];
    },
  },
  whoami: {
    name: "whoami",
    description: "short bio line",
    run: () => [out("jakubruniecki @ Warsaw · CET · open-to-work")],
  },
};

export function runCommand(raw: string, ctx: CommandCtx): TerminalLine[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const [name, ...rest] = trimmed.split(/\s+/);
  if (!name) return [];
  const cmd = commands[name];
  if (!cmd) return [err(`command not found: ${name}. Try 'help'.`)];
  return cmd.run(rest, ctx);
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 47: Create `components/ide/BottomPanel/PanelTabs.tsx`

**Files:**
- Create: `components/ide/BottomPanel/PanelTabs.tsx`

- [ ] **Step 1: Write `components/ide/BottomPanel/PanelTabs.tsx`**

```tsx
"use client";

const TABS: ReadonlyArray<{ label: string; meta?: string; active?: boolean }> = [
  { label: "PROBLEMS", meta: "0" },
  { label: "OUTPUT" },
  { label: "TERMINAL", active: true },
  { label: "TEST RESULTS", meta: "·" },
];

export function PanelTabs() {
  return (
    <div className="flex h-8 items-center justify-between border-b border-border-subtle bg-bg-surface px-3 font-mono text-[11px] uppercase tracking-wide text-fg-muted">
      <div className="flex items-center gap-4">
        {TABS.map((t) => (
          <span
            key={t.label}
            className={t.active ? "flex items-center gap-1 text-fg" : ""}
          >
            {t.active ? <span className="text-accent-green">●</span> : null}
            {t.label}
            {t.meta ? <span className="ml-1 text-fg-subtle">({t.meta})</span> : null}
          </span>
        ))}
      </div>
      <div className="font-mono text-[11px] normal-case text-fg-muted">
        zsh — portfolio | node v20.11.0
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 48: Create `components/ide/BottomPanel/Terminal.tsx`

**Files:**
- Create: `components/ide/BottomPanel/Terminal.tsx`

**Why:** History is a `useRef` (mutation doesn't trigger re-renders we don't need). Auto-scroll uses a second ref pointing at the output container and `scrollTop = scrollHeight` after every append. `useEffect([state.terminalLines])` flushes the scroll after React commits the new line.

- [ ] **Step 1: Write `components/ide/BottomPanel/Terminal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { fileTree } from "@/data/files";
import { runCommand } from "@/data/commands";

export function Terminal() {
  const { state, dispatch } = useIDE();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [state.terminalLines]);

  function submit(raw: string) {
    const value = raw.trim();
    dispatch({ type: "TERMINAL_APPEND", line: { kind: "input", text: value } });
    if (!value) return;
    historyRef.current = [...historyRef.current, value];
    setHistoryIdx(-1);
    const lines = runCommand(value, { files: fileTree, dispatch });
    for (const line of lines) {
      dispatch({ type: "TERMINAL_APPEND", line });
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(draft);
      setDraft("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const hist = historyRef.current;
      if (!hist.length) return;
      const nextIdx = historyIdx < 0 ? hist.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setDraft(hist[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const hist = historyRef.current;
      if (historyIdx < 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= hist.length) {
        setHistoryIdx(-1);
        setDraft("");
      } else {
        setHistoryIdx(nextIdx);
        setDraft(hist[nextIdx] ?? "");
      }
    }
  }

  return (
    <div
      className="flex h-full flex-1 flex-col bg-bg-base font-mono text-[12px] leading-[1.6]"
      onClick={() => inputRef.current?.focus()}
      role="region"
      aria-label="Terminal"
    >
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto px-3 py-2"
      >
        {state.terminalLines.map((line, i) => {
          if (line.kind === "input") {
            return (
              <div key={i} className="flex gap-2">
                <span className="text-accent-green">jakub@portfolio</span>
                <span className="text-accent-blue">~/portfolio</span>
                <span className="text-accent-green">❯</span>
                <span className="text-fg">{line.text}</span>
              </div>
            );
          }
          if (line.kind === "error") {
            return (
              <div key={i} className="text-accent-red">
                {line.text || " "}
              </div>
            );
          }
          if (line.kind === "system") {
            if (line.href) {
              return (
                <div key={i}>
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    {line.text}
                  </a>
                </div>
              );
            }
            return (
              <div key={i} className="text-accent-blue">
                {line.text || " "}
              </div>
            );
          }
          return (
            <div key={i} className="text-fg-muted">
              {line.text || " "}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border-subtle px-3 py-1.5">
        <span className="text-accent-green">jakub@portfolio</span>
        <span className="text-accent-blue">~/portfolio</span>
        <span className="text-accent-green">❯</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle"
          placeholder="type 'help'"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 49: Create `components/ide/BottomPanel/TestRunner.tsx`

**Files:**
- Create: `components/ide/BottomPanel/TestRunner.tsx`

**Why:** The auto-run effect schedules `setTimeout`s sequentially. We track the running state and an abort flag inside `useRef`s — refs let the abort signal cross the setTimeout boundary without re-rendering. Reduced-motion short-circuits to "everything pass" by dispatching `TEST_UPDATE` for every case at once.

- [ ] **Step 1: Write `components/ide/BottomPanel/TestRunner.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { PlayIcon, StopIcon } from "@/components/ui/Icon";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TestRunner() {
  const { state, dispatch } = useIDE();
  const [running, setRunning] = useState(false);
  const abortRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const startedRef = useRef(false);

  function clearTimeouts() {
    for (const id of timeoutsRef.current) clearTimeout(id);
    timeoutsRef.current = [];
  }

  function passAllImmediately() {
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((_c, cIdx) => {
        dispatch({ type: "TEST_UPDATE", suiteIdx: sIdx, caseIdx: cIdx, status: "pass" });
      });
    });
  }

  function runCycle() {
    dispatch({ type: "TEST_RESET" });
    abortRef.current = false;
    setRunning(true);

    if (prefersReducedMotion()) {
      passAllImmediately();
      setRunning(false);
      return;
    }

    let cumulative = 600;
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((c, cIdx) => {
        const startId = window.setTimeout(() => {
          if (abortRef.current) return;
          dispatch({
            type: "TEST_UPDATE",
            suiteIdx: sIdx,
            caseIdx: cIdx,
            status: "running",
          });
        }, cumulative);
        const passId = window.setTimeout(() => {
          if (abortRef.current) return;
          dispatch({
            type: "TEST_UPDATE",
            suiteIdx: sIdx,
            caseIdx: cIdx,
            status: "pass",
          });
        }, cumulative + c.durMs * 12);
        timeoutsRef.current.push(startId, passId);
        cumulative += c.durMs * 12 + 80;
      });
    });

    const doneId = window.setTimeout(() => {
      setRunning(false);
    }, cumulative + 100);
    timeoutsRef.current.push(doneId);
  }

  function stopCycle() {
    abortRef.current = true;
    clearTimeouts();
    setRunning(false);
    // Any test currently in 'running' goes back to 'idle' so the UI is clean.
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((c, cIdx) => {
        if (c.status === "running") {
          dispatch({ type: "TEST_UPDATE", suiteIdx: sIdx, caseIdx: cIdx, status: "idle" });
        }
      });
    });
  }

  // Boot auto-run, once.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const bootId = window.setTimeout(() => runCycle(), 800);
    timeoutsRef.current.push(bootId);
    return () => clearTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = state.testSuites.flatMap((s) => s.cases);
  const passed = totals.filter((c) => c.status === "pass").length;
  const total = totals.length;
  const summary = running
    ? `Running ${passed}/${total}`
    : passed === total
      ? `${passed} passed`
      : passed > 0
        ? `${passed}/${total} ready`
        : "ready";

  function scrollToCase(file: string, caseName: string) {
    dispatch({ type: "OPEN_FILE", path: file });
    // Wait one tick for the editor to render the new file.
    window.setTimeout(() => {
      const root = document.querySelector('[aria-label="Editor"]');
      if (!root) return;
      const lineEls = root.querySelectorAll("pre code > div");
      for (const el of Array.from(lineEls)) {
        if (el.textContent?.includes(caseName)) {
          (el as HTMLElement).scrollIntoView({ block: "center" });
          (el as HTMLElement).style.animation = "tick-flash 0.6s ease-out";
          window.setTimeout(() => {
            (el as HTMLElement).style.animation = "";
          }, 700);
          break;
        }
      }
    }, 50);
  }

  return (
    <div
      className="flex h-full w-1/2 flex-col border-l border-border bg-bg-base"
      role="region"
      aria-label="Test runner"
    >
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runCycle}
            disabled={running}
            className="flex items-center gap-1 rounded border border-accent-green/40 bg-accent-green/10 px-2 py-0.5 font-mono text-[11px] text-accent-green hover:bg-accent-green/20 disabled:opacity-50"
          >
            <PlayIcon className="h-3 w-3" width={12} height={12} />
            RUN ALL
          </button>
          <button
            type="button"
            onClick={stopCycle}
            disabled={!running}
            className="flex items-center gap-1 rounded border border-border bg-bg-subtle px-2 py-0.5 font-mono text-[11px] text-fg-muted hover:text-fg disabled:opacity-40"
          >
            <StopIcon className="h-3 w-3" width={12} height={12} />
            STOP
          </button>
        </div>
        <div className="font-mono text-[11px] text-fg-muted">{summary}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[12px]">
        {state.testSuites.map((suite, sIdx) => {
          const allPass = suite.cases.every((c) => c.status === "pass");
          return (
            <div key={suite.name} className="mb-3">
              <div className="flex items-center gap-2 text-fg">
                <span className={allPass ? "text-accent-green" : "text-fg-subtle"}>
                  {allPass ? "✓" : "○"}
                </span>
                <span>{suite.name}</span>
                <span className="text-fg-subtle">— {suite.file}</span>
              </div>
              <ul className="ml-5">
                {suite.cases.map((c, cIdx) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span
                      className={
                        c.status === "pass"
                          ? "text-accent-green"
                          : c.status === "fail"
                            ? "text-accent-red"
                            : c.status === "running"
                              ? "inline-block text-accent-yellow"
                              : "text-fg-subtle"
                      }
                      style={
                        c.status === "running"
                          ? { animation: "spin 0.8s linear infinite", display: "inline-block" }
                          : undefined
                      }
                    >
                      {c.status === "pass"
                        ? "✓"
                        : c.status === "fail"
                          ? "✗"
                          : c.status === "running"
                            ? "⟳"
                            : "○"}
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToCase(suite.file, c.name)}
                      className="flex-1 text-left text-fg-muted hover:text-fg"
                    >
                      {c.name}
                    </button>
                    <span className="text-fg-subtle">({c.durMs}ms)</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 50: Rewrite `Splitter.tsx` with real drag handlers

**Files:**
- Modify: `components/ide/EditorArea/Splitter.tsx`

**Why:** Drag is global — `mousemove` must work even when the cursor strays off the splitter. So `mousedown` attaches `mousemove` + `mouseup` to `document`, and `mouseup` removes them. Storing handlers in `useEffect`-managed refs avoids leaks on unmount.

- [ ] **Step 1: Replace `components/ide/EditorArea/Splitter.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useIDE } from "@/app/ide/IDEContext";

export function Splitter() {
  const { dispatch } = useIDE();
  const draggingRef = useRef(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const area = document.querySelector('[aria-label="Editor"]');
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const distFromBottom = rect.bottom - e.clientY;
      // Clamp to spec §6 dimensions.
      const next = Math.max(120, Math.min(600, distFromBottom));
      dispatch({ type: "SET_PANEL_HEIGHT", px: next });
    }
    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dispatch]);

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize bottom panel"
      onMouseDown={(e) => {
        e.preventDefault();
        draggingRef.current = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
      }}
      className="h-[var(--ide-splitter-h)] cursor-row-resize bg-border hover:bg-accent-blue-dim active:bg-accent-blue"
    />
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 51: Replace the BottomPanel placeholder with real content

**Files:**
- Modify: `components/ide/BottomPanel/BottomPanel.tsx`

- [ ] **Step 1: Replace `components/ide/BottomPanel/BottomPanel.tsx`**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 52: Phase 3 visual + build verification

**Files:** (none — visual check)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000`.

- [ ] **Step 2: Verify the terminal**

- Welcome lines appear (`portfolio · zsh` + Welcome message).
- Type `help` + Enter → list of 8 commands appears.
- Type `whoami` → `jakubruniecki @ Warsaw · CET · open-to-work`.
- Type `skills` → grouped categories.
- Type `projects` → list with project metadata.
- Type `contact` → email / linkedin / location / phone; email is auto-copied (clipboard toast).
- Type `clear` → terminal empties.
- Type `nonsense` → `command not found: nonsense. Try 'help'.`
- Type `open about.ts` → editor switches to `portfolio/about.ts`.
- Type `open foo` → `error: no such file: foo`.
- Press ↑ → last command refilled in the input. Press ↓ → cleared.

- [ ] **Step 3: Verify the test runner**

- On load, ~800ms later the first test goes `running` (spinning `⟳`), then `pass` (green ✓). Each test advances in turn.
- After the cycle, summary shows `10 passed` (3+3+3+1).
- Click `RUN ALL` → resets to `○`, restarts the cycle.
- Click `STOP` mid-cycle → cycle halts, completed tests remain ✓, running test reverts to `○`.
- Click a test name (e.g. `cuts regression from 3d to 4h`) → editor opens `tests/candidate.spec.ts`, scrolls to that line, and the line briefly flashes green.

- [ ] **Step 4: Verify the splitter**

- Hover the bar between editor body and bottom panel → cursor becomes `row-resize`, bar highlights.
- Drag up → panel grows; drag down → panel shrinks. Clamped between 120px and 600px.

- [ ] **Step 5: Run typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: zero errors.

- [ ] **Step 6: Stop the dev server (`Ctrl+C`)**

---

### Task 53: Phase 3 commit

**Files:**
- All Phase 3 file edits

- [ ] **Step 1: Stage everything**

```bash
git add .
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: add terminal, test runner, and resizable splitter to IDE"
```

---

## Phase 4 — Palette + activity bar + live status + boot typewriter + polish

### Task 54: Create the fuzzy matcher in `components/ui/fuzzyMatch.ts`

**Files:**
- Create: `components/ui/fuzzyMatch.ts`

**Why:** Subsequence match (every query char must appear in the label in order) is the simplest useful matcher. Consecutive matches boost the score so `aboTs` ranks `about.ts` above `availability.spec.ts`. Pure function, no deps, ~40 lines.

- [ ] **Step 1: Write `components/ui/fuzzyMatch.ts`**

```ts
export type FuzzyResult<T> = {
  item: T;
  score: number;
};

export function fuzzyMatch<T>(
  items: ReadonlyArray<T>,
  query: string,
  getLabel: (item: T) => string,
): FuzzyResult<T>[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.map((item) => ({ item, score: 0 }));

  const out: FuzzyResult<T>[] = [];
  for (const item of items) {
    const label = getLabel(item).toLowerCase();
    let qi = 0;
    let score = 0;
    let consecutive = 0;
    for (let li = 0; li < label.length; li++) {
      if (label[li] === q[qi]) {
        score += 1 + consecutive * 2;
        consecutive += 1;
        qi += 1;
        if (qi === q.length) break;
      } else {
        consecutive = 0;
      }
    }
    if (qi === q.length) out.push({ item, score });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 55: Create `components/ide/CommandPalette.tsx`

**Files:**
- Create: `components/ide/CommandPalette.tsx`

**Why:** Modal overlay with `fixed inset-0`. The global `Cmd/Ctrl+K` listener is attached in `app/ide/IDE.tsx` (Task 58). This component handles only the visible UI + keyboard nav within the modal (Up/Down/Enter/Esc).

- [ ] **Step 1: Write `components/ide/CommandPalette.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { allFiles } from "@/data/files";
import { contactLinks, cvRequestHref } from "@/data/contact";
import { fuzzyMatch } from "@/components/ui/fuzzyMatch";

type PaletteItem = {
  label: string;
  kind: "FILE" | "ACTION";
  action: () => void;
};

const GITHUB_URL = "https://github.com/jakubruniecki";

export function CommandPalette() {
  const { state, dispatch } = useIDE();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  const items = useMemo<PaletteItem[]>(() => {
    const fileItems: PaletteItem[] = allFiles.map((f) => ({
      label: f.path,
      kind: "FILE",
      action: () => dispatch({ type: "OPEN_FILE", path: f.path }),
    }));
    const email = contactLinks.find((c) => c.icon === "email");
    const linkedin = contactLinks.find((c) => c.icon === "linkedin");
    const actionItems: PaletteItem[] = [
      {
        label: "Request CV",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") window.open(cvRequestHref, "_blank");
        },
      },
      {
        label: "Copy email",
        kind: "ACTION",
        action: () => {
          if (email && typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(email.value).catch(() => {});
            dispatch({
              type: "TERMINAL_APPEND",
              line: { kind: "output", text: `✓ email copied: ${email.value}` },
            });
          }
        },
      },
      {
        label: "Open GitHub",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") window.open(GITHUB_URL, "_blank");
        },
      },
      {
        label: "Open LinkedIn",
        kind: "ACTION",
        action: () => {
          if (linkedin && typeof window !== "undefined")
            window.open(linkedin.href, "_blank");
        },
      },
      {
        label: "Run all tests",
        kind: "ACTION",
        action: () => {
          // Fire a custom event the TestRunner listens for (see Task 56).
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("ide:run-all-tests"));
          }
        },
      },
      {
        label: "Toggle terminal focus",
        kind: "ACTION",
        action: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("ide:focus-terminal"));
          }
        },
      },
    ];
    return [...fileItems, ...actionItems];
  }, [dispatch]);

  const matched = useMemo(
    () => fuzzyMatch(items, query, (i) => i.label).slice(0, 8),
    [items, query],
  );

  useEffect(() => {
    if (!state.isPaletteOpen) return;
    setQuery("");
    setSelectedIdx(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [state.isPaletteOpen]);

  if (!state.isPaletteOpen) return null;

  function close() {
    dispatch({ type: "TOGGLE_PALETTE", open: false });
  }

  function execute(idx: number) {
    const entry = matched[idx];
    if (!entry) return;
    close();
    entry.item.action();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(matched.length - 1, i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(0, i - 1));
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      execute(selectedIdx);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-[min(640px,90vw)] overflow-hidden rounded-md border border-border bg-bg-surface shadow-2xl">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIdx(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a file name or command…  (⌘K / Ctrl+K to toggle)"
          aria-label="Palette search"
          className="w-full bg-transparent px-4 py-3 font-mono text-sm text-fg outline-none placeholder:text-fg-subtle"
        />
        <ul className="max-h-72 overflow-y-auto border-t border-border">
          {matched.length === 0 ? (
            <li className="px-4 py-3 font-mono text-xs text-fg-muted">
              No matches.
            </li>
          ) : (
            matched.map((m, idx) => (
              <li key={`${m.item.kind}:${m.item.label}`}>
                <button
                  type="button"
                  onMouseEnter={() => setSelectedIdx(idx)}
                  onClick={() => execute(idx)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-1.5 text-left font-mono text-[13px] ${
                    idx === selectedIdx ? "bg-bg-elevated text-fg" : "text-fg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-fg-subtle">›</span>
                    {m.item.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
                    {m.item.kind}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 56: Wire palette events into `Terminal.tsx` and `TestRunner.tsx`

**Files:**
- Modify: `components/ide/BottomPanel/Terminal.tsx` (listen for `ide:focus-terminal`)
- Modify: `components/ide/BottomPanel/TestRunner.tsx` (listen for `ide:run-all-tests`)

**Why:** Palette actions need to reach the Terminal input + TestRunner cycle. The cleanest cross-component channel without lifting more state is a window-level CustomEvent. Each listener cleans itself up in `useEffect` return.

- [ ] **Step 1: Add the listener in `Terminal.tsx`**

Open `components/ide/BottomPanel/Terminal.tsx` and add this `useEffect` right after the existing `useEffect` that handles auto-scroll:

```tsx
useEffect(() => {
  function onFocus() {
    inputRef.current?.focus();
  }
  window.addEventListener("ide:focus-terminal", onFocus);
  return () => window.removeEventListener("ide:focus-terminal", onFocus);
}, []);
```

- [ ] **Step 2: Expose `runCycle` via event in `TestRunner.tsx`**

Open `components/ide/BottomPanel/TestRunner.tsx` and add this `useEffect` right after the boot auto-run effect:

```tsx
useEffect(() => {
  function onRun() {
    runCycle();
  }
  window.addEventListener("ide:run-all-tests", onRun);
  return () => window.removeEventListener("ide:run-all-tests", onRun);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 57: Wire ActivityBar handlers (search → palette, run → tests)

**Files:**
- Modify: `components/ide/ActivityBar.tsx`

- [ ] **Step 1: Replace the `onClick` body in `components/ide/ActivityBar.tsx`**

Find the existing button `onClick` handler and replace it with:

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 58: Add global `Cmd/Ctrl+K` listener + render the palette in `app/ide/IDE.tsx`

**Files:**
- Modify: `app/ide/IDE.tsx`

**Why:** The keyboard listener has to live above the palette so the shortcut works even when the palette is closed. A small `'use client'` wrapper hook keeps `IDE.tsx` declarative.

- [ ] **Step 1: Replace `app/ide/IDE.tsx`**

```tsx
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
    console.log("%cJB — Senior QA Engineer", green);
    console.log(
      "%cIf you're reading this, you know how to read.\nemail: jakubruniecki@gmail.com",
      muted,
    );
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
      <CommandPalette />
    </IDEProvider>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 59: Make the StatusBar clock live (Warsaw TZ, hydration-safe)

**Files:**
- Modify: `components/ide/StatusBar.tsx`

**Why:** `new Date()` on server vs client differs by milliseconds — rendering the clock during SSR causes a hydration mismatch. We render `--:--:-- CET` on both sides and replace via `useEffect` only on the client. `Intl.DateTimeFormat({ timeZone: 'Europe/Warsaw' })` is the cleanest way to format Warsaw time without external libs.

- [ ] **Step 1: Replace `components/ide/StatusBar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { BranchIcon, BellIcon, ErrorDot, WarningDot } from "@/components/ui/Icon";

const EMAIL = "jakubruniecki@gmail.com";
const CV_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent("CV Request")}`;

function languageLabel(path: string | null): string {
  if (!path) return "Plain";
  const f = getFileByPath(path);
  if (!f) return "Plain";
  if (f.language === "ts") return "TypeScript";
  if (f.language === "md") return "Markdown";
  return "Plain";
}

function useWarsawClock(): string {
  const [time, setTime] = useState<string>("--:--:-- CET");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Warsaw",
    });
    function tick() {
      setTime(`${fmt.format(new Date())} CET`);
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function StatusBar() {
  const { state } = useIDE();
  const clock = useWarsawClock();
  return (
    <footer
      role="contentinfo"
      aria-label="Status bar"
      className="flex h-[var(--ide-statusbar-h)] items-center justify-between border-t border-border bg-accent-blue-dim/30 px-3 font-mono text-[11px] text-fg"
    >
      <div className="flex items-center gap-4">
        <a
          href={CV_HREF}
          className="rounded px-1 hover:bg-bg-elevated"
        >
          CV on request
        </a>
        <span className="flex items-center gap-1">
          <BranchIcon className="h-3 w-3" width={12} height={12} />
          main
        </span>
        <span className="flex items-center gap-1">
          <span
            className="h-2 w-2 rounded-full bg-accent-green"
            style={{ animation: "live-pulse 1.6s ease-in-out infinite" }}
            aria-hidden
          />
          build passing
        </span>
        <span className="flex items-center gap-1">
          <ErrorDot className="h-3 w-3" width={12} height={12} />0
        </span>
        <span className="flex items-center gap-1">
          <WarningDot className="h-3 w-3" width={12} height={12} />0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span suppressHydrationWarning>{clock}</span>
        <span>
          Ln {state.cursorLine}, Col {state.cursorCol}
        </span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>{languageLabel(state.activeTabPath)}</span>
        <BellIcon className="h-3 w-3" width={12} height={12} />
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 60: Add the boot typewriter to `EditorBody.tsx`

**Files:**
- Modify: `components/ide/EditorArea/EditorBody.tsx`

**Why:** The typewriter is per-file: when the active tab changes, the new content types out from empty. Reduced motion skips the animation (renders the full content immediately). A `useRef` holds the timer id so unmounts cancel cleanly. We only animate the *first* time a file is opened in this session — re-opening shows it instantly.

- [ ] **Step 1: Replace `components/ide/EditorArea/EditorBody.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { getFileByPath } from "@/data/files";
import { SyntaxHighlight } from "@/components/ui/SyntaxHighlight";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const TYPE_DELAY_MS = 700;
const CHARS_PER_TICK = 12;
const TICK_MS = 16;

export function EditorBody() {
  const { state } = useIDE();
  const file = state.activeTabPath ? getFileByPath(state.activeTabPath) : null;
  const [typed, setTyped] = useState<string>("");
  const typedSetRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!file) return;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typedSetRef.current.has(file.path) || prefersReducedMotion()) {
      setTyped(file.content);
      typedSetRef.current.add(file.path);
      return;
    }
    setTyped("");
    const startId = window.setTimeout(() => {
      let i = 0;
      timerRef.current = window.setInterval(() => {
        i += CHARS_PER_TICK;
        if (i >= file.content.length) {
          setTyped(file.content);
          typedSetRef.current.add(file.path);
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
        } else {
          setTyped(file.content.slice(0, i));
        }
      }, TICK_MS);
    }, TYPE_DELAY_MS);
    return () => {
      window.clearTimeout(startId);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [file]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-fg-muted">
        No file open. Use the explorer or run <code className="mx-1">open &lt;file&gt;</code> in the terminal.
      </div>
    );
  }
  const lineCount = Math.max(1, typed.split("\n").length);
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
        <SyntaxHighlight content={typed} language={file.language} />
        {typed.length < file.content.length ? (
          <span
            aria-hidden
            className="ml-0.5 inline-block w-2 bg-fg"
            style={{ animation: "caret-blink 1s steps(1) infinite", height: "1em", verticalAlign: "-2px" }}
          />
        ) : null}
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: zero errors.

---

### Task 61: Phase 4 visual + build verification

**Files:** (none — visual check)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000`.

- [ ] **Step 2: Verify the palette**

- Press `Cmd+K` (mac) or `Ctrl+K` → palette overlay opens with the input focused.
- Type `about` → `portfolio/about.ts` ranks first; Enter opens it.
- Press `Esc` → palette closes.
- Click the backdrop → palette closes.
- Type `cv` → `Request CV` near the top; Enter opens the mailto.
- Type `email` → `Copy email` near the top; Enter copies it; terminal shows `✓ email copied: …`.

- [ ] **Step 3: Verify the activity bar handlers**

- Click the Search icon → palette opens.
- Click the Run icon → test runner restarts the cycle.
- Click other icons → only the active highlight moves (cosmetic toggle).

- [ ] **Step 4: Verify the status bar**

- Clock in the bottom-right updates every second, formatted as `HH:mm:ss CET`.
- Click `CV on request` → mailto draft opens.
- The build-passing green dot pulses smoothly.
- Open `README.md` → language reads `Markdown`. Open `portfolio/about.ts` → reads `TypeScript`. Open `.env` → reads `Plain`.

- [ ] **Step 5: Verify the boot typewriter**

- Reload the page. After ~700ms, `README.md` content types out left-to-right, with a blinking caret at the end.
- Click another file you haven't opened before → that file types out too. Click back to `README.md` → it renders instantly (already typed once this session).

- [ ] **Step 6: Verify console egg**

Open DevTools console. Expected: two lines:
```
JB — Senior QA Engineer        (green, mono)
If you're reading this, you know how to read.
email: jakubruniecki@gmail.com  (muted, mono)
```

- [ ] **Step 7: Verify reduced-motion fast path**

In DevTools → Rendering → emulate `prefers-reduced-motion: reduce`. Reload. Expected:
- Typewriter is skipped; file contents render instantly.
- Test runner skips the animation and shows all tests as ✓.
- Build-passing dot no longer pulses.

- [ ] **Step 8: Verify the skip link**

Tab into the page from the URL bar. The first focus stop should be `Skip to readable content`. Press Enter → page jumps to the SEO block.

- [ ] **Step 9: Run typecheck + lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: zero errors.

- [ ] **Step 10: Stop the dev server (`Ctrl+C`)**

---

### Task 62: Phase 4 commit

**Files:**
- All Phase 4 file edits

- [ ] **Step 1: Stage everything**

```bash
git add .
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: complete IDE polish — command palette, live status, typewriter, easter egg"
```

- [ ] **Step 3: Verify the tree is clean**

Run: `git status`
Expected: `nothing to commit, working tree clean`.

---

## Self-review notes

The following self-review was performed against spec §2 (Functional requirements) sub-section by sub-section. Every requirement maps to at least one task above:

- **Title bar** — Task 12 (`TitleBar.tsx`).
- **Activity bar (cosmetic toggle)** — Task 13. **Activity bar (real handlers)** — Task 57.
- **Sidebar (head + Open Editors + tree + timeline)** — Tasks 15–19.
- **Editor tab bar with DnD reorder** — Task 20.
- **Breadcrumb** — Task 21.
- **Editor body line numbers + syntax** — Task 22 (Phase 1). **Boot typewriter** — Task 60.
- **Splitter draggable** — Task 50.
- **Bottom panel tabs** — Tasks 24 (placeholder) + 47 (real).
- **Terminal output, prompt, welcome, all 8 commands, history, focus-on-click** — Tasks 46, 48, 56.
- **Test runner toolbar, suite list, auto-run, RUN ALL / STOP, reduced motion, click-to-scroll-flash** — Task 49.
- **Status bar static** — Task 14. **Live clock + language + mailto** — Task 59.
- **Command palette (Cmd/Ctrl+K + Search icon + 6 actions + fuzzy + kb nav)** — Tasks 54, 55, 57, 58.
- **Mobile fallback** — Task 26.
- **SEO content** — Task 27.
- **Console easter egg** — Task 58 (`<ConsoleEgg />`).

Type-name consistency was cross-checked: `openTabs`, `activeTabPath`, `treeOpenFolders`, `panelHeightPx`, `terminalLines`, `testSuites`, `isPaletteOpen`, `activeActivityAction`, `cursorLine`, `cursorCol` are used identically in `types.ts`, `IDEContext.tsx`, and every consumer.

Phase boundaries are runnable in isolation: Phase 1 renders with stub content + placeholder panel; Phase 2 only touches `data/files/*`; Phase 3 swaps the panel placeholder for real Terminal + TestRunner + Splitter; Phase 4 layers palette + live status + typewriter + console egg on top.

No ambiguities in the spec were flagged during plan authoring — the spec §13 already states "None at spec time".
