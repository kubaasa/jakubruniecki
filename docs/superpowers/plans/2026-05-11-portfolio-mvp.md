# Portfolio Website MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static single-page portfolio at `jakubruniecki.vercel.app` showcasing Senior QA + Playwright automation profile to international recruiters.

**Architecture:** Next.js 15 App Router with `output: 'export'` for static HTML generation. Tailwind CSS for styling. Server Components for everything except mobile navigation. Content lives in typed TypeScript data files; sections render from them.

**Tech Stack:** Next.js 15+, React 19, TypeScript (strict), Tailwind CSS 3, `next/font/google` (Inter + JetBrains Mono), GitHub Actions CI, Vercel hosting.

**Source spec:** `docs/superpowers/specs/2026-05-11-portfolio-design.md`

**User context:** First Next.js + React project (5y QA background, TS familiar from Playwright). Plan includes "why" notes where React/Next.js conventions are non-obvious. No tests against this site itself (explicit scope decision). Package manager: **npm** (matches `create-next-app` default + Vercel).

---

## File map (what we will create)

| Path | Responsibility |
|---|---|
| `package.json` | Next.js + Tailwind + TS deps; scripts (`dev`, `build`, `lint`, `typecheck`) |
| `next.config.mjs` | `output: 'export'`, image config, strict mode |
| `tsconfig.json` | Strict TS config with `noUncheckedIndexedAccess` |
| `tailwind.config.ts` | Custom palette (zinc dark + emerald accent), font families |
| `app/globals.css` | Tailwind directives + CSS variables for theme tokens |
| `app/layout.tsx` | `<html lang="en">`, fonts, global metadata, NavBar |
| `app/page.tsx` | Composes 5 sections in order |
| `app/opengraph-image.tsx` | Build-time OG image generator (1200×630) |
| `app/favicon.ico` | Site favicon |
| `types/index.ts` | `Profile`, `Skill`, `Project` (union), `ContactLink` types |
| `data/profile.ts` | Bio, role, status, experience metadata |
| `data/skills.ts` | List of skills grouped by category + level |
| `data/projects.ts` | Demo repos + case studies |
| `data/contact.ts` | Email, LinkedIn, location, phone |
| `components/ui/WindowChrome.tsx` | Stoplight dots + title bar wrapper |
| `components/ui/CodeBlock.tsx` | Static syntax-highlighted TS object renderer |
| `components/ui/Badge.tsx` | Skill / tag pill |
| `components/ui/Avatar.tsx` | Round photo + optional status dot |
| `components/ui/SectionHeader.tsx` | `// section.ts` label + title |
| `components/ui/ProjectCard.tsx` | Renders demo-repo vs case-study via union narrowing |
| `components/ui/NavBar.tsx` | Sticky nav, anchor links, mobile hamburger (Client Component) |
| `components/icons/*.tsx` | Inline SVG icons (email, linkedin, location, phone, github) |
| `components/sections/Hero.tsx` | Hero section |
| `components/sections/About.tsx` | About section |
| `components/sections/Skills.tsx` | Skills section |
| `components/sections/Projects.tsx` | Projects section |
| `components/sections/Contact.tsx` | Contact section + footer |
| `public/photo.jpg` | Professional headshot (~800×800) |
| `.github/workflows/ci.yml` | Lint + typecheck + build on PR / push |
| `README.md` | Project intro + CI badge + run instructions |

---

## Phase 0 — Bootstrap

### Task 1: Scaffold Next.js project in current directory

**Files:**
- Create (via tool): `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/`, `public/`, `next-env.d.ts`, etc.
- Modify: `.gitignore` (merge with Next.js defaults)

- [ ] **Step 1: Verify current directory state**

Run: `git status`
Expected: clean tree on `main` with `docs/superpowers/...` already committed.

- [ ] **Step 2: Run create-next-app in the current directory**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --yes
```

If prompted about overwriting `.gitignore`, choose **yes** (we will re-apply our additions in Step 3). The `--yes` flag skips most prompts on Next.js 15+.

Expected output: project files generated; `npm install` runs automatically. Last lines should read `Success! Created jakubruniecki at ...`.

- [ ] **Step 3: Re-apply our `.gitignore` additions**

Append the following lines to the generated `.gitignore` (only the ones not already present):

```gitignore

# Brainstorm / Superpowers artifacts (local-only)
.superpowers/

# Editors / OS
.vscode/
.idea/
*.swp
*.swo

# Vercel
.vercel
```

Verify by running: `git diff .gitignore`

- [ ] **Step 4: Verify dev server works**

Run:
```bash
npm run dev
```

Open `http://localhost:3000`. Expected: default Next.js landing page renders. Stop server with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Configure `next.config.mjs` for static export

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Replace `next.config.mjs` content**

Write the following to `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
```

**Why each flag:**
- `output: "export"` — generates static HTML into `/out` at build time; no Node server needed.
- `images: { unoptimized: true }` — `next/image` requires a server for optimization; static export needs raw images. Vercel CDN handles compression downstream.
- `trailingSlash: true` — produces `/about/index.html` instead of `/about.html`; cleaner URLs and friendlier for static hosts.
- `reactStrictMode: true` — Next.js default; runs effects twice in dev to catch bugs early. Harmless in production.

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: build succeeds, `out/` directory appears with `index.html`.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "chore: configure Next.js for static export"
```

---

### Task 3: Tighten `tsconfig.json` strictness

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Add stricter compiler options**

Open `tsconfig.json` and ensure the `compilerOptions` block contains these flags (add if missing):

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Leave all other defaults from `create-next-app` intact.

**Why:**
- `noUncheckedIndexedAccess` — `arr[0]` returns `T | undefined` instead of `T`. Forces you to handle the empty-array case. Catches a class of bugs at compile time.
- `noImplicitOverride` — methods overriding a parent must use `override` keyword. Pure documentation safety; cheap.

- [ ] **Step 2: Add `typecheck` script to `package.json`**

In `package.json` → `scripts`, add:

```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json package.json
git commit -m "chore: enable strict TypeScript options and typecheck script"
```

---

### Task 4: Configure Tailwind theme

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace `tailwind.config.ts` content**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0d1117",
          surface: "#161b22",
          subtle: "#21262d",
        },
        border: {
          DEFAULT: "#30363d",
          subtle: "#21262d",
        },
        fg: {
          DEFAULT: "#e6edf3",
          muted: "#7d8590",
          subtle: "#484f58",
        },
        accent: {
          green: "#3fb950",
          blue: "#79c0ff",
          string: "#a5d6ff",
          keyword: "#ff7b72",
          number: "#d2a8ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Why semantic color names (`bg.base`, `fg.muted`) instead of `zinc-900`:**
Using semantic tokens means swapping the palette later (e.g. adding light mode in v2) means editing one place, not 200 class names across files.

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "chore: configure Tailwind theme with terminal-style palette"
```

---

### Task 5: Configure fonts and root layout

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Replace `app/layout.tsx` content**

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
  title: "Jakub Runiecki — Senior QA Engineer",
  description:
    "Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg-base text-fg font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Why `next/font/google` with `variable`:**
Self-hosts the font files at build time (no external request, zero CLS), and exposes a CSS variable so Tailwind can reference it via `font-sans` / `font-mono`.

- [ ] **Step 2: Replace `app/globals.css` content**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    text-rendering: optimizeLegibility;
  }
}
```

- [ ] **Step 3: Run dev server, verify fonts load**

Run: `npm run dev`
Open `http://localhost:3000`. Expected: dark background, Inter font in body text. Default Next.js placeholder is still visible (will replace in Task 18).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: configure fonts and base body styles"
```

---

## Phase 1 — Types & data

### Task 6: Create `types/index.ts`

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Write the file**

```ts
export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: ReadonlyArray<string>;
  location: string;
  status: "open-to-work" | "employed" | "freelance";
  yearsOfExperience: number;
  experienceBreakdown: ReadonlyArray<string>;
  cvDelivery: "on-request" | "public-pdf";
};

export type SkillCategory = "automation" | "manual" | "tools";
export type SkillLevel = "advanced" | "intermediate" | "beginner";

export type Skill = {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  yearsUsed?: number;
};

export type DemoRepo = {
  type: "demo-repo";
  title: string;
  description: string;
  tech: ReadonlyArray<string>;
  githubUrl: string;
  liveUrl?: string;
  highlights: ReadonlyArray<string>;
  status: "active" | "archived";
};

export type CaseStudy = {
  type: "case-study";
  title: string;
  industry: string;
  role: string;
  duration: string;
  description: string;
  metrics: ReadonlyArray<string>;
  techUsed: ReadonlyArray<string>;
};

export type Project = DemoRepo | CaseStudy;

export type ContactIcon = "email" | "linkedin" | "location" | "phone";

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: ContactIcon;
};
```

**Why `ReadonlyArray<T>` for `bio`, `metrics`, etc.:**
Data files are static. Marking arrays readonly prevents accidental in-place mutations in components (e.g. `bio.push(...)`) and forces use of pure operations (`map`, `filter`) — those return new arrays.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: add shared TypeScript types for portfolio data"
```

---

### Task 7: Create `data/profile.ts` (placeholder content)

**Files:**
- Create: `data/profile.ts`

- [ ] **Step 1: Write the file**

```ts
import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Jakub Runiecki",
  role: "Senior QA Engineer",
  tagline: "Manual leadership + Playwright automation",
  bio: [
    "I'm a QA engineer with 5 years of experience across fintech and e-commerce. Most of that time was hands-on manual testing; the last 1.5 years I've focused on building Playwright automation suites that actually pay off — fewer regressions, faster releases, predictable outcomes.",
    "I treat tests as a feature, not a tax. The goal isn't coverage numbers — it's catching the issues that would have shipped, and giving the team enough confidence to move faster.",
  ],
  location: "Warsaw, Poland · Open to international remote",
  status: "open-to-work",
  yearsOfExperience: 5,
  experienceBreakdown: [
    "3.5y manual testing",
    "1.5y test automation",
    "Fintech & E-commerce",
  ],
  cvDelivery: "on-request",
};
```

**Note:** This is placeholder copy aligned with the brand. Replace the `bio` array with final wording before launch (tracked as content gap in spec section 14).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add data/profile.ts
git commit -m "feat: add profile data file with placeholder bio"
```

---

### Task 8: Create `data/skills.ts`

**Files:**
- Create: `data/skills.ts`

- [ ] **Step 1: Write the file**

```ts
import type { Skill } from "@/types";

export const skills: ReadonlyArray<Skill> = [
  // Automation
  { name: "Playwright", level: "intermediate", category: "automation", yearsUsed: 1.5 },
  { name: "TypeScript", level: "intermediate", category: "automation", yearsUsed: 1.5 },
  { name: "Postman", level: "advanced", category: "automation", yearsUsed: 4 },
  { name: "Newman", level: "intermediate", category: "automation" },
  { name: "GitHub Actions", level: "beginner", category: "automation" },

  // Manual
  { name: "Test design", level: "advanced", category: "manual", yearsUsed: 5 },
  { name: "Exploratory testing", level: "advanced", category: "manual", yearsUsed: 5 },
  { name: "JIRA", level: "advanced", category: "manual" },
  { name: "TestRail", level: "advanced", category: "manual" },
  { name: "Xray", level: "intermediate", category: "manual" },
  { name: "Bug triage", level: "advanced", category: "manual" },

  // Tools
  { name: "Git", level: "intermediate", category: "tools" },
  { name: "REST APIs", level: "advanced", category: "tools" },
  { name: "SQL", level: "intermediate", category: "tools" },
  { name: "Chrome DevTools", level: "advanced", category: "tools" },
];
```

**Note:** Final level assignments are owner's call — review before launch (spec section 14).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add data/skills.ts
git commit -m "feat: add skills data file"
```

---

### Task 9: Create `data/projects.ts`

**Files:**
- Create: `data/projects.ts`

- [ ] **Step 1: Write the file**

```ts
import type { Project } from "@/types";

export const projects: ReadonlyArray<Project> = [
  {
    type: "demo-repo",
    title: "E-commerce E2E Test Suite",
    description:
      "Playwright + TypeScript test suite against a public e-commerce demo site. POM architecture, fixtures, parallel execution, CI on every push.",
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
      "Inherited a manual regression suite that blocked every release for three days. Designed and built a Playwright suite covering critical user paths; integrated into CI so regression ran on every PR.",
    metrics: [
      "3d → 4h regression cycle",
      "150+ automated E2E tests",
      "0 production incidents from covered paths post-launch",
    ],
    techUsed: ["Playwright", "TypeScript", "Postman", "JIRA"],
  },
];
```

**Note:** Replace `githubUrl` placeholder once the demo repo is published. Two entries here; spec calls for 4–6 in total — owner adds remaining entries when content is ready.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add data/projects.ts
git commit -m "feat: add projects data file with seed entries"
```

---

### Task 10: Create `data/contact.ts`

**Files:**
- Create: `data/contact.ts`

- [ ] **Step 1: Write the file**

```ts
import type { ContactLink } from "@/types";

const EMAIL = "jakubruniecki@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/REPLACE_WITH_REAL_HANDLE/";
const PHONE = "+48000000000";

export const contactLinks: ReadonlyArray<ContactLink> = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Hello Jakub")}`,
    icon: "email",
  },
  {
    label: "LinkedIn",
    value: LINKEDIN_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    href: LINKEDIN_URL,
    icon: "linkedin",
  },
  {
    label: "Location",
    value: "Warsaw, Poland · CET",
    href: "https://maps.google.com/?q=Warsaw,Poland",
    icon: "location",
  },
  {
    label: "Phone",
    value: PHONE,
    href: `tel:${PHONE}`,
    icon: "phone",
  },
];

export const cvRequestHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "CV Request — [Your Company]"
)}&body=${encodeURIComponent(
  "Hi Jakub,\n\nI'm [name] from [company]. We're looking for a [role]. Could you share your CV?\n\nThanks!"
)}`;
```

**Note:** Replace `LINKEDIN_URL` and `PHONE` placeholders before launch. Owner may opt to omit the phone link entirely (spec section 10.5) — if so, delete the Phone entry from `contactLinks`.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add data/contact.ts
git commit -m "feat: add contact data file with CV-request mailto template"
```

---

## Phase 2 — UI primitives

### Task 11: `WindowChrome` component

**Files:**
- Create: `components/ui/WindowChrome.tsx`

- [ ] **Step 1: Write the file**

```tsx
type WindowChromeProps = {
  title?: string;
  children: React.ReactNode;
};

export function WindowChrome({ title, children }: WindowChromeProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-base shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border bg-bg-surface px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        {title ? (
          <span className="ml-auto font-mono text-xs text-fg-muted">
            {title}
          </span>
        ) : null}
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
```

**Why `aria-hidden` on the dots:**
They're pure decoration — a screen reader announcing "circle, circle, circle" before the actual content is noise. Hiding from assistive tech, keeping visual semantics.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/WindowChrome.tsx
git commit -m "feat: add WindowChrome UI primitive"
```

---

### Task 12: `CodeBlock` component (pre-tokenized lines)

**Files:**
- Create: `components/ui/CodeBlock.tsx`

- [ ] **Step 1: Write the file**

```tsx
type TokenKind =
  | "keyword"
  | "string"
  | "number"
  | "boolean"
  | "punct"
  | "ident"
  | "comment"
  | "plain";

export type Token = { kind: TokenKind; text: string };
export type CodeLine = ReadonlyArray<Token>;

type CodeBlockProps = {
  lines: ReadonlyArray<CodeLine>;
  showLineNumbers?: boolean;
};

const tokenClass: Record<TokenKind, string> = {
  keyword: "text-accent-keyword",
  string: "text-accent-string",
  number: "text-accent-number",
  boolean: "text-accent-blue",
  punct: "text-fg",
  ident: "text-accent-blue",
  comment: "text-fg-muted",
  plain: "text-fg",
};

export function CodeBlock({ lines, showLineNumbers = false }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
      <code>
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex">
            {showLineNumbers ? (
              <span
                aria-hidden
                className="mr-4 inline-block w-6 select-none text-right text-fg-subtle"
              >
                {lineIdx + 1}
              </span>
            ) : null}
            <span>
              {line.length === 0 ? " " : null}
              {line.map((token, tokenIdx) => (
                <span key={tokenIdx} className={tokenClass[token.kind]}>
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
}
```

**Why pre-tokenized lines instead of a parser:**
We control the few code snippets we render. Hand-tokenizing them is ~40 lines of data; bringing in Shiki / Prism would add a megabyte to the bundle and runtime parsing for zero added value at this scale.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/CodeBlock.tsx
git commit -m "feat: add CodeBlock UI primitive with token-based highlighting"
```

---

### Task 13: `Badge` component

**Files:**
- Create: `components/ui/Badge.tsx`

- [ ] **Step 1: Write the file**

```tsx
import type { SkillLevel } from "@/types";

type BadgeVariant = "level" | "tag" | "muted";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  level?: SkillLevel;
};

const levelStyles: Record<SkillLevel, string> = {
  advanced: "border-accent-green/40 text-accent-green",
  intermediate: "border-border text-fg",
  beginner: "border-border-subtle text-fg-muted",
};

const variantStyles: Record<BadgeVariant, string> = {
  level: "",
  tag: "border-border text-fg",
  muted: "border-border-subtle text-fg-muted",
};

export function Badge({ label, variant = "tag", level }: BadgeProps) {
  const style =
    variant === "level" && level ? levelStyles[level] : variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center rounded-md border bg-bg-surface px-2.5 py-1 font-mono text-xs ${style}`}
    >
      {label}
      {variant === "level" && level ? (
        <span className="ml-2 text-fg-muted">· {level}</span>
      ) : null}
    </span>
  );
}
```

**Why color + text for level (not color alone):**
Color-only signals fail color-blind users (~8% of men). Showing "advanced" / "intermediate" / "beginner" as text alongside the color keeps WCAG-AA compliant.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Badge.tsx
git commit -m "feat: add Badge UI primitive with skill-level variants"
```

---

### Task 14: `Avatar` component

**Files:**
- Create: `components/ui/Avatar.tsx`

- [ ] **Step 1: Write the file**

```tsx
type AvatarProps = {
  src: string;
  alt: string;
  status?: "online";
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-28 w-28",
};

export function Avatar({ src, alt, status, size = "md" }: AvatarProps) {
  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full border-2 border-border object-cover"
      />
      {status === "online" ? (
        <span
          aria-label="Available for work"
          className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-bg-base bg-accent-green"
        />
      ) : null}
    </div>
  );
}
```

**Why `<img>` and not `<Image>` from `next/image`:**
With `output: 'export'` + `images: { unoptimized: true }`, `next/image` provides no benefit (no server-side optimization). A plain `<img>` is simpler and works identically.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/Avatar.tsx
git commit -m "feat: add Avatar UI primitive with optional online status"
```

---

### Task 15: `SectionHeader` component

**Files:**
- Create: `components/ui/SectionHeader.tsx`

- [ ] **Step 1: Write the file**

```tsx
type SectionHeaderProps = {
  comment: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ comment, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="mb-10">
      <div className="font-mono text-sm text-fg-muted">{comment}</div>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-prose text-fg-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6 h-px w-12 bg-border" aria-hidden />
    </header>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SectionHeader.tsx
git commit -m "feat: add SectionHeader UI primitive"
```

---

### Task 16: Inline SVG icon components

**Files:**
- Create: `components/icons/EmailIcon.tsx`
- Create: `components/icons/LinkedInIcon.tsx`
- Create: `components/icons/LocationIcon.tsx`
- Create: `components/icons/PhoneIcon.tsx`
- Create: `components/icons/GitHubIcon.tsx`
- Create: `components/icons/index.ts`

- [ ] **Step 1: Write `EmailIcon.tsx`**

```tsx
export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
```

- [ ] **Step 2: Write `LinkedInIcon.tsx`**

```tsx
export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.55 0h4.37v1.91h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7v7.46h-4.55v-6.62c0-1.58-.03-3.61-2.2-3.61-2.2 0-2.54 1.72-2.54 3.49V22H7.77V8z" />
    </svg>
  );
}
```

- [ ] **Step 3: Write `LocationIcon.tsx`**

```tsx
export function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
```

- [ ] **Step 4: Write `PhoneIcon.tsx`**

```tsx
export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
```

- [ ] **Step 5: Write `GitHubIcon.tsx`**

```tsx
export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.07c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.27-1.7-1.27-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.17 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
```

- [ ] **Step 6: Write `components/icons/index.ts` barrel export**

```ts
export { EmailIcon } from "./EmailIcon";
export { LinkedInIcon } from "./LinkedInIcon";
export { LocationIcon } from "./LocationIcon";
export { PhoneIcon } from "./PhoneIcon";
export { GitHubIcon } from "./GitHubIcon";
```

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add components/icons/
git commit -m "feat: add inline SVG icon components"
```

---

### Task 17: `ProjectCard` component (discriminated union narrowing)

**Files:**
- Create: `components/ui/ProjectCard.tsx`

- [ ] **Step 1: Write the file**

```tsx
import type { Project } from "@/types";
import { Badge } from "./Badge";
import { GitHubIcon } from "@/components/icons";

type ProjectCardProps = { project: Project };

export function ProjectCard({ project }: ProjectCardProps) {
  if (project.type === "demo-repo") {
    return (
      <article className="flex h-full flex-col rounded-lg border border-border bg-bg-surface p-6 transition hover:border-fg-muted">
        <header className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-mono text-lg font-semibold text-fg">
            <span className="mr-2 text-accent-green" aria-hidden>
              ▣
            </span>
            {project.title}
          </h3>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub repository for ${project.title}`}
            className="flex-shrink-0 text-fg-muted transition hover:text-fg"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        </header>

        <p className="mb-4 text-sm text-fg-muted">{project.description}</p>

        <ul className="mb-4 list-none space-y-1 text-sm text-fg">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-accent-green" aria-hidden>
                ›
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {project.tech.map((t) => (
            <Badge key={t} label={t} variant="tag" />
          ))}
        </div>
      </article>
    );
  }

  // project.type === "case-study" — narrowed by TS
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-bg-surface p-6 transition hover:border-fg-muted">
      <header className="mb-3 flex items-center gap-3">
        <Badge label={project.industry} variant="muted" />
        <span className="font-mono text-xs text-fg-subtle">
          {project.duration}
        </span>
      </header>

      <h3 className="mb-3 text-lg font-semibold text-fg">{project.title}</h3>
      <p className="mb-4 text-sm text-fg-muted">{project.description}</p>

      <ul className="mb-4 space-y-1">
        {project.metrics.map((m) => (
          <li
            key={m}
            className="font-mono text-sm text-accent-green"
          >
            → {m}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {project.techUsed.map((t) => (
          <Badge key={t} label={t} variant="tag" />
        ))}
      </div>

      <footer className="mt-4 border-t border-border-subtle pt-3 text-xs text-fg-subtle">
        Anonymized — details available on request.
      </footer>
    </article>
  );
}
```

**Why the `if (project.type === "demo-repo")` pattern:**
TypeScript narrows the union — inside the `if` block, `project.githubUrl` is accessible because TS knows it's a `DemoRepo`. After the `if`, it knows `project` must be `CaseStudy`, so `project.metrics` is accessible without optional chaining.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/ProjectCard.tsx
git commit -m "feat: add ProjectCard with discriminated-union rendering"
```

---

### Task 18: `NavBar` component (Client Component)

**Files:**
- Create: `components/ui/NavBar.tsx`

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-mono text-sm text-fg hover:text-accent-green"
        >
          jakubruniecki
        </a>

        {/* Desktop nav */}
        <ul className="hidden gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-sm text-fg-muted transition hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green rounded p-1"
        >
          <span className="font-mono text-lg">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <ul
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-border bg-bg-surface px-6 py-3 md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-mono text-sm text-fg-muted transition hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
```

**Why `"use client"` at the top:**
This component uses `useState` (browser-only). The directive opts this single file into Client Component rendering — the rest of the app stays Server Components. Keeping the boundary tight = smaller JS bundle.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/NavBar.tsx
git commit -m "feat: add NavBar with mobile menu toggle"
```

---

## Phase 3 — Sections

### Task 19: `Hero` section

**Files:**
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { profile } from "@/data/profile";
import { cvRequestHref } from "@/data/contact";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { CodeBlock, type CodeLine } from "@/components/ui/CodeBlock";
import { Avatar } from "@/components/ui/Avatar";

function buildBioLines(): ReadonlyArray<CodeLine> {
  // Hand-tokenized representation of:
  //   const me = {
  //     name: 'Jakub Runiecki',
  //     role: 'Senior QA Engineer',
  //     focus: 'Manual leadership + Playwright automation',
  //     years: 5,
  //     openToWork: true,
  //   };
  return [
    [
      { kind: "keyword", text: "const" },
      { kind: "plain", text: " " },
      { kind: "ident", text: "me" },
      { kind: "plain", text: " " },
      { kind: "keyword", text: "=" },
      { kind: "punct", text: " {" },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "name" },
      { kind: "punct", text: ": " },
      { kind: "string", text: `'${profile.name}'` },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "role" },
      { kind: "punct", text: ": " },
      { kind: "string", text: `'${profile.role}'` },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "focus" },
      { kind: "punct", text: ": " },
      { kind: "string", text: `'${profile.tagline}'` },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "years" },
      { kind: "punct", text: ": " },
      { kind: "number", text: String(profile.yearsOfExperience) },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "openToWork" },
      { kind: "punct", text: ": " },
      { kind: "boolean", text: String(profile.status === "open-to-work") },
      { kind: "punct", text: "," },
    ],
    [{ kind: "punct", text: "};" }],
  ];
}

export function Hero() {
  const lines = buildBioLines();

  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pt-20">
      <WindowChrome title="portfolio.ts">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <Avatar
            src="/photo.jpg"
            alt={`${profile.name}, ${profile.role}`}
            status="online"
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <CodeBlock lines={lines} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={cvRequestHref}
            className="rounded-md bg-accent-green/15 px-4 py-2 font-mono text-sm text-accent-green ring-1 ring-accent-green/30 transition hover:bg-accent-green/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          >
            ✉ Request CV
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-4 py-2 font-mono text-sm text-fg transition hover:border-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          >
            Contact →
          </a>
        </div>
      </WindowChrome>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: add Hero section with TS-object bio and CTAs"
```

---

### Task 20: `About` section

**Files:**
- Create: `components/sections/About.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// about.ts" title="About" />

      <div className="max-w-prose space-y-4 text-fg">
        {profile.bio.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed text-fg-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Badge label={`${profile.yearsOfExperience} years`} variant="tag" />
        {profile.experienceBreakdown.map((item) => (
          <Badge key={item} label={item} variant="muted" />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/About.tsx
git commit -m "feat: add About section"
```

---

### Task 21: `Skills` section

**Files:**
- Create: `components/sections/Skills.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { skills } from "@/data/skills";
import type { Skill, SkillCategory } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const categoryLabels: Record<SkillCategory, string> = {
  automation: "Automation",
  manual: "Manual & QA process",
  tools: "Tools",
};

const categoryOrder: ReadonlyArray<SkillCategory> = [
  "automation",
  "manual",
  "tools",
];

function groupByCategory(
  list: ReadonlyArray<Skill>
): Record<SkillCategory, ReadonlyArray<Skill>> {
  const empty: Record<SkillCategory, Array<Skill>> = {
    automation: [],
    manual: [],
    tools: [],
  };
  for (const skill of list) {
    empty[skill.category].push(skill);
  }
  return empty;
}

export function Skills() {
  const grouped = groupByCategory(skills);

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// skills.ts" title="Skills" />

      <div className="space-y-8">
        {categoryOrder.map((cat) => (
          <div key={cat}>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-fg-muted">
              {categoryLabels[cat]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {grouped[cat].map((skill) => (
                <Badge
                  key={skill.name}
                  label={skill.name}
                  variant="level"
                  level={skill.level}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Skills.tsx
git commit -m "feat: add Skills section grouped by category"
```

---

### Task 22: `Projects` section

**Files:**
- Create: `components/sections/Projects.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// projects.ts" title="Projects" />

      <div className="grid gap-6 auto-rows-fr lg:grid-cols-2">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </section>
  );
}
```

**Why `key={idx}` here:**
Project data is a static, never-reordered list at build time, so the index is a stable key. If projects became user-sortable or filterable in v2, switch to a real id field.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Projects.tsx
git commit -m "feat: add Projects section with 2-column grid"
```

---

### Task 23: `Contact` section + footer

**Files:**
- Create: `components/sections/Contact.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { contactLinks } from "@/data/contact";
import type { ContactIcon } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  EmailIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";

const iconMap: Record<
  ContactIcon,
  (props: { className?: string }) => React.JSX.Element
> = {
  email: EmailIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// contact.ts" title="Let's talk" />

      <p className="mb-8 max-w-prose text-fg-muted">
        Open to international remote QA roles. Full CV available on request —
        drop me an email or message on LinkedIn.
      </p>

      <ul className="space-y-3">
        {contactLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const isExternal = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group inline-flex items-center gap-3 text-fg transition hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green rounded"
              >
                <Icon className="h-5 w-5 text-fg-muted transition group-hover:text-accent-green" />
                <span className="font-mono text-sm">{link.value}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <footer className="mt-16 border-t border-border-subtle pt-6 text-sm text-fg-subtle">
        <p>© 2026 {`${"Jakub Runiecki"}`} · Built with Next.js</p>
      </footer>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat: add Contact section with icon links and footer"
```

---

### Task 24: Compose page in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` content**

```tsx
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 2: Add `NavBar` to `app/layout.tsx`**

In `app/layout.tsx`, import `NavBar` and add it inside `<body>` above `{children}`:

```tsx
import { NavBar } from "@/components/ui/NavBar";
// ...
<body className="bg-bg-base text-fg font-sans antialiased">
  <NavBar />
  {children}
</body>
```

- [ ] **Step 3: Add placeholder photo**

Until the real `public/photo.jpg` is provided, drop a 800×800 placeholder there so the Hero `<img>` resolves. Quick way: download any solid-color PNG from `https://placehold.co/800x800/161b22/7d8590.png?text=photo` and save as `public/photo.jpg`.

- [ ] **Step 4: Run dev server, verify the page renders**

Run: `npm run dev`
Open `http://localhost:3000`.
Expected: Hero with window-chrome, avatar, code block, two CTAs. Scroll down: About, Skills (grouped), Projects (2 cards), Contact. Sticky NavBar at top works on desktop and mobile (resize browser to test).

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx public/photo.jpg
git commit -m "feat: compose homepage and mount NavBar in root layout"
```

---

## Phase 4 — SEO, OG image, favicon

### Task 25: Richer metadata in `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Expand the `metadata` export**

Replace the existing `metadata` export with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://jakubruniecki.vercel.app"),
  title: {
    default: "Jakub Runiecki — Senior QA Engineer",
    template: "%s · Jakub Runiecki",
  },
  description:
    "Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
  openGraph: {
    title: "Jakub Runiecki — Senior QA Engineer",
    description:
      "Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
    url: "/",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakub Runiecki — Senior QA Engineer",
    description:
      "Senior QA Engineer · Manual leadership + Playwright automation · 5 years.",
  },
  robots: { index: true, follow: true },
};
```

**Why `metadataBase`:**
Without it, Next.js can't produce absolute URLs for OG images and warns at build. The Vercel subdomain is the canonical URL until a custom domain lands.

- [ ] **Step 2: Run build, verify no metadata warnings**

Run: `npm run build`
Expected: build succeeds; no warning about `metadataBase`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: expand metadata with OpenGraph and Twitter cards"
```

---

### Task 26: Build-time OG image

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jakub Runiecki — Senior QA Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#3fb950",
            fontSize: 24,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              background: "#3fb950",
              borderRadius: 999,
            }}
          />
          AVAILABLE FOR REMOTE ROLES
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          Jakub Runiecki
        </div>
        <div style={{ fontSize: 36, color: "#7d8590", marginTop: 16 }}>
          Senior QA Engineer · Manual + Playwright automation
        </div>
        <div style={{ fontSize: 24, color: "#7d8590", marginTop: 40 }}>
          jakubruniecki.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Note on `export const runtime = "edge"`:**
Next.js's `ImageResponse` requires the edge runtime. With `output: "export"`, the OG image is rendered once at build time and dumped to a static `.png` — the "edge" tag is just the renderer hint.

- [ ] **Step 2: Run build, verify image generates**

Run: `npm run build`
Expected: `out/opengraph-image.png` exists (or similar path). Open the file to visually verify it's a 1200×630 dark image with name and tagline.

- [ ] **Step 3: Commit**

```bash
git add app/opengraph-image.tsx
git commit -m "feat: add build-time OpenGraph image generator"
```

---

### Task 27: Favicon

**Files:**
- Replace: `app/favicon.ico`

- [ ] **Step 1: Generate a simple favicon**

Visit `https://favicon.io/favicon-generator/` and produce a favicon with:
- Text: `▌` (block cursor) or `>` (terminal prompt)
- Background: `#0d1117`
- Foreground: `#3fb950`
- Font: any monospace

Download the package and replace `app/favicon.ico` with the generated file. Optionally place the additional sizes (`favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`) into `app/` — Next.js picks them up automatically by filename.

- [ ] **Step 2: Verify in browser**

Run: `npm run dev`
Open `http://localhost:3000`. Expected: terminal-themed favicon in the browser tab.

- [ ] **Step 3: Commit**

```bash
git add app/favicon.ico app/*.png
git commit -m "feat: add terminal-themed favicon"
```

---

## Phase 5 — Quality pass

### Task 28: Responsive QA pass

**Files:**
- Modify: any section file as needed

- [ ] **Step 1: Test mobile breakpoint (375px width)**

In Chrome DevTools, switch to mobile emulation (iPhone SE / 375px width). Open `http://localhost:3000` and verify:
- NavBar hamburger appears; clicking it reveals the menu; clicking a link scrolls and closes the menu
- Hero stacks vertically: avatar above code block (not beside)
- Code block doesn't horizontally overflow (test by reading the longest string line)
- Projects grid becomes 1 column
- Contact links don't truncate

If anything fails, adjust the offending component's Tailwind responsive classes (e.g. `flex-col sm:flex-row`).

- [ ] **Step 2: Test tablet breakpoint (768px width)**

Verify:
- NavBar shows inline links (hamburger hidden)
- Hero is side-by-side
- Projects grid: still 1 column (becomes 2 at `lg` which is 1024px)

- [ ] **Step 3: Test desktop (1280px+)**

Verify all sections look intentional — no excessive whitespace, no awkward text wrapping.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive adjustments after mobile QA pass"
```

If no fixes were needed, skip this commit.

---

### Task 29: Accessibility audit

**Files:**
- Modify: any component as needed

- [ ] **Step 1: Run axe DevTools (browser extension)**

Install `axe DevTools` Chrome extension. Open `http://localhost:3000`, open DevTools → axe tab → "Scan ALL of my page".

Expected: 0 critical or serious violations. Common findings and fixes:
- Missing `aria-label` on icon-only links → already addressed in Tasks 17, 23, 18.
- Insufficient contrast → unlikely with the chosen palette but verify.
- Missing `lang` on `<html>` → already set in Task 5.

Fix any reported issues in the corresponding components.

- [ ] **Step 2: Keyboard navigation test**

Close the mouse trackpad. Press `Tab` repeatedly from a fresh page load. Verify:
- Focus ring visible on every interactive element (NavBar links, CTA buttons, project repo links, contact links)
- `Enter` activates each link
- `Shift+Tab` walks backward correctly

If any element lacks a focus ring, ensure its class list includes `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green`.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: accessibility adjustments after a11y audit"
```

If no fixes were needed, skip this commit.

---

### Task 30: Lighthouse audit

**Files:**
- Any component as needed for fixes

- [ ] **Step 1: Production-build Lighthouse run**

Run:
```bash
npm run build
npx serve out -p 5000
```

In a new terminal: open Chrome → `http://localhost:5000` → DevTools → Lighthouse → "Analyze page load" in **Desktop** mode with **Performance / Accessibility / Best Practices / SEO** categories enabled.

Expected:
- Performance ≥ 95
- Accessibility ≥ 95
- Best Practices = 100
- SEO = 100

Common drops and fixes:
- LCP slow → make sure photo isn't huge; aim for <100KB JPG.
- CLS > 0 → `<img>` needs `width`/`height` attributes or a reserved aspect ratio.
- Missing meta description → already added in Task 25.

- [ ] **Step 2: Run on mobile profile too**

Repeat with **Mobile** mode. Targets unchanged.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "perf: optimizations after Lighthouse audit"
```

If no fixes were needed, skip this commit.

---

## Phase 6 — CI and deployment

### Task 31: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Add lint script to `package.json`**

Confirm `package.json` `scripts` block has all of these (add missing):

```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 2: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml package.json
git commit -m "ci: add GitHub Actions workflow for lint, typecheck, build"
```

---

### Task 32: README

**Files:**
- Create or replace: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Jakub Runiecki — Portfolio

Personal portfolio website at https://jakubruniecki.vercel.app.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. Statically exported and hosted on Vercel.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint
npm run build        # outputs to ./out
```

## Project layout

- `app/` — Next.js routes, layout, global styles, OG image generator
- `components/sections/` — full-page sections (Hero, About, Skills, Projects, Contact)
- `components/ui/` — reusable primitives (WindowChrome, CodeBlock, Badge, etc.)
- `components/icons/` — inline SVG icon components
- `data/` — typed content (profile, skills, projects, contact)
- `types/` — shared TypeScript types

## License

All content (text, photo) © Jakub Runiecki. Code structure is for personal reference and not licensed for reuse.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add project README"
```

---

### Task 33: Connect to GitHub and Vercel

**Files:**
- (Manual / external steps — no code)

- [ ] **Step 1: Create a public GitHub repository**

Go to `https://github.com/new`. Repository name: `jakubruniecki` or `portfolio`. **Public** (needed for free Vercel hobby deploys + so the codebase is part of the portfolio signal). No README / .gitignore / license (we already have them).

- [ ] **Step 2: Push existing commits**

```bash
git remote add origin git@github.com:<your-username>/<repo>.git
git push -u origin main
```

Verify on GitHub: commits visible, `.github/workflows/ci.yml` triggered a build. Wait ~1 minute for the green check on the latest commit.

- [ ] **Step 3: Connect to Vercel**

Go to `https://vercel.com/new`. "Import Git Repository" → select the repo. Framework preset: **Next.js** (auto-detected). Leave all defaults. Click **Deploy**.

Wait ~1 minute. Vercel shows the deployed URL — typically `https://<repo-name>-<random>.vercel.app`. To get a cleaner subdomain, go to project Settings → Domains → add `jakubruniecki.vercel.app` (if available) or pick another simple subdomain.

- [ ] **Step 4: Verify production**

Open the Vercel URL. Expected: full site renders identically to local. Test:
- All anchor links scroll correctly
- "Request CV" button opens email client with the pre-filled subject
- LinkedIn link opens in new tab
- Mobile NavBar works (test on actual phone if possible)

- [ ] **Step 5: Add CI badge to README**

Edit the top of `README.md` to include:

```markdown
[![CI](https://github.com/<your-username>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-username>/<repo>/actions/workflows/ci.yml)
```

Replace `<your-username>` and `<repo>` with the real values.

- [ ] **Step 6: Commit and push**

```bash
git add README.md
git commit -m "docs: add CI badge to README"
git push
```

Vercel auto-deploys; the production URL reflects the change within ~60 seconds.

---

### Task 34: Final pre-launch checklist

**Files:**
- (Review-only — no code)

- [ ] **Step 1: Replace remaining content placeholders**

Verify these files no longer contain placeholder values:
- `data/profile.ts` — `bio` reads as you want it to read
- `data/contact.ts` — `LINKEDIN_URL`, `PHONE` are real (or Phone link removed)
- `data/projects.ts` — `githubUrl` points to a real public repo; at least 1 demo-repo + 1 case study; ideally 4–6 total
- `public/photo.jpg` — actual professional photo, not placeholder

- [ ] **Step 2: Run the full local check sequence**

```bash
npm run lint
npm run typecheck
npm run build
```

All three green.

- [ ] **Step 3: Re-run Lighthouse on production URL**

Open the live URL, run Lighthouse (Desktop + Mobile). Confirm scores still meet targets.

- [ ] **Step 4: Share on LinkedIn (the actual goal)**

Post on LinkedIn: short text + link to the site. This is the "launch."

- [ ] **Step 5: Final commit if anything was tweaked**

```bash
git add -A
git commit -m "content: finalize launch content"
git push
```

---

## Out of scope (deferred — see spec sections 13)

- Custom domain (post-launch v1.1)
- Vercel Analytics (v1.1)
- Animations (v2)
- Light mode toggle (v2)
- Blog / MDX (v2)
- Testimonials (v2)
- Calendly link (v2)
- Lighthouse-in-CI (v2 if site grows)
- Playwright tests against this site (explicitly excluded — see spec section 6 / 7)

---

## Plan self-review notes

- **Spec coverage**: every spec section (5 through 13) maps to at least one task. Section 14 (open content gaps) is tracked as Task 34 step 1.
- **Placeholder scan**: code in every step is complete and runnable; "TODO/TBD" only appears as data-file placeholders that are explicitly called out for owner content (LinkedIn URL, phone, real GitHub URL, final bio copy).
- **Type consistency**: `Profile.bio` is `ReadonlyArray<string>` in Task 6, consumed by `bio.map(...)` in Task 20 (About). `Project` discriminated union defined in Task 6, narrowed in `ProjectCard` (Task 17). `SkillCategory` defined in Task 6, used as record key in Task 21 (Skills). `ContactIcon` defined in Task 6, used as map key in Task 23 (Contact).
- **Commit cadence**: every task ends with a commit; commits use Conventional Commits format (`feat:`, `chore:`, `docs:`, `fix:`, `perf:`, `ci:`).
