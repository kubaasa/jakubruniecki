# Bottom Dock Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bottom-left sidebar `Timeline` (chronological list of 4 milestones) with a two-section dock — `IMPACT` (6 scannable lines, left col `accent-blue`) on top, `NOW` (3 lines: building / learning / open to) on bottom — separated by a divider.

**Architecture:** Single presentational component rename (`Timeline.tsx` → `BottomDock.tsx`). Content lives as two `const` arrays inside the component file (no data layer plumbing — easier to edit, no over-engineering). The existing `SidebarSplitter` and the `sidebarTimelineHeightPx` state field are reused as-is; only the default value bumps from 130px to 220px so the new content paints without scrolling on first load. One import site (`Sidebar.tsx`) and one cosmetic `aria-label` (`SidebarSplitter.tsx`) update along for the ride.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript. No new dependencies. Package manager: **npm** (project has `package-lock.json`).

**Spec:** `docs/superpowers/specs/2026-05-16-bottom-dock-redesign.md`

**Tests:** This plan adds **no automated tests** — deliberate decision documented in the spec (§8). The component is static presentational data, no Playwright spec files exist in the repo today, and a "renders 6 lines" test would be theatre. Verification is type-check + lint + manual browser smoke.

**Commit cadence:** One commit per phase (per Kuba's preference). Phase 1 is the only phase, so this plan ships in one commit.

**Stop-before-commit:** After type-check + lint pass, the plan **stops** and waits for Kuba's visual verification in the browser before committing. Do not auto-commit.

---

## File Structure

| Path | Action | Responsibility |
| --- | --- | --- |
| `components/ide/Sidebar/Timeline.tsx` | **Delete** | Old chronological list — replaced. |
| `components/ide/Sidebar/BottomDock.tsx` | **Create** | New component: renders `IMPACT` + divider + `NOW` inside the resizable dock container. |
| `components/ide/Sidebar/Sidebar.tsx` | **Modify** | Update import + JSX tag from `Timeline` to `BottomDock`. |
| `app/ide/IDEContext.tsx` | **Modify** | Bump `initialState.sidebarTimelineHeightPx` from `130` → `220`. Clamp range (60..320) and state field name stay. |
| `components/ide/Sidebar/SidebarSplitter.tsx` | **Modify** | Cosmetic: `aria-label="Resize timeline"` → `aria-label="Resize bottom dock"`. |

Files **not** touched (explicit):
- `app/ide/types.ts` — `sidebarTimelineHeightPx` field name unchanged, no type churn.
- Data files in `data/` — content is inline in `BottomDock.tsx`, not externalized.

---

## Phase 1 — Replace Timeline with BottomDock

### Task 1.1: Create `BottomDock.tsx`

**Files:**
- Create: `components/ide/Sidebar/BottomDock.tsx`

- [ ] **Step 1: Write the new component**

Create `components/ide/Sidebar/BottomDock.tsx` with this exact content:

```tsx
"use client";

import { useIDE } from "@/app/ide/IDEContext";

type ImpactRow = { metric: string; label: string };
type NowRow = { kind: string; value: string };

const IMPACT: ReadonlyArray<ImpactRow> = [
  { metric: "0 → 1", label: "built E2E framework from scratch" },
  { metric: "2", label: "enterprise clients · Polsat · Plus" },
  { metric: "senior", label: "manual · mid automation" },
  { metric: "5y", label: "in QA · 3.5 manual / 1.5 auto" },
  { metric: "ISTQB", label: "Foundation Level certified" },
  { metric: "AI-fwd", label: "Cursor · Claude Code · PW MCP/CLI" },
];

const NOW: ReadonlyArray<NowRow> = [
  { kind: "building", value: "AI-augmented E2E suite · Asseco" },
  { kind: "learning", value: "RAG · Obsidian · OpenClaw · Claude OS" },
  { kind: "open to", value: "remote" },
];

export function BottomDock() {
  const { state } = useIDE();
  return (
    <section
      aria-label="Bottom dock"
      style={{ height: state.sidebarTimelineHeightPx }}
      className="flex flex-shrink-0 flex-col overflow-hidden border-t border-border-subtle px-3 py-2"
    >
      <section aria-labelledby="dock-impact-label">
        <div
          id="dock-impact-label"
          className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted"
        >
          Impact
        </div>
        <ul className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-[11px] leading-tight tabular-nums">
          {IMPACT.map(({ metric, label }) => (
            <li key={metric} className="contents">
              <span className="text-accent-blue">{metric}</span>
              <span className="text-fg-muted">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-2 border-t border-border-subtle" />

      <section aria-labelledby="dock-now-label">
        <div
          id="dock-now-label"
          className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted"
        >
          Now
        </div>
        <ul className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[11px] leading-tight">
          {NOW.map(({ kind, value }) => (
            <li key={kind} className="contents">
              <span className="text-accent-blue" aria-hidden>
                ▸
              </span>
              <span className="text-fg-muted">{kind}</span>
              <span className="text-fg">{value}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
```

Key notes for the implementer:
- `className="contents"` on `<li>` is intentional — it lets the grid lay out the `<span>` cells directly, so each row's columns align across rows. Without `contents`, each `<li>` would be one grid cell containing all three spans.
- `tabular-nums` on the IMPACT `<ul>` makes `0 → 1`, `2`, `5y` align by digit width.
- The outer `<section aria-label="Bottom dock">` keeps the height binding and resize behavior identical to the old `Timeline` wrapper.
- Inner sections use `aria-labelledby` pointing at the visible caps header div for screen-reader naming.

### Task 1.2: Delete `Timeline.tsx`

**Files:**
- Delete: `components/ide/Sidebar/Timeline.tsx`

- [ ] **Step 1: Delete the file**

Run:
```bash
rm components/ide/Sidebar/Timeline.tsx
```

(On Windows PowerShell: `Remove-Item components\ide\Sidebar\Timeline.tsx`)

Expected: file removed, no other references will compile until Task 1.3 lands — that's why these tasks run sequentially before the type-check in 1.6.

### Task 1.3: Update `Sidebar.tsx` import and JSX

**Files:**
- Modify: `components/ide/Sidebar/Sidebar.tsx:7` (import) and `Sidebar.tsx:39` (JSX tag)

- [ ] **Step 1: Replace the import line**

In `components/ide/Sidebar/Sidebar.tsx`, change:

```tsx
import { Timeline } from "./Timeline";
```

to:

```tsx
import { BottomDock } from "./BottomDock";
```

- [ ] **Step 2: Replace the JSX tag**

In the same file, change:

```tsx
<Timeline />
```

to:

```tsx
<BottomDock />
```

No other lines in `Sidebar.tsx` change. The `<SidebarSplitter>` sibling stays exactly as-is.

### Task 1.4: Bump default dock height in `IDEContext.tsx`

**Files:**
- Modify: `app/ide/IDEContext.tsx:41`

- [ ] **Step 1: Change the default value**

In `app/ide/IDEContext.tsx`, change:

```tsx
  sidebarTimelineHeightPx: 130,
```

to:

```tsx
  sidebarTimelineHeightPx: 220,
```

Do **not** touch:
- The state field name (`sidebarTimelineHeightPx`) — rename is out-of-scope.
- The `clampTimeline` function (`60..320`) — current bounds are fine; 220 is well within, and user can still drag down to 60 or up to 320.
- The reducer action `SET_SIDEBAR_TIMELINE_HEIGHT` — keeps its name.

### Task 1.5: Update `SidebarSplitter` aria-label (cosmetic)

**Files:**
- Modify: `components/ide/Sidebar/SidebarSplitter.tsx:43`

- [ ] **Step 1: Update the aria-label string**

In `components/ide/Sidebar/SidebarSplitter.tsx`, change:

```tsx
      aria-label="Resize timeline"
```

to:

```tsx
      aria-label="Resize bottom dock"
```

This is the only line that changes in this file. All handlers and dispatch logic stay identical.

### Task 1.6: Type-check and lint

- [ ] **Step 1: Run type-check**

Run:
```bash
npm run typecheck
```

Expected: exit 0, no errors. If `tsc` complains about a missing `./Timeline` import, the deletion or the `Sidebar.tsx` edit didn't land — go back and fix.

- [ ] **Step 2: Run lint**

Run:
```bash
npm run lint
```

Expected: exit 0, no errors. Most likely failure mode: an unused-import warning if `Timeline` reference lingers somewhere; grep:

```bash
grep -rn "from.*Timeline\|Timeline />" components app
```

Should return zero matches (other than possibly the spec/plan markdown).

### Task 1.7: STOP — manual browser verification

- [ ] **Step 1: Start the dev server**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Verify visually against this checklist**

Confirm each item with Kuba:

1. Bottom-left dock shows **two** sections: `IMPACT` (top), `NOW` (bottom), with a thin horizontal divider between them.
2. IMPACT shows **6 rows**, in this order top-to-bottom:
   - `0 → 1     built E2E framework from scratch`
   - `2         enterprise clients · Polsat · Plus`
   - `senior    manual · mid automation`
   - `5y        in QA · 3.5 manual / 1.5 auto`
   - `ISTQB     Foundation Level certified`
   - `AI-fwd    Cursor · Claude Code · PW MCP/CLI`
3. Left column of IMPACT (`0 → 1`, `2`, `senior`, `5y`, `ISTQB`, `AI-fwd`) is **blue** (`accent-blue` = `#79c0ff`). Right column is muted gray.
4. Left column metrics are vertically aligned (tabular nums).
5. NOW shows **3 rows**:
   - `▸ building   AI-augmented E2E suite · Asseco`
   - `▸ learning   RAG · Obsidian · OpenClaw · Claude OS`
   - `▸ open to    remote`
6. `▸` markers are **blue**. `building` / `learning` / `open to` labels are muted gray. Values are full-brightness `fg`.
7. At first paint, all content is visible without internal scrolling (height ~220px is enough).
8. Dragging the splitter (1.5px-tall bar above the dock) resizes the dock smoothly. Shrinking past content height clips cleanly (no awkward scrollbars inside).
9. Browser DevTools console: **no errors, no warnings** from the page.
10. Screen reader (optional, if available): outer dock is announced as "Bottom dock", with inner sections "Impact" and "Now".

- [ ] **Step 3: WAIT for Kuba's explicit approval**

Do **not** proceed to Task 1.8 (commit) until Kuba has visually verified and said it looks good. If anything is off, fix and re-verify before committing.

### Task 1.8: Commit (only after Kuba's approval)

- [ ] **Step 1: Stage the changes**

Run:
```bash
git add components/ide/Sidebar/BottomDock.tsx components/ide/Sidebar/Sidebar.tsx components/ide/Sidebar/SidebarSplitter.tsx app/ide/IDEContext.tsx
git rm components/ide/Sidebar/Timeline.tsx
git add docs/superpowers/specs/2026-05-16-bottom-dock-redesign.md docs/superpowers/plans/2026-05-16-bottom-dock-redesign.md
```

- [ ] **Step 2: Offer 3 commit message options**

Per Kuba's commit rules (Conventional Commits, 3 options to choose from, no `Co-Authored-By`):

```
1. feat(sidebar): replace Timeline with Impact + Now bottom dock
2. refactor(sidebar): swap chronological Timeline for Impact/Now scoreboard
3. feat(ide): introduce BottomDock with Impact metrics and Now status
```

Wait for Kuba to pick (1 / 2 / 3 / custom).

- [ ] **Step 3: Commit with the chosen message**

Run (replacing `<chosen message>`):
```bash
git commit -m "<chosen message>"
```

- [ ] **Step 4: Verify**

Run:
```bash
git status
git log -1 --oneline
```

Expected: clean working tree, new commit on top with the chosen message. No `Co-Authored-By` line.

---

## Out-of-Scope Follow-ups (do not do in this PR)

- Renaming `sidebarTimelineHeightPx` → `sidebarBottomDockHeightPx` in state, action, reducer, and splitter. Pure rename, no behavior change — worth a separate cleanup commit when convenient.
- Persisting dock height to `localStorage` so the user's drag survives reload — not in scope here.
- Animating IMPACT numbers (count-up on first paint) — out of scope, would compete with the "scannable" goal.
