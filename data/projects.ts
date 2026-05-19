import type { Project } from "@/types";

export const projects: ReadonlyArray<Project> = [
  {
    type: "case-study",
    title: "Cyfrowy Polsat - Self-care Platform",
    industry: "Telecom",
    role: "QA Automation Engineer",
    duration: "2024-11 → present",
    description:
      "New B2C/B2B self-care web portal for one of Poland's largest TV & internet providers (pay invoices, modify services, track data usage, and more). Built on top of the existing mobile-app backend - adapted for web without regressing mobile. Employer: Asseco Poland S.A. Client: Cyfrowy Polsat S.A.",
    metrics: [
      "Playwright + TypeScript framework from scratch (120+ E2E tests)",
      "20+ API endpoints covered via Postman",
      "WCAG 2.2 baked in from day one",
      "~4-5x faster test authoring with Claude Code + Playwright MCP",
    ],
    techUsed: [
      "Playwright",
      "TypeScript",
      "Claude Code",
      "Cursor",
      "Postman",
      "GitLab CI",
      "ArgoCD",
      "Playwright MCP/CLI",
    ],
  },
  {
    type: "case-study",
    title: "Polkomtel (Plus) - Telecom QA across 25+ UAT releases",
    industry: "Telecom",
    role: "Senior Software Tester",
    duration: "2021-06 → 2024-11",
    description:
      "Manual QA across 25+ UAT releases of interconnected self-service systems for one of Poland's largest mobile operators. Owned new-feature testing and verified that what landed on UAT matched the client's documentation - often under tight delivery pressure. Employer: Asseco Poland S.A. Client: Polkomtel Sp. z o.o.",
    metrics: [
      "25+ UAT releases shipped",
      "2500+ tickets filed before reaching production",
      "Led own UAT project - hired and onboarded 2 testers",
      "Scrum + waterfall, complex specs, frequent time pressure",
    ],
    techUsed: [
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
  },
];
