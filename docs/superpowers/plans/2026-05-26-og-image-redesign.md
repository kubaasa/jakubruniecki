# OG image redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-made static `public/og-image.png` with a code-generated Open Graph banner (concept C v4) rendered at build time via `next/og`, so it matches the IDE theme and never drifts from the codebase.

**Architecture:** A shared render function in `lib/og/banner.tsx` builds the banner JSX and returns an `ImageResponse` (next/og + Satori). Two metadata route files (`app/opengraph-image.tsx`, `app/twitter-image.tsx`) expose it; Next.js statically generates the PNG at build time. Fonts (`.woff` from `@fontsource`) and tool icons (SVGs from `public/`, base64 data URIs) are loaded from disk in `lib/og/assets.ts`.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), React 19, `next/og` (Satori), `@fontsource/inter`, `@fontsource/jetbrains-mono`, TypeScript.

**Commit cadence (per project policy):** Commit at phase boundaries, not per task. Before committing the rendered banner (Phase 2), STOP and wait for Jakub's visual verification.

---

## File Structure

- Create: `public/typescript-logo.svg` - new TypeScript icon (not in repo yet).
- Create: `lib/og/assets.ts` - build-time loaders for fonts and icon data URIs.
- Create: `lib/og/banner.tsx` - banner JSX + `renderOgImage()` returning `ImageResponse`.
- Create: `app/opengraph-image.tsx` - metadata route, exports `alt`/`size`/`contentType` + default `Image`.
- Create: `app/twitter-image.tsx` - thin re-export of `opengraph-image`.
- Modify: `app/layout.tsx` - remove manual `openGraph.images` and `twitter.images`.
- Delete (with confirmation): `public/og-image.png` - now unused.

---

## Phase 1: Assets and dependencies

### Task 1: Add the TypeScript logo asset

**Files:**
- Create: `public/typescript-logo.svg`

- [ ] **Step 1: Create the SVG file**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" rx="40" fill="#3178c6"/>
  <path fill="#fff" d="M223 200.2v-32.7H105.6v32.7h39.2v111.9h39.1V200.2H223z"/>
  <path fill="#fff" d="M243.6 312.9c6.3 3.3 13.8 5.7 22.4 7.4 8.6 1.6 17.7 2.4 27.2 2.4 9.3 0 18.1-.9 26.5-2.7 8.3-1.8 15.6-4.7 21.9-8.8 6.3-4.1 11.3-9.5 14.9-16.1 3.7-6.7 5.5-14.9 5.5-24.6 0-7.1-1.1-13.3-3.2-18.6-2.1-5.4-5.2-10.1-9.2-14.3-4-4.2-8.8-7.9-14.4-11.2-5.6-3.3-11.9-6.4-18.9-9.3-5.1-2.1-9.7-4.2-13.8-6.2-4.1-2-7.5-4.1-10.4-6.2-2.8-2.1-5-4.4-6.6-6.7-1.5-2.4-2.3-5.1-2.3-8.1 0-2.8.7-5.2 2.1-7.4 1.4-2.2 3.3-4.1 5.9-5.6 2.5-1.6 5.6-2.8 9.3-3.6 3.7-.9 7.7-1.3 12.2-1.3 3.3 0 6.7.2 10.3.7 3.6.5 7.3 1.3 11 2.3 3.7 1 7.3 2.3 10.8 3.9 3.5 1.6 6.7 3.4 9.7 5.5v-36.4c-5.9-2.3-12.4-3.9-19.4-5-7-1.1-15-1.6-24.1-1.6-9.2 0-18 1-26.2 3-8.3 2-15.6 5.1-21.9 9.3-6.3 4.2-11.3 9.6-14.9 16.2-3.7 6.6-5.5 14.5-5.5 23.7 0 11.7 3.4 21.6 10.1 29.9 6.7 8.2 17 15.2 30.7 20.9 5.4 2.2 10.4 4.4 15 6.5 4.6 2.1 8.6 4.3 12 6.6 3.3 2.3 6 4.7 7.9 7.4 1.9 2.7 2.9 5.7 2.9 9.1 0 2.6-.6 5-1.9 7.2-1.3 2.2-3.2 4.1-5.7 5.7-2.6 1.6-5.8 2.8-9.6 3.7-3.9.9-8.3 1.3-13.5 1.3-8.8 0-17.5-1.5-26.1-4.6-8.6-3.1-16.6-7.7-23.9-13.9v38.9z"/>
</svg>
```

- [ ] **Step 2: Verify the four icons now exist**

Run: `ls public/playwright-logo.svg public/postman-icon.svg public/claude-ai.svg public/typescript-logo.svg`
Expected: all four paths listed, no "No such file".

### Task 2: Install the font packages

**Files:** none (package.json / lock updated by install)

- [ ] **Step 1: Install @fontsource packages**

Run: `npm i -D @fontsource/inter @fontsource/jetbrains-mono`
Expected: installs succeed, both added to `devDependencies`.

- [ ] **Step 2: Verify the exact .woff files exist**

Run:
```bash
ls node_modules/@fontsource/inter/files/inter-latin-400-normal.woff \
   node_modules/@fontsource/inter/files/inter-latin-600-normal.woff \
   node_modules/@fontsource/inter/files/inter-latin-700-normal.woff \
   node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff
```
Expected: all four paths listed. If a filename differs, run `ls node_modules/@fontsource/inter/files | grep latin` and adjust the names used in Task 3 accordingly.

### Task 3 (Phase 1 commit)

- [ ] **Step 1: Commit Phase 1**

```bash
git add public/typescript-logo.svg package.json package-lock.json
git commit -m "chore(og): add TypeScript icon and bundle og fonts"
```

---

## Phase 2: OG image generation

### Task 4: Asset loaders

**Files:**
- Create: `lib/og/assets.ts`

- [ ] **Step 1: Write `lib/og/assets.ts`**

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Satori (next/og) supports ttf, otf and woff - NOT woff2. @fontsource ships
// .woff alongside .woff2, so we read the .woff files directly from node_modules.
const fontsDir = join(process.cwd(), "node_modules", "@fontsource");
const publicDir = join(process.cwd(), "public");

export type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: "normal";
};

export function loadFonts(): OgFont[] {
  return [
    { name: "Inter", data: readFileSync(join(fontsDir, "inter/files/inter-latin-400-normal.woff")), weight: 400, style: "normal" },
    { name: "Inter", data: readFileSync(join(fontsDir, "inter/files/inter-latin-600-normal.woff")), weight: 600, style: "normal" },
    { name: "Inter", data: readFileSync(join(fontsDir, "inter/files/inter-latin-700-normal.woff")), weight: 700, style: "normal" },
    { name: "JetBrains Mono", data: readFileSync(join(fontsDir, "jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff")), weight: 400, style: "normal" },
  ];
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function svgFileToDataUri(file: string): string {
  return svgToDataUri(readFileSync(join(publicDir, file), "utf8"));
}

// Small inline check glyph - drawn as SVG so we do not depend on a font glyph.
const CHECK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export type OgIcons = {
  playwright: string;
  typescript: string;
  postman: string;
  claude: string;
  check: string;
};

export function loadIcons(): OgIcons {
  return {
    playwright: svgFileToDataUri("playwright-logo.svg"),
    typescript: svgFileToDataUri("typescript-logo.svg"),
    postman: svgFileToDataUri("postman-icon.svg"),
    claude: svgFileToDataUri("claude-ai.svg"),
    check: svgToDataUri(CHECK_SVG),
  };
}
```

### Task 5: Banner render

**Files:**
- Create: `lib/og/banner.tsx`

- [ ] **Step 1: Write `lib/og/banner.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { loadFonts, loadIcons, type OgIcons } from "./assets";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Jakub Bruniecki - QA Automation Engineer";
export const OG_CONTENT_TYPE = "image/png";

function Banner({ icons }: { icons: OgIcons }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      {/* chrome bar */}
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #21262d",
        }}
      >
        <div style={{ width: 15, height: 15, borderRadius: 9999, backgroundColor: "#f85149" }} />
        <div style={{ width: 15, height: 15, borderRadius: 9999, backgroundColor: "#d29922", marginLeft: 10 }} />
        <div style={{ width: 15, height: 15, borderRadius: 9999, backgroundColor: "#3fb950", marginLeft: 10 }} />
        <div
          style={{
            display: "flex",
            marginLeft: 18,
            padding: "9px 22px",
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            color: "#e6edf3",
            backgroundColor: "#0d1117",
            borderTop: "3px solid #e3a008",
            borderLeft: "1px solid #21262d",
            borderRight: "1px solid #21262d",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        >
          about.ts
        </div>
      </div>

      {/* body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#3fb950",
            fontSize: 21,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 9999,
              backgroundColor: "#3fb950",
              marginRight: 13,
              boxShadow: "0 0 16px 2px rgba(63,185,80,0.7)",
            }}
          />
          Available for remote roles
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -2, marginTop: 18, marginBottom: 8 }}>
          Jakub Bruniecki
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#7d8590", marginBottom: 44 }}>QA Automation Engineer</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={icons.playwright} width={72} height={72} />
          <img src={icons.typescript} width={72} height={72} style={{ marginLeft: 42 }} />
          <img src={icons.postman} width={72} height={72} style={{ marginLeft: 42 }} />
          <img src={icons.claude} width={72} height={72} style={{ marginLeft: 42 }} />
        </div>
      </div>

      {/* status bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 46,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          backgroundColor: "#161b22",
          borderTop: "1px solid #21262d",
          fontFamily: "JetBrains Mono",
          fontSize: 18,
          color: "#7d8590",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#e3a008" }}>
          <div style={{ width: 11, height: 11, backgroundColor: "#e3a008", transform: "rotate(45deg)", marginRight: 10 }} />
          main
        </div>
        <div style={{ display: "flex", alignItems: "center", color: "#3fb950", marginLeft: 28 }}>
          <img src={icons.check} width={14} height={14} style={{ marginRight: 9 }} />
          tests passing
        </div>
        <div style={{ display: "flex", marginLeft: "auto" }}>jakubruniecki.dev</div>
      </div>
    </div>
  );
}

export function renderOgImage(): ImageResponse {
  return new ImageResponse(<Banner icons={loadIcons()} />, {
    ...OG_SIZE,
    fonts: loadFonts(),
  });
}
```

### Task 6: Metadata routes

**Files:**
- Create: `app/opengraph-image.tsx`
- Create: `app/twitter-image.tsx`

- [ ] **Step 1: Write `app/opengraph-image.tsx`**

```tsx
import { renderOgImage, OG_SIZE, OG_ALT, OG_CONTENT_TYPE } from "@/lib/og/banner";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage();
}
```

- [ ] **Step 2: Write `app/twitter-image.tsx`**

```tsx
export { default, alt, size, contentType } from "./opengraph-image";
```

### Task 7: Build and verify

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: PASS. If `data: Buffer` is rejected by the `fonts` option type, wrap with `new Uint8Array(readFileSync(...))` in `loadFonts`.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: PASS. (`<img>` without `next/image` may warn; these are Satori elements in a non-page module - if the rule fires, add `{/* eslint-disable-next-line @next/next/no-img-element */}` above each `<img>`.)

- [ ] **Step 3: Build and locate the generated image**

Run: `npm run build`
Expected: build succeeds. Then:
Run: `ls out | grep -i -E "opengraph|twitter"`
Expected: `opengraph-image.png` and `twitter-image.png` present in `out/`.

- [ ] **Step 4: Open the generated PNG for visual review**

Open `out/opengraph-image.png`. Confirm it matches concept C v4: chrome bar with three dots + `about.ts` tab (brand top border), green "AVAILABLE FOR REMOTE ROLES" with glowing dot, large "Jakub Bruniecki", "QA Automation Engineer", a row of four icons (Playwright / TypeScript / Postman / Claude Code), and a status bar reading `main`, `tests passing`, and `jakubruniecki.dev`.

- [ ] **Step 5: STOP - wait for Jakub's visual verification**

Do not commit yet. Show the rendered PNG to Jakub. If spacing/sizes need tweaking, adjust the numeric values in `lib/og/banner.tsx` and rebuild. Only proceed once Jakub approves.

### Task 8 (Phase 2 commit)

- [ ] **Step 1: Commit Phase 2 (after approval)**

```bash
git add lib/og/assets.ts lib/og/banner.tsx app/opengraph-image.tsx app/twitter-image.tsx
git commit -m "feat(og): generate IDE-themed Open Graph banner with next/og"
```

---

## Phase 3: Metadata cleanup and old asset removal

### Task 9: Remove manual image metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Remove the `images` array from `openGraph`**

In `app/layout.tsx`, delete the `images: [ { url: "/og-image.png", ... } ]` block inside `openGraph` (lines ~34-42). The `opengraph-image.tsx` file convention now injects `og:image` automatically. Keep `title`, `description`, `url`, `type`, `locale`.

- [ ] **Step 2: Remove the `images` array from `twitter`**

In the `twitter` block, delete `images: ["/og-image.png"]`. Keep `card`, `title`, `description`. The `twitter-image.tsx` route injects `twitter:image` automatically.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Rebuild and confirm meta tags**

Run: `npm run build`
Expected: build succeeds.
Run: `grep -i -E "og:image|twitter:image" out/index.html`
Expected: both tags present and pointing at `/opengraph-image.png` and `/twitter-image.png` (with a version query), NOT `/og-image.png`.

### Task 10: Remove the obsolete PNG

**Files:**
- Delete: `public/og-image.png`

- [ ] **Step 1: Confirm before deleting**

`public/og-image.png` is now unused. Per project policy, list it and ask Jakub for explicit confirmation before deleting.

- [ ] **Step 2: Delete after confirmation**

Run: `git rm public/og-image.png`

### Task 11 (Phase 3 commit)

- [ ] **Step 1: Commit Phase 3**

```bash
git add app/layout.tsx
git commit -m "refactor(og): drop manual image metadata and stale og-image.png"
```

---

## Post-implementation (manual, after deploy)

- Validate the live tags with the LinkedIn Post Inspector (re-scrape to bust LinkedIn's cache) and confirm the new banner shows with `jakubruniecki.dev`.
