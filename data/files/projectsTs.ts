import type { Language } from "@/app/ide/types";

export const projectsTs = {
  path: "portfolio/projects.ts",
  name: "projects.ts",
  language: "ts" as Language,
  content: `// projects.ts - two case studies, both telecom, both real.

export const projects = [
  {
    type: "case-study",
    slug: "cyfrowy-polsat-selfcare",
    title: "iPolsatBox - Self-service Platform",
    employer: "Asseco Poland S.A.",
    client: "Cyfrowy Polsat S.A.",
    industry: "Telecom",
    role: "QA Automation Engineer",
    duration: "2024-11 → present",
    description:
      "New B2C/B2B self-service web portal for one of Poland's largest TV & internet providers " +
      "(pay invoices, modify services, track data usage, and more). Built on top of the existing " +
      "mobile-app backend - adapted for web without regressing mobile.",
    metrics: [
      "Playwright + TypeScript framework from scratch (120+ E2E tests, POM + fixtures + storage-state auth)",
      "Full API coverage via Postman (20+ endpoints)",
      "WCAG 2.2 accessibility built in from day one",
      "Claude Code + Playwright CLI/MCP as pair-programmer in test design and triage",
      "Solo tester on dev side - last gate before UAT",
      "MVP delivered in under 2 months",
    ],
    stack: [
      "Playwright",
      "Playwright MCP/CLI",
      "TypeScript",
      "Claude Code",
      "Cursor",
      "Postman",
      "REST",
      "GraphQL",
      "GitLab CI",
      "ArgoCD",
      "Kibana",
      "Chrome DevTools",
    ],
    caseStudy: {
      file: "case-studies/iPolsatBox.md",
    },
  },
  {
    type: "case-study",
    slug: "polkomtel-uat",
    title: "Polkomtel (Plus) - Telecom QA across 25+ UAT releases",
    employer: "Asseco Poland S.A.",
    client: "Polkomtel Sp. z o.o.",
    industry: "Telecom",
    role: "Senior Software Tester",
    duration: "2021-06 → 2024-11",
    description:
      "Senior manual QA on a rotating portfolio of telco projects for one of Poland's " +
      "largest mobile operators - sales-force tools, regulatory programmes (PKE), digital " +
      "signatures, and B2B/B2C self-service portals. End-to-end QA ownership under ~6-week " +
      "UAT cycles, scrum and waterfall.",
    metrics: [
      "25+ UAT releases shipped",
      "2500+ tickets filed before reaching production",
      "Led own UAT project - hired and onboarded 2 testers",
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
      file: "case-studies/Polkomtel.md",
    },
  },
] as const;
`,
};
