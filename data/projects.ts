import type { Project } from "@/types";

export const projects: ReadonlyArray<Project> = [
  {
    type: "case-study",
    title: "Cyfrowy Polsat - Self-service Platform",
    industry: "Telecom",
    role: "QA Automation Engineer",
    duration: "2024-11 → present",
    description:
      "New B2C/B2B self-service web portal for one of Poland's largest TV & internet providers (pay invoices, modify services, track data usage, and more). Built on top of the existing mobile-app backend - adapted for web without regressing mobile. Employer: Asseco Poland S.A. Client: Cyfrowy Polsat S.A.",
    metrics: [
      "Playwright + TypeScript framework from scratch (120+ E2E tests, POM + fixtures + storage-state auth)",
      "Full API coverage via Postman (20+ endpoints)",
      "WCAG 2.2 accessibility built in from day one",
      "Claude Code + Playwright CLI/MCP as pair-programmer in test design and triage",
      "Solo tester on dev side - last gate before UAT",
      "MVP delivered in under 2 months",
    ],
    techUsed: [
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
  },
  {
    type: "case-study",
    title: "Polkomtel (Plus) - Telecom QA across 25+ UAT releases",
    industry: "Telecom",
    role: "Senior Software Tester",
    duration: "2021-06 → 2024-11",
    description:
      "Senior manual QA on a rotating portfolio of telco projects for one of Poland's largest mobile operators - sales-force tools, regulatory programmes (PKE), digital signatures, and B2B/B2C self-service portals. End-to-end QA ownership under ~6-week UAT cycles, scrum and waterfall. Employer: Asseco Poland S.A. Client: Polkomtel Sp. z o.o.",
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
