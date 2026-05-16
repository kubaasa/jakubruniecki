## Bottom Dock Redesign — IMPACT + NOW

**Date:** 2026-05-16
**Owner:** Jakub Bruniecki
**Status:** Draft — awaiting review
**Supersedes:** Sidebar `TIMELINE` section described in `2026-05-12-portfolio-ide-redesign.md` §3 (Sidebar).

## 1. Goal

Replace the bottom-left sidebar `TIMELINE` (chronological list of 4 milestones with bullet dots) with a two-section dock that sells the candidate instead of narrating dates:

- **IMPACT** — 6 scannable lines, recruiter-skim. Left column accents the metric/credential, right column gives context.
- **NOW** — 3 lines covering current work, current learning, and availability.

Chronology by itself does not communicate seniority, domain depth, tooling, or availability. Those are the things a recruiter scanning a portfolio in 5 seconds needs.

## 2. Scope

In scope:
- Rename `components/ide/Sidebar/Timeline.tsx` → `components/ide/Sidebar/BottomDock.tsx`. Component export renamed to `BottomDock`.
- Update import site in `components/ide/Sidebar/Sidebar.tsx`.
- Replace component body with two sections (IMPACT, NOW) separated by a thin divider.
- Bump default dock height in `app/ide/IDEContext.tsx` (current default needs to accommodate ~12 rows of mono `text-[11px]`, ~220px).
- Keep `SidebarSplitter` unchanged — it resizes the whole dock, both sections grow/shrink together (overflow hidden on the section, as today).
- Update the existing redesign spec note in `2026-05-12-portfolio-ide-redesign.md` §3 only if asked — otherwise just supersede via this doc's header.

Out of scope:
- No new context state, no new splitter between IMPACT and NOW.
- No data file for content — inline `const IMPACT` and `const NOW` in `BottomDock.tsx` (two short arrays, easier to edit than threading through `data/`).
- No animations, no hover states beyond existing dock baseline.
- No mobile changes — `MobileFallback` already replaces the IDE on small viewports.

## 3. Content (final, approved)

### IMPACT (6 rows, final order — career-arc)

| left (accent-blue) | right (fg-muted) |
| --- | --- |
| `5y` | `in QA · 3.5 manual / 1.5 auto` |
| `senior` | `manual · mid automation` |
| `ISTQB` | `Foundation Level certified` |
| `2` | `enterprise clients · Polsat · Plus` |
| `0 → 1` | `built E2E framework from scratch` |
| `AI-fwd` | `Cursor · Claude Code · MCP` |

### NOW (3 rows)

| marker | label | value |
| --- | --- | --- |
| `▸` | `building` | `AI-augmented E2E suite · Asseco` |
| `▸` | `learning` | `RAG · Obsidian · OpenClaw · Claude OS` |
| `▸` | `open to` | `remote` |

NOW labels (`building` / `learning` / `open to`) render in `fg-muted`; values render in `fg`. Marker `▸` in `accent-blue`.

## 4. Layout

```
┌────────────────────────────────────┐
│ IMPACT                             │  text-[10px] mono caps · fg-muted
│  5y        in QA · 3.5 manual / …  │  grid: [auto · 1fr], col-gap 2
│  senior    manual · mid automation │  left col: accent-blue, tabular-nums
│  ISTQB     Foundation Level cert.  │  right col: fg-muted
│  2         enterprise clients · …  │  row height: leading-tight
│  0 → 1     built E2E framework …   │
│  AI-fwd    Cursor · Claude Code …  │
│                                    │
│  ─────────────────────────────     │  border-t border-subtle, my-2
│                                    │
│ NOW                                │  text-[10px] mono caps · fg-muted
│  ▸ building   AI-augmented E2E …   │  grid: [auto · auto · 1fr]
│  ▸ learning   RAG · Obsidian · …   │
│  ▸ open to    remote               │
└────────────────────────────────────┘
```

- Container: existing wrapper unchanged — `flex flex-shrink-0 flex-col overflow-hidden border-t border-border-subtle px-3 py-2`, height bound to `state.sidebarTimelineHeightPx`.
- IMPACT grid: `grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-[11px] leading-tight tabular-nums`. Left cells: `text-accent-blue`. Right cells: `text-fg-muted`.
- NOW grid: `grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[11px] leading-tight`. Marker `text-accent-blue`, label `text-fg-muted`, value `text-fg`.
- Divider: `<hr class="my-2 border-t border-border-subtle" />`.
- Section headers: same style as current `TIMELINE` label — `mb-1.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted`.

## 5. Default dock height

Current default in `app/ide/IDEContext.tsx` sized for ~5 rows. Content now needs ~12 rows + 2 headers + divider. Target: **220px** default, same min/max clamp (whatever exists today — do not change clamp logic).

If clamp max is lower than 220, raise it to at least 260 so the user can drag taller. If clamp min should also rise (so content does not clip on first paint), set min to ~180.

## 6. Accessibility

- Section element keeps `aria-label="Bottom dock"` (was `"Timeline"`).
- IMPACT and NOW each rendered as `<section aria-label="Impact">` / `<section aria-label="Now">` inside the dock, with the visible caps label associated via `aria-labelledby` pointing at the header `<div>` (give each header an `id`).
- Decorative `▸` marker: `aria-hidden`.
- Divider: visual only — `role="separator"` not needed (it's `<hr>` which is implicitly that).

## 7. Files to touch

- `components/ide/Sidebar/Timeline.tsx` → rename to `BottomDock.tsx`, rewrite body.
- `components/ide/Sidebar/Sidebar.tsx` — update import + JSX tag.
- `app/ide/IDEContext.tsx` — bump default `sidebarTimelineHeightPx` (and clamp if needed). The state key name stays `sidebarTimelineHeightPx` for now — renaming the state field is out of scope (would touch SidebarSplitter, persistence, etc.). A follow-up commit can rename if desired.
- `components/ide/Sidebar/SidebarSplitter.tsx` — no functional change. Optional: update `aria-label` from `"Resize timeline"` to `"Resize bottom dock"`.

## 8. Testing

Manual smoke (browser):
- Dock renders with both sections, divider visible.
- Left column of IMPACT is `accent-blue`, right is muted.
- NOW values render in `fg`, labels muted, marker blue.
- Resizing the splitter still works; content does not overflow at default height; scrolls/clips cleanly at minimum.
- No console errors.
- `aria-label`s present on sections.

Automated:
- Existing Playwright specs may reference `Timeline` aria label or text — grep `tests/` for `Timeline`, `Senior QA`, `regression`, `Playwright + CI`, `First QA role`. Update any spec that asserts on old timeline text.
- Add no new tests in this PR — coverage of the dock content is low-value (it is essentially static data).

## 9. Open questions

None. All copy and ordering approved in brainstorming session 2026-05-16.
