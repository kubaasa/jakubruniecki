import type { Project } from "@/types";

export const projects: ReadonlyArray<Project> = [
  {
    type: "demo-repo",
    title: "E-commerce E2E Test Suite",
    description:
      "Playwright + TypeScript test suite against a public e-commerce demo site. POM architecture, fixtures, parallel execution, CI on every push.",
    tech: ["Playwright", "TypeScript", "GitHub Actions"],
    githubUrl: "https://github.com/REPLACE_WITH_REAL_URL",
    highlights: [
      "30+ end-to-end tests",
      "Page Object Model pattern",
      "Parallel runs, ~2 min total",
      "CI green badge on README",
    ],
    status: "active",
  },
  {
    type: "case-study",
    title: "Cutting regression cycle from 3 days to 4 hours",
    industry: "Fintech",
    role: "Senior QA Engineer",
    duration: "2023–2024",
    description:
      "Inherited a manual regression suite that blocked every release for three days. Designed and built a Playwright suite covering critical user paths; integrated into CI so regression ran on every PR.",
    metrics: [
      "3d → 4h regression cycle",
      "150+ automated E2E tests",
      "0 production incidents from covered paths post-launch",
    ],
    techUsed: ["Playwright", "TypeScript", "Postman", "JIRA"],
  },
];
