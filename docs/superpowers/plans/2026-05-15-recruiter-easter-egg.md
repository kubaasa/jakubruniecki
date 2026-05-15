# Recruiter Easter Egg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plant a hidden, decodable HS256 JWT in a `recruiter_token` cookie set on every page, with a styled `console.log` greeting that points the recruiter at the cookie and `jwt.io`.

**Architecture:** SSG site (`output: "export"`), so everything is client-side. Token is generated **once** offline by a Node script using `jose`, then hardcoded as a constant in a React client component. The component runs a single `useEffect` on mount that writes the cookie and prints the greeting. Wired in `app/layout.tsx` so it loads on every route.

**Tech Stack:** Next.js 16 (SSG), React 19, TypeScript, `jose` (devDependency only — token generator), npm.

**Why no automated tests:** The repo has no test framework (Vitest/Jest absent). Adding one for a side-effect-only component with a hardcoded constant is overkill. Verification is manual: build → open in browser → check DevTools (Application → Cookies, Console) → paste token into jwt.io → verify payload + signature.

---

## File Structure

| Path                                            | Status   | Responsibility                                                                 |
|-------------------------------------------------|----------|--------------------------------------------------------------------------------|
| `scripts/generate-recruiter-token.mjs`          | Create   | One-shot Node script. Builds payload, signs with HS256 via `jose`, prints JWT. |
| `components/RecruiterEasterEgg.tsx`             | Create   | Client component. Sets the cookie + prints styled console greeting. No DOM.    |
| `app/layout.tsx`                                | Modify   | Render `<RecruiterEasterEgg />` once inside `<body>`.                          |
| `package.json`                                  | Modify   | Add `jose` to `devDependencies`.                                               |

The token string lives only in the component file. The script lives in `scripts/` so it does not pollute `app/` or `components/`. `jose` never reaches production bundle (devDependency, only used by the script).

---

## Task 1: Add `jose` and create the token generator script

**Files:**
- Modify: `package.json` (add `jose` to `devDependencies`)
- Create: `scripts/generate-recruiter-token.mjs`

- [ ] **Step 1.1: Install `jose` as a devDependency**

Run from the project root:

```bash
npm install --save-dev jose
```

Expected: `jose` appears in `package.json` under `devDependencies`. `package-lock.json` updates.

- [ ] **Step 1.2: Create the generator script**

Create `scripts/generate-recruiter-token.mjs` with the following content:

```js
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode("the-cake-is-a-lie");

const payload = {
  iss: "jakubruniecki.pl",
  sub: "jakub-bruniecki",
  aud: "curious-recruiter",
  iat: 1747267200,
  exp: 9999999999,
  jti: "ee-001",

  role: "senior-qa-engineer",
  scope: [
    "manual-testing",
    "test-automation",
    "bug-hunting",
    "edge-case-thinking",
  ],

  name: "Jakub Bruniecki",
  location: "Gdańsk, PL → open to remote / EU",
  languages: ["pl", "en"],

  hobbies: [
    "vibe-coding",
    "gym",
    "longboarding",
    "self-development",
    "poker (Texas Hold'em)",
  ],

  preferences: {
    coffee: "z mlekiem, bez cukru ☕",
    os: "Windows",
    theme: "dark-mode-only",
    ide: "VSCode / Cursor",
  },

  proudestBug: {
    where: "telco production",
    impact:
      "horizontal privilege escalation — modify services on customer A's account from customer B's session",
    ageBeforeFound: "2 years",
    lesson: "obvious-looking flows hide the deepest bugs",
  },

  funFact:
    "Spent all of 2025 in Thailand 🇹🇭 — where my girlfriend is from. Highly recommend pad krapow.",

  lookingFor: {
    team: "supportive, motivating, knowledge-sharing",
    project: "interesting product, modern stack, no bikeshedding",
    mode: "remote / hybrid",
  },

  notInTheCV: [
    "soul of the team — at work and after",
    "I overdeliver by default, not on demand",
  ],

  message:
    "If you decoded this — you've got the curiosity I look for in teammates. Let's talk: jakubruniecki@gmail.com",
};

// Build manually so we control `iat` / `exp` exactly (SignJWT's helpers
// would otherwise overwrite them with `Date.now()`-derived values).
const token = await new SignJWT(payload)
  .setProtectedHeader({ alg: "HS256", typ: "JWT" })
  .sign(SECRET);

process.stdout.write(token + "\n");
```

- [ ] **Step 1.3: Run the script and capture the token**

Run:

```bash
node scripts/generate-recruiter-token.mjs
```

Expected: A single line printed to stdout in the form `eyJ...eyJ...<sig>` (3 base64url segments separated by dots). Copy this string — it is the input to Task 2.

Sanity check: paste the output into [jwt.io](https://jwt.io), set "Verify Signature" secret to `the-cake-is-a-lie`, confirm:
- "Signature Verified" indicator is green.
- Decoded payload matches the structure above.

---

## Task 2: Create the `RecruiterEasterEgg` client component

**Files:**
- Create: `components/RecruiterEasterEgg.tsx`

- [ ] **Step 2.1: Create the component file**

Create `components/RecruiterEasterEgg.tsx` with the following content. **Replace `<JWT_FROM_TASK_1>` with the exact string captured in Step 1.3:**

```tsx
"use client";

import { useEffect } from "react";

const RECRUITER_TOKEN = "<JWT_FROM_TASK_1>";

const COOKIE_NAME = "recruiter_token";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function RecruiterEasterEgg() {
  useEffect(() => {
    document.cookie = `${COOKIE_NAME}=${RECRUITER_TOKEN}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;

    console.log(
      [
        "%c👋 Hi there.",
        "%cYou opened DevTools on a portfolio site.",
        "That already says something about you — and we're going to get along.",
        "",
        "%c🍪 There is a cookie called  recruiter_token  in Application → Cookies.",
        "    Paste it into  https://jwt.io  for a personal note.",
        "",
        "— Jakub",
      ].join("\n"),
      "font-size: 18px; font-weight: 700; color: #7dd3fc;",
      "font-size: 13px; color: #cbd5e1;",
      "font-size: 13px; color: #fde68a;",
    );
  }, []);

  return null;
}
```

Note on the `console.log`: the four `%c` markers in the message correspond to the three style argument strings. The first `%c` styles "👋 Hi there.", the second styles the two-line intro, the third styles the cookie hint. Anything after the last `%c` inherits the previous style — the trailing `— Jakub` block keeps the cookie-hint amber tone, which is intentional.

- [ ] **Step 2.2: Typecheck the new file**

Run:

```bash
npm run typecheck
```

Expected: exit code 0, no errors.

---

## Task 3: Wire the component into the root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 3.1: Import and render the component**

In `app/layout.tsx`:

1. Add an import near the top of the file (after the existing `next/font` imports):

```tsx
import { RecruiterEasterEgg } from "@/components/RecruiterEasterEgg";
```

(The project uses path alias `@/*` — confirm by running `grep -n '"@/' tsconfig.json` if unsure; if the alias is not configured, use the relative path `../components/RecruiterEasterEgg`.)

2. Inside the `<body>` element, render `<RecruiterEasterEgg />` immediately before `{children}`:

```tsx
<body className="bg-bg-base text-fg font-sans antialiased md:h-screen md:overflow-hidden">
  <RecruiterEasterEgg />
  {children}
</body>
```

- [ ] **Step 3.2: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: exit code 0, no errors.

- [ ] **Step 3.3: Lint**

Run:

```bash
npm run lint
```

Expected: exit code 0, no warnings or errors related to the new files. (Pre-existing warnings in unrelated files are out of scope — note them but do not fix.)

---

## Task 4: Manual verification (Kuba — required before commit)

**Per Kuba's preference: do NOT commit until he has visually verified the result.**

- [ ] **Step 4.1: Start the dev server**

Run:

```bash
npm run dev
```

Expected: dev server starts, prints local URL (typically `http://localhost:3000`).

- [ ] **Step 4.2: Verify in the browser**

Open `http://localhost:3000` in a browser. Open DevTools (F12).

Check **all four** of the following:

1. **Console tab:** the styled greeting is visible — large blue "Hi there.", grey intro, amber cookie hint. No React or hydration errors.
2. **Application tab → Cookies → `http://localhost:3000`:** a cookie named `recruiter_token` exists. Value is a long string with two `.` separators.
3. **Copy the cookie value** and paste it into [jwt.io](https://jwt.io). Set the verification secret to `the-cake-is-a-lie`. Confirm "Signature Verified" is green.
4. **Decoded payload:** matches the structure from the spec — `name`, `hobbies`, `proudestBug`, `funFact`, `message`, etc.

- [ ] **Step 4.3: Production build sanity check**

Stop the dev server. Run:

```bash
npm run build
```

Expected: build succeeds, exit code 0. No new warnings related to the easter egg files.

- [ ] **Step 4.4: STOP — wait for Kuba's go-ahead**

Do not proceed to Task 5 until Kuba confirms the easter egg works as intended in his browser.

---

## Task 5: Commit

- [ ] **Step 5.1: Stage only the easter-egg files**

There are unrelated modifications in the working tree. Stage **only** the new and modified files for this feature:

```bash
git add package.json package-lock.json scripts/generate-recruiter-token.mjs components/RecruiterEasterEgg.tsx app/layout.tsx
```

Then verify:

```bash
git status --short
```

Expected: the five paths above are staged (`A`/`M` in the left column). Other working-tree changes remain unstaged.

- [ ] **Step 5.2: Propose 3 commit message options**

Per Kuba's CLAUDE.md, ALWAYS propose 3 Conventional Commits options and wait for his choice. Suggested set:

- A: `feat(easter-egg): add recruiter JWT cookie + console hint`
- B: `feat: hide a JWT for curious recruiters in DevTools`
- C: `feat(layout): plant recruiter easter egg — JWT cookie + console`

- [ ] **Step 5.3: Commit using the chosen message**

Run (substituting the chosen message):

```bash
git commit -m "<chosen message>"
```

Do **not** add `Co-Authored-By` (per Kuba's CLAUDE.md). Do **not** push (Kuba pushes manually).

- [ ] **Step 5.4: Confirm**

Run:

```bash
git log -1 --stat
```

Expected: one new commit listing the five files from Step 5.1.

---

## Self-Review Notes

- **Spec coverage:** discovery flow (Task 2 + 3 + 4), JWT structure (Task 1 script), signing (Task 1.2 + 1.3 verification), implementation file layout (Tasks 2/3), token generation strategy (Task 1), `jose` as devDep only (Task 1.1 + bundle check via `npm run build` in Task 4.3), acceptance criteria — all mapped.
- **Placeholders:** `<JWT_FROM_TASK_1>` is an explicit handoff between Step 1.3 and Step 2.1 with verification steps on both sides — not a generic placeholder.
- **Type consistency:** component name `RecruiterEasterEgg` (PascalCase, named export) consistent across Tasks 2 and 3. Cookie name `recruiter_token` consistent in spec, generator output target, and component.
- **No hidden steps:** typecheck + lint + build all explicit. Manual verification has its own task with a hard STOP gate before commit.
