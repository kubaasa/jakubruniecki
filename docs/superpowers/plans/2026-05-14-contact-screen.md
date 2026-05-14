# Contact Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the contact screen with real data, add GitHub entry, and align the displayed TypeScript file with the design spec.

**Architecture:** Five small, sequential edits across data/types/components — no new files needed. Changes flow from types → data → components → display file.

**Tech Stack:** TypeScript, Next.js, React

---

### Task 1: Add "github" to ContactIcon type

**Files:**
- Modify: `types/index.ts:54`

- [ ] **Step 1: Update ContactIcon union**

```ts
export type ContactIcon = "email" | "linkedin" | "location" | "phone" | "github";
```

- [ ] **Step 2: Run typecheck to verify**

```bash
npx tsc --noEmit
```
Expected: no errors related to ContactIcon.

---

### Task 2: Update `data/contact.ts` with real data

**Files:**
- Modify: `data/contact.ts`

- [ ] **Step 1: Rewrite the file**

```ts
import type { ContactLink } from "@/types";

const EMAIL = "jakubruniecki@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/jakub-bruniecki/";
const GITHUB_URL = "https://github.com/kubaasa";
const PHONE = "+48798909998";

export const contactLinks: ReadonlyArray<ContactLink> = [
  {
    label: "Email ✉️",
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Hello Jakub")}`,
    icon: "email",
  },
  {
    label: "LinkedIn 💼",
    value: LINKEDIN_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    href: LINKEDIN_URL,
    icon: "linkedin",
  },
  {
    label: "GitHub 🐙",
    value: GITHUB_URL.replace(/^https?:\/\//, ""),
    href: GITHUB_URL,
    icon: "github",
  },
  {
    label: "Location 🌊",
    value: "Gdańsk, Poland",
    href: "https://maps.google.com/?q=Gdansk,Poland",
    icon: "location",
  },
  {
    label: "Phone 📱",
    value: "+48 798 909 998",
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

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

### Task 3: Add GitHubIcon to MobileFallback

**Files:**
- Modify: `components/ide/MobileFallback.tsx:4-8` and `components/ide/MobileFallback.tsx:10-15`

- [ ] **Step 1: Add GitHubIcon import**

Change the import block from:
```ts
import {
  EmailIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";
```
To:
```ts
import {
  EmailIcon,
  GitHubIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";
```

- [ ] **Step 2: Add github to iconFor map**

Change:
```ts
const iconFor = {
  email: EmailIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};
```
To:
```ts
const iconFor = {
  email: EmailIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};
```

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

### Task 4: Fix GitHub URL in CommandPalette

**Files:**
- Modify: `components/ide/CommandPalette.tsx:15`

- [ ] **Step 1: Update the hardcoded GITHUB_URL constant**

Change:
```ts
const GITHUB_URL = "https://github.com/jakubruniecki";
```
To:
```ts
const GITHUB_URL = "https://github.com/kubaasa";
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

### Task 5: Rewrite `data/files/contactTs.ts` (displayed file content)

**Files:**
- Modify: `data/files/contactTs.ts`

- [ ] **Step 1: Rewrite the file**

```ts
import type { Language } from "@/app/ide/types";

export const contactTs = {
  path: "portfolio/contact.ts",
  name: "contact.ts",
  language: "ts" as Language,
  content: `// contact.ts — how to reach me.

type ContactEntry = {
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly note?: string;
};

export const contact: ContactEntry[] = [
  {
    label:  "Email ✉️",
    value:  "jakubruniecki@gmail.com",
    href:   "mailto:jakubruniecki@gmail.com?subject=Hello%20Jakub",
  },
  {
    label:  "LinkedIn 💼",
    value:  "linkedin.com/in/jakub-bruniecki",
    href:   "https://www.linkedin.com/in/jakub-bruniecki/",
  },
  {
    label:  "GitHub 🐙",
    value:  "github.com/kubaasa",
    href:   "https://github.com/kubaasa",
    note:   "mostly private repos — ask if curious",
  },
  {
    label:  "Location 🌊",
    value:  "Gdańsk, Poland",
    note:   "remote preferred 🌍",
  },
  {
    label:  "Phone 📱",
    value:  "+48 798 909 998",
    href:   "tel:+48798909998",
  },
] as const satisfies ReadonlyArray<ContactEntry>;
`,
};
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```
Expected: no errors.

---

### Task 6: Commit

- [ ] **Step 1: Commit all changes**

```bash
git add types/index.ts data/contact.ts data/files/contactTs.ts components/ide/MobileFallback.tsx components/ide/CommandPalette.tsx
git commit -m "feat(contact): real data, GitHub entry, aligned display file"
```
