import type { Language } from "@/app/ide/types";

export const projectsTs = {
  path: "portfolio/projects.ts",
  name: "projects.ts",
  language: "ts" as Language,
  content: `// projects.ts — two case studies, both telecom, both real.
// note: detailed write-ups (with screenshots) live in /case-studies — currently in-progress.

export const projects = [
  {
    type: "case-study",
    slug: "cyfrowy-polsat-selfcare",
    title: "Cyfrowy Polsat — Self-care Platform",
    employer: "Asseco Poland S.A.",
    client: "Cyfrowy Polsat S.A.",
    industry: "Telecom",
    role: "QA Automation Engineer",
    duration: "2024-11 → present",
    description:
      "New B2C/B2B self-care web portal for one of Poland's largest TV & internet providers " +
      "(pay invoices, modify services, track data usage, and more). Built on top of the existing " +
      "mobile-app backend — adapted for web without regressing mobile.",
    metrics: [
      "Playwright + TypeScript framework from scratch (120+ E2E tests)",
      "20+ API endpoints covered via Postman",
      "WCAG 2.2 baked in from day one",
      "~4-5× faster test authoring with Claude Code + Playwright MCP",
    ],
    stack: [
      "Playwright",
      "TypeScript",
      "Claude Code",
      "Cursor",
      "Postman",
      "GitLab CI",
      "ArgoCD",
      "Playwright MCP/CLI",
    ],
    caseStudy: {
      file: "case-studies/CyfrowyPolsat(soon).md",
      status: "in-progress 🚧",
      willCover: [
        "refinement & requirement gathering",
        "documentation analysis",
        "test scenarios + test case design",
        "execution (manual + automation)",
        "final reports & lessons learned",
        "+ screenshots of each stage",
      ],
    },
  },
  {
    type: "case-study",
    slug: "polkomtel-uat",
    title: "Polkomtel (Plus) — Telecom QA across 25+ UAT releases",
    employer: "Asseco Poland S.A.",
    client: "Polkomtel Sp. z o.o.",
    industry: "Telecom",
    role: "Senior Software Tester",
    duration: "2021-06 → 2024-11",
    description:
      "Manual QA across 25+ UAT releases of interconnected self-service systems for one of " +
      "Poland's largest mobile operators. Owned new-feature testing and verified that what " +
      "landed on UAT matched the client's documentation — often under tight delivery pressure.",
    metrics: [
      "25+ UAT releases shipped",
      "2500+ tickets filed before reaching production",
      "Led own UAT project — hired and onboarded 2 testers",
      "Scrum + waterfall, complex specs, frequent time pressure",
    ],
    stack: [
      "Manual QA",
      "Postman",
      "SoapUI",
      "HP ALM QC",
      "Chrome DevTools",
      "Kibana",
      "JIRA",
      "Confluence",
      "PostgreSQL",
      "MongoDB",
    ],
    caseStudy: {
      file: "case-studies/PlusSelfcare(soon).md",
      status: "in-progress 🚧",
      willCover: [
        "refinement & requirement gathering",
        "documentation analysis",
        "test scenarios + test case design",
        "different types of test execution",
        "final reports & lessons learned",
        "+ screenshots of each stage",
      ],
    },
  },
] as const;
`,
};
