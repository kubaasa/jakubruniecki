import type { Language } from "@/app/ide/types";
import {
  AUTOMATION_START,
  QA_START,
  formatYears,
  halfYearSuffixed,
  yearsBetween,
} from "@/lib/experience";

function buildContent(): string {
  const totalYears = formatYears(yearsBetween(QA_START));
  const manual = halfYearSuffixed(
    yearsBetween(QA_START, AUTOMATION_START.getTime()),
  );
  const automation = halfYearSuffixed(yearsBetween(AUTOMATION_START));

  return `# Jakub Bruniecki - QA Automation Engineer

**TL;DR:** ${totalYears} years in QA - ${manual} manual, ${automation} Playwright automation.
ISTQB Foundation Level certified. Telecom. Based in Gdańsk, open to international remote roles.

## How to read this portfolio

This is a working VS Code mock. Everything is interactive:

- Click any file in the **Explorer** on the left.
- Open the **terminal** (already focused) and try \`help\`.
- Watch the **test runner** in the bottom-right - it runs on load.
- Hit **⌘K** / **Ctrl+K** for the command palette.

## Start here

- \`portfolio/about.ts\` - the short version.
- \`portfolio/projects.ts\` - two real telecom case studies (Polsat, Plus).
- \`portfolio/contact.ts\` - how to reach me.

## Hire me

If the tests pass (they will), type \`cv\` in the terminal and I'll reply within 24h.
`;
}

export const readme = {
  path: "README.md",
  name: "README.md",
  language: "md" as Language,
  get content() {
    return buildContent();
  },
};
