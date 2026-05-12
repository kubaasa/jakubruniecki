import type { Language } from "@/app/ide/types";

export const aboutTs = {
  path: "portfolio/about.ts",
  name: "about.ts",
  language: "ts" as Language,
  content: `// about.ts — who I am, in code.

export const about = {
  name: "Jakub Bruniecki",
  role: "Senior QA Engineer",
  tagline: "Manual leadership + Playwright automation",
  yearsOfExperience: 5,
  breakdown: {
    manualTesting: "3.5y",
    automation: "1.5y",
    domains: ["Fintech", "E-commerce"],
  },
  location: "Warsaw, Poland",
  timezone: "Europe/Warsaw",
  openTo: "international remote",
  status: "open-to-work" as const,
  bio: [
    "I'm a QA engineer with 5 years of experience across fintech and e-commerce.",
    "Most of that was hands-on manual testing; the last 1.5 years I've focused",
    "on building Playwright automation suites that actually pay off — fewer",
    "regressions, faster releases, predictable outcomes.",
    "",
    "I treat tests as a feature, not a tax. The goal isn't coverage numbers —",
    "it's catching the issues that would have shipped, and giving the team",
    "enough confidence to move faster.",
  ],
};

export type About = typeof about;
`,
};
