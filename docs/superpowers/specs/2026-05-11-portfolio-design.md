# Portfolio Website — Design Specification

**Author:** Jakub Runiecki
**Date:** 2026-05-11
**Status:** Approved (pending user final review)

---

## 1. Overview

A single-page personal portfolio website positioning Jakub Runiecki for international remote roles as a **Senior QA Engineer** with hybrid manual + automation profile. Built as a learning project in Next.js + React + TypeScript.

Live URL (MVP): `https://jakubruniecki.vercel.app`
Custom domain (post-MVP): TBD — `jakubruniecki.dev` recommended.

---

## 2. Goals & non-goals

### Goals

- Convert a recruiter visit into a contact action (email or LinkedIn message) within **30 seconds** of landing.
- Signal hybrid Senior QA positioning: manual leadership + Playwright automation.
- Demonstrate engineering quality through the website itself (Lighthouse ≥95, accessible, fast, clean code).
- Serve as Jakub's first hands-on Next.js + React + TypeScript project (learning investment, explicitly scoped at user request).

### Non-goals

- Not a blog (no posts in MVP; deferred to v2).
- Not multilingual (English only).
- Not a freelance services site (no pricing, no service packages).
- Not a public CV host (CV delivered on request, not as a downloadable PDF).
- Not animated in MVP (animations deferred to v2).
- Not self-tested with Playwright (user explicitly excluded this scope).

---

## 3. Audience & positioning

**Primary audience:** International recruiters (technical and HR) sourcing remote QA hires.

**Positioning headline:** *Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles*

**Tone:** Confident, concise, engineer-native. Dark/terminal visual language signals "I live in code" without sacrificing readability.

---

## 4. Sections — MVP scope

Single-page scroll layout. Five sections, in order:

1. **Hero** — window-chrome IDE frame, round avatar with green online dot, TypeScript-object bio, two CTAs (Request CV / Contact).
2. **About** — two paragraphs (~80–120 words total) plus experience badges (years, manual/automation split, industries).
3. **Skills** — badges grouped by category (Automation / Manual / Tools); each badge encodes skill level via color + text.
4. **Projects** — 4–6 cards mixing two visual types: **demo-repo** (GitHub link, tech stack, highlights) and **case-study** (anonymized, metrics-driven, no link).
5. **Contact** — vertical list of links (email, LinkedIn, location, phone) plus the line *"Full CV available on request — drop me an email or message on LinkedIn."* Footer line included in same section.

Sections explicitly excluded from MVP: Experience timeline (covered by CV-on-request), Testimonials, Blog, dedicated CV page.

---

## 5. Visual design direction

**Style:** Developer / Terminal — direction B from brainstorm.

**Palette (dark theme, GitHub-dark inspired):**

- Background: `#0d1117` (zinc-950 / GitHub canvas-default)
- Surface: `#161b22` (window-chrome bar)
- Border: `#30363d`
- Text primary: `#e6edf3`
- Text muted: `#7d8590`
- Accent (status / success / "available"): `#3fb950` (emerald)
- Accent (links / TS keywords): `#79c0ff`
- Accent (strings in syntax highlighting): `#a5d6ff`
- Accent (keywords like `const`): `#ff7b72`

**Typography:**

- Body / UI sans-serif: **Inter** (`next/font/google`)
- Monospace / code / accents: **JetBrains Mono** (`next/font/google`)

**Hero layout (variant C2):**

A `WindowChrome` wrapper with three stoplight dots (red/yellow/green) and a `portfolio.ts` title bar. Inside: round avatar (`Avatar` component) with a green online-status dot, beside a `CodeBlock` rendering Jakub's bio as a TypeScript object. Two CTAs sit below the code block:

- `Request CV ✉` — `mailto:` with pre-filled subject and body template.
- `Contact →` — anchor link to `#contact`.

Hero height: ~85vh (intentional "peek" of the next section under the fold).

---

## 6. Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** | User's chosen learning target; modern standard |
| Language | **TypeScript** (`strict: true`, `noUncheckedIndexedAccess: true`) | Already familiar from Playwright; enforces content integrity |
| UI | **React 19** (mostly Server Components) | Bundled with Next.js |
| Styling | **Tailwind CSS** | User-chosen; de-facto standard with Next.js |
| Build mode | **Static export** (`output: 'export'`) | Portfolio is fully static; CDN-friendly; cheap to host |
| Hosting | **Vercel** (hobby plan, free) | Native for Next.js; GitHub auto-deploy; free preview deploys |
| Domain | Vercel subdomain at MVP → custom domain at v1.1 | Ship fast, polish later |
| CI | **GitHub Actions** (lint + typecheck + build only) | Catches PR-breaking changes pre-deploy |
| Fonts | `next/font/google` (Inter, JetBrains Mono) | Self-hosted, zero CLS, no external requests |
| Icons | Inline SVG (no library) | Zero dependency; full control |

**Excluded (explicit):** shadcn/ui (user picked plain Tailwind), MDX (not needed without blog), syntax-highlighting library (`CodeBlock` uses pre-tokenized data in MVP), animation libraries (`framer-motion` etc.), analytics (not needed in MVP), Husky pre-commit hooks (user declined).

---

## 7. Repository structure

```
jakubruniecki/
├── app/
│   ├── layout.tsx              # root layout: <html>, <body>, fonts, global meta
│   ├── page.tsx                # composes sections in order
│   ├── globals.css             # Tailwind directives + CSS variables
│   ├── opengraph-image.tsx     # auto-generated OG image (1200×630)
│   └── favicon.ico
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── WindowChrome.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── Badge.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Avatar.tsx
│   │   ├── SectionHeader.tsx
│   │   └── NavBar.tsx
│   └── icons/                  # inline SVG components (LinkedIn, GitHub, email, location, phone)
├── data/
│   ├── profile.ts
│   ├── skills.ts
│   ├── projects.ts
│   └── contact.ts
├── types/
│   └── index.ts                # Profile, Skill, Project, ContactLink types
├── lib/
│   └── seo.ts
├── public/
│   ├── photo.jpg               # ~800×800px, neutral background
│   └── og-fallback.png         # optional fallback for OG image
├── .github/
│   └── workflows/
│       └── ci.yml              # lint + typecheck + build
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .gitignore                  # node_modules, .next, out, .env*, .vercel, .superpowers
├── .env.example                # placeholder (no env vars in MVP)
└── README.md
```

**Single-responsibility note:** `data/` is the single source of truth for all content; `components/sections/` only render. To update content (new project, changed skill), edit one file in `data/`.

---

## 8. Data model (TypeScript types)

```ts
// types/index.ts

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  status: "open-to-work" | "employed" | "freelance";
  yearsOfExperience: number;
  experienceBreakdown: string;
  cvDelivery: "on-request" | "public-pdf";   // toggle for future flexibility
};

export type SkillCategory = "automation" | "manual" | "tools" | "soft";
export type SkillLevel = "advanced" | "intermediate" | "beginner";

export type Skill = {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  yearsUsed?: number;
};

export type ProjectType = "demo-repo" | "case-study";

export type DemoRepo = {
  type: "demo-repo";
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl?: string;
  highlights: string[];
  status: "active" | "archived";
};

export type CaseStudy = {
  type: "case-study";
  title: string;
  industry: string;
  role: string;
  duration: string;
  description: string;
  metrics: string[];
  techUsed: string[];
};

export type Project = DemoRepo | CaseStudy;   // discriminated union

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: "email" | "linkedin" | "location" | "phone";
};
```

**Why this shape:**

- `Project` is a discriminated union — TS narrows correctly inside `if (project.type === "case-study")`.
- `status` and `cvDelivery` are literal unions — adding a new value forces refactor of consumers (refactor-safety).
- Optional fields (`yearsUsed?`, `liveUrl?`) make minimum-vs-nice-to-have explicit; missing required fields fail compilation.

---

## 9. Component breakdown

### UI primitives (`components/ui/`)

| Component | RSC / CC | Props | Responsibility |
|---|---|---|---|
| `NavBar` | CC | – | Sticky top nav; anchor links; mobile hamburger menu (uses `useState`) |
| `WindowChrome` | RSC | `title?`, `children` | Stoplight dots + title bar wrapper |
| `CodeBlock` | RSC | `lines: TokenizedLine[]`, `language?: "ts"` | Static syntax-highlighted code block |
| `Badge` | RSC | `label`, `variant?: "level" \| "tag"`, `level?: SkillLevel` | Pill for skills and tech tags |
| `ProjectCard` | RSC | `project: Project` | Renders demo-repo vs case-study using discriminated-union narrowing |
| `Avatar` | RSC | `src`, `alt`, `status?: "online"` | Round photo + optional status dot |
| `SectionHeader` | RSC | `label`, `title`, `subtitle?` | Consistent header (`// section.ts` comment + heading) |

### Sections (`components/sections/`)

| Component | RSC / CC | Data source |
|---|---|---|
| `Hero` | RSC | `data/profile.ts` |
| `About` | RSC | `data/profile.ts` |
| `Skills` | RSC | `data/skills.ts` |
| `Projects` | RSC | `data/projects.ts` |
| `Contact` | RSC | `data/contact.ts` |

### Layout (`app/`)

| File | RSC / CC | Responsibility |
|---|---|---|
| `layout.tsx` | RSC | `<html lang="en">`, body classes, font loading, global meta, `<NavBar>` |
| `page.tsx` | RSC | Composes Hero → About → Skills → Projects → Contact in order |

**Server vs Client discipline:** Only `NavBar` is a Client Component (needs mobile-menu state). All other components are Server Components, rendered to static HTML at build time. No client-side JS for content rendering in MVP.

---

## 10. Section specifications

### 10.1 Hero

- `WindowChrome title="portfolio.ts"` wrapping all content.
- Left/top: round `Avatar` with `status="online"` and green dot.
- Center/right: `CodeBlock` rendering bio as `const me = { name, role, focus, years, openToWork: true };`.
- Below code: two CTAs:
  - **Request CV ✉** → `mailto:jakubruniecki@gmail.com?subject=CV%20Request%20—%20[Your%20Company]&body=...` (pre-filled template).
  - **Contact →** → anchor `#contact`.
- Height: ~85vh, with visible peek of About section under fold.

### 10.2 About

- `SectionHeader` with `label="// about.ts"`, `title="About"`.
- Two paragraphs (~80–120 words total): who I am + my approach to quality.
- Below paragraphs: badge row showing `5 years`, `3.5y manual`, `1.5y automation`, `Fintech & E-commerce` (sourced from `profile.experienceBreakdown` and related fields).
- Max content width: `65ch` for readability.
- **Open content TODO:** final About copy to be written collaboratively before implementation.

### 10.3 Skills

- `SectionHeader` with `label="// skills.ts"`, `title="Skills"`.
- Skills grouped by `category` (Automation, Manual, Tools), each group preceded by a small uppercase label.
- Each skill rendered as a `Badge` with name + level.
- Level encoded by **both** color and text (color-blind safety):
  - `advanced` → emerald accent + "advanced" label
  - `intermediate` → neutral zinc + "intermediate" label
  - `beginner` → muted zinc + "beginner" label
- Target count: ~15–20 skills total.
- **Open content TODO:** finalized skills list with levels.

### 10.4 Projects

- `SectionHeader` with `label="// projects.ts"`, `title="Projects"`.
- 2-column CSS grid (`lg:` and up), 1 column on mobile.
- Cards equal-height (`auto-rows: 1fr`).
- 4–6 cards total, mixing demo-repo and case-study.

**Demo-repo card:**
- Repo icon (▣) + title.
- 2–3 sentence description.
- Tech tags row.
- GitHub link (terminal-style accent).
- Highlights as bullet list (e.g., `30 tests`, `POM pattern`, `CI on every PR`).

**Case-study card:**
- No repo icon; industry badge instead (e.g., `Fintech`).
- Title + 2–3 sentence anonymized description.
- Metrics rendered as prominent visual elements (e.g., `3d → 4h regression`).
- Tech tags row.
- Disclosure footer: `Anonymized — details available on request`.
- No external link.

- **Open content TODO:** 1–2 demo Playwright repositories must be built and published before launch; 2–3 case studies must be drafted.

### 10.5 Contact

- `SectionHeader` with `label="// contact.ts"`, `title="Let's talk"`.
- Lead line: `Open to international remote QA roles. Full CV available on request — drop me an email or message on LinkedIn.`
- Vertical list of links with inline SVG icons:
  - ✉ **Email** — `mailto:jakubruniecki@gmail.com?subject=Hello%20Jakub`
  - **LinkedIn** — `https://linkedin.com/in/...` with `target="_blank" rel="noopener noreferrer"`
  - 📍 **Location** — text-only: `Warsaw, Poland · CET`
  - 📞 **Phone** — `tel:+48...`
- Footer line in same section: `© 2026 Jakub Runiecki · Built with Next.js`.
- **Open content TODO:** confirm exact LinkedIn URL, phone number, decision on phone visibility (recommended: keep in CV PDF only, not on public site).

---

## 11. Build, deploy, hosting

### Build configuration

`next.config.mjs`:

```js
export default {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};
```

### Pipeline

1. `git push origin <branch>` → opens PR.
2. **GitHub Actions** runs `lint`, `typecheck`, `build`. PR cannot merge without green check.
3. **Vercel** auto-deploys preview URL for each PR.
4. Merge to `main` → Vercel auto-deploys to production.

### CI workflow (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

### Branch strategy

- `main` is production.
- Feature work on `feat/*` branches → PR → merge.
- No staging environment; Vercel preview deploys serve that role.

### SEO

In `app/layout.tsx` via Next.js Metadata API: title, description, OpenGraph (type `profile`), Twitter card, `robots: { index: true, follow: true }`, `lang="en"`.

`app/opengraph-image.tsx` generates a 1200×630 OG image at build time from a React component (name, role, green "available" dot in terminal style).

### Repository hygiene

- `.gitignore`: `node_modules`, `.next`, `out`, `.env*`, `.vercel`, `.superpowers`
- Project does not exist as a git repository yet; first task in implementation plan will be `git init` + initial commit.

---

## 12. Quality targets

### Lighthouse (production deploy)

| Category | Target |
|---|---|
| Performance | ≥ 95 |
| Accessibility | ≥ 95 |
| Best Practices | 100 |
| SEO | 100 |

### Core Web Vitals

| Metric | Target |
|---|---|
| LCP | < 1.5s |
| CLS | < 0.05 |
| INP | < 100ms |

### Accessibility (WCAG 2.2 AA minimum)

- Text contrast ratio ≥ 4.5:1 (AA) for body, ≥ 7:1 (AAA) where achievable.
- Keyboard navigation: `<a>` / `<button>` elements with visible `focus-visible:` rings.
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- All meaningful images have descriptive `alt` text.
- Icon-only links have `aria-label`.
- `<html lang="en">`.
- `prefers-reduced-motion` respected (relevant when v2 animations land).
- Skill levels encoded by color + text (not color alone).

### Code quality

- TypeScript: `strict: true`, `noUncheckedIndexedAccess: true`.
- ESLint: `next/core-web-vitals` preset + `eslint-plugin-jsx-a11y`.
- Prettier: 2-space, semicolons, trailing commas.
- No Husky pre-commit hooks (user choice).
- No Lighthouse-in-CI in MVP (manual pre-deploy check).

### Browser support

- Latest 2 versions of Chrome, Edge, Firefox, Safari (desktop and mobile).

### Responsive breakpoints (Tailwind defaults)

- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.
- Hero: column on mobile (avatar above code), row at `md:+`.
- NavBar: hamburger on mobile, inline at `md:+`.
- Projects: 1 column on mobile, 2 columns at `lg:+`.

---

## 13. Roadmap

### MVP — Launch checklist

1. Next.js + TS + Tailwind scaffold.
2. Data files populated (`profile`, `skills`, `projects`, `contact`).
3. UI primitives implemented.
4. All five sections implemented.
5. Responsive layout verified.
6. Meta tags + OG image.
7. Professional photo placed in `/public/photo.jpg`.
8. Favicon.
9. GitHub Actions CI (lint + typecheck + build) green.
10. Vercel project connected, auto-deploy from `main`.
11. README with CI badge and "Built with Next.js" note.
12. Manual Lighthouse audit ≥ targets.

### Content prerequisites (in parallel with implementation)

- 1–2 demo Playwright repositories (public, with English README, CI badge).
- 2–3 anonymized case studies (~200–300 words each, with metrics).
- About copy (2 paragraphs).
- Professional photo (~800×800px, neutral background).
- Finalized skill list with levels.
- Confirmed LinkedIn URL and phone visibility decision.

### v1.1 — Post-launch polish

- Register and connect custom domain (likely `jakubruniecki.dev`).
- Update OG URLs and Vercel custom domain configuration.
- Add Vercel Analytics (free, privacy-friendly).
- Add `sitemap.xml` (less critical for single-page but cheap).

### v2 — Polish features

- Subtle animations (fade-in on scroll, hover states, blinking cursor in Hero).
- Typing animation in Hero (`useState` + `useEffect` to "type" the TS-object).
- Optional light mode toggle.
- Blog (MDX) if/when desired.
- Testimonials section after collecting LinkedIn quotes.
- Calendly link in Contact.
- Lighthouse-in-CI if site complexity grows.

### Explicitly out of scope

- Playwright tests against the portfolio site itself (user excluded).
- Public CV PDF (user opted for on-request delivery).
- MDX content layer in MVP.
- Multilingual content.
- Experience timeline section.
- Contact form (static links only).
- Husky pre-commit hooks.
- Cookie banner / GDPR notice (no cookies / analytics in MVP).

### Realistic timeline

For Jakub's profile (first Next.js + React project): approximately **5–6 weekends end-to-end**.

| Phase | Effort |
|---|---|
| Setup (Next.js, Tailwind, repo, Vercel) | 1 evening |
| React / Next.js learning | 2–3 evenings |
| UI primitives | 1 weekend |
| Hero + About | 1 weekend |
| Skills + Projects + Contact | 1 weekend |
| Polish, responsive, Lighthouse pass | 1 weekend |
| Launch (final checks, deploy, share) | 1 evening |

Content (demo repos, case studies, photo, copy) prepared in parallel.

---

## 14. Open content gaps

These items block launch readiness and must be authored before MVP can ship:

- [ ] **Demo Playwright repository #1** (recommended: ~30 E2E tests against `saucedemo.com` or similar public site, POM pattern, GitHub Actions CI, English README).
- [ ] **Demo Playwright repository #2** (optional but recommended; could be API testing with Postman + Newman, or a small Cypress comparison piece).
- [ ] **Case study #1, #2, #3** — anonymized, ~200–300 words each, with metrics.
- [ ] **About section copy** — two paragraphs (~80–120 words total).
- [ ] **Final skills list** with levels assigned per `SkillLevel`.
- [ ] **Professional photo** — square, ~800×800px, neutral background.
- [ ] **CV (English)** — kept private; ready to send on request.
- [ ] **Confirmed LinkedIn URL.**
- [ ] **Decision on phone visibility** — recommendation: keep in CV PDF only, not on public site.

---

## 15. Decisions log (key choices and rationale)

| Decision | Choice | Rationale |
|---|---|---|
| Primary audience | International recruiters (English-only site) | Wider salary band, remote-friendly market |
| Positioning | Hybrid Senior QA + automation | Most credible for 5y profile (3.5 manual + 1.5 automation) |
| Sections in MVP | Hero, About, Skills, Projects, Contact | Minimal viable; CV PDF & experience deferred to on-request flow |
| Visual style | Developer / Terminal (dark, monospace accents) | Strongest signal for engineering audience; user-aligned |
| Hero variant | C2 — window-chrome + round avatar + TS-object | Balances code-as-bio metaphor with human-trust photo |
| Framework | Next.js (App Router) + React + TypeScript | User's learning investment; modern standard |
| Styling | Tailwind CSS (no shadcn/ui) | Single new tech to learn; full control |
| Hosting | Vercel subdomain at MVP | Ship fast; custom domain post-launch |
| Animations | None in MVP | Defer to v2; keep launch lean |
| Self-testing | No Playwright tests on portfolio site | User-excluded; demo repos serve the proof |
| Content layer | Approach B — TypeScript data files | Type-safe content, separation of concerns, learning value |
| CV delivery | On request via email or LinkedIn | Privacy-first; filters spam recruiters |
| Contact form | Static `mailto:` / `tel:` links | Zero dependencies; matches recruiter workflow |
| CI scope | Lint + typecheck + build only | Catches PR-breaking changes; no over-engineering |

---

## 16. References

- Brainstorm session artifacts: `.superpowers/brainstorm/1835-1778495290/`
- User profile and conventions: `~/.claude/CLAUDE.md`, `~/.claude/rules/playwright-conventions.md`
