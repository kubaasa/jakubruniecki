# OG image redesign - design spec

Date: 2026-05-26
Status: Approved (design), pending implementation

## Problem

The site's Open Graph image (the banner shown when the URL is pasted on
LinkedIn, Slack, etc.) is a hand-made static PNG at `public/og-image.png`.
Because it is disconnected from the codebase, it has already drifted: it still
shows the old domain `jakubruniecki.vercel.app` even though the live domain is
`jakubruniecki.dev`. The visual is also generic and does not strongly reflect
the site's IDE theme.

## Goal

Replace the static PNG with a code-generated OG image that:

- matches the site's IDE theme (colors from `app/globals.css`),
- shows the up-to-date domain and role, with no future drift,
- is regenerated automatically at build time.

## Approved visual design (concept C, v4)

A 1200x630 banner styled as an IDE editor window:

- Top chrome bar (`#161b22`, bottom border `#21262d`): three "traffic light"
  dots (red `#f85149`, yellow `#d29922`, green `#3fb950`) and an active editor
  tab `about.ts` (JetBrains Mono) with a 2px brand-accent top border
  (`#e3a008`).
- Body (centered, ~64px side padding):
  - "Available for remote roles" - uppercase, green (`#3fb950`), with a small
    glowing dot to its left.
  - "Jakub Bruniecki" - Inter, ~64px, weight 700.
  - "QA Automation Engineer" - Inter, ~26px, muted (`#7d8590`).
  - A row of four tool icons (no labels): Playwright, TypeScript, Postman,
    Claude Code. ~52px each, ~30px gap.
- Bottom status bar (`#161b22`, top border `#21262d`, JetBrains Mono, 13px):
  `◆ main` (brand `#e3a008`), `✓ tests passing` (green `#3fb950`), and
  right-aligned `jakubruniecki.dev`.

Background: `#0d1117`. Foreground: `#e6edf3`. All values taken from the existing
`@theme` tokens in `app/globals.css`.

## Approach: next/og (ImageResponse + Satori)

Use the Next.js metadata file convention. A `opengraph-image` route renders the
banner as JSX via `ImageResponse` from `next/og`. Next.js statically generates
the PNG at build time and auto-injects the `og:image` meta tag. This is
confirmed to work with `output: "export"` because the image is fully static
(no request-time APIs).

### Components

- `app/opengraph-image.tsx` - exports `alt`, `size` (1200x630),
  `contentType`, and a default async `Image()` that returns the shared banner
  `ImageResponse`.
- `app/twitter-image.tsx` - thin re-export of the same image so the
  `twitter:image` tag also resolves to the new banner.
- `lib/og/banner.tsx` (or similar) - the shared render function returning the
  `ImageResponse`. Keeps the two route files thin and the layout in one place.
- `lib/og/assets.ts` - build-time helpers that read fonts and SVG icons from
  disk and return the buffers / data URIs the banner needs.

### Fonts

Satori needs raw font buffers (it cannot use `next/font`). Bundle the required
weights as `.ttf` files in the repo (e.g. `lib/og/fonts/`) and read them with
`fs.readFileSync` at build time. Required weights, matching the design:

- Inter: 400, 600, 700
- JetBrains Mono: 400, 500

Bundling locally (rather than fetching Google Fonts at build) keeps the build
deterministic and offline-safe.

### Icons

Satori renders SVG most reliably via `<img src="data:image/svg+xml;base64,...">`.
At build time, read each icon file, base64-encode it, and pass it as a data URI.

Icon sources:

- `public/playwright-logo.svg` (exists)
- `public/postman-icon.svg` (exists)
- `public/claude-ai.svg` (exists) - used for "Claude Code"
- `public/typescript-logo.svg` - NEW, must be added (official TS rounded blue
  square with white "TS").

### Metadata cleanup

- Remove the manual `openGraph.images` and `twitter.images` arrays from
  `app/layout.tsx` (the file convention injects these automatically; keeping
  both risks duplicate/conflicting tags).
- Keep `metadataBase`, titles, and descriptions as they are.

### Old asset removal

- `public/og-image.png` becomes unused. Deletion will be proposed and confirmed
  separately during implementation (per project policy: list before deleting).

## Out of scope

- Per-page OG images (single site-wide banner is enough).
- Photo of Jakub on the banner (the LinkedIn card already shows the profile
  photo separately).
- Monochrome icon variant (colored icons approved).

## Verification

- `npm run build` succeeds and emits a static OG image into the export output.
- Generated PNG visually matches concept C v4 (chrome bar, name, role, four
  icons, status bar with `jakubruniecki.dev`).
- `npm run typecheck` and `npm run lint` pass.
- Validate the rendered tags with a social-preview debugger (LinkedIn Post
  Inspector) after deploy.
