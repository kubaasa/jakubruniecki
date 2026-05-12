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
