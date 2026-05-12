import type { Language } from "@/app/ide/types";

export const skillsTs = {
  path: "portfolio/skills.ts",
  name: "skills.ts",
  language: "ts" as Language,
  content: `// skills.ts — grouped by category, levelled honestly.

type Level = "advanced" | "intermediate" | "beginner";

export const skills: Record<string, { level: Level; years?: number }[]> = {
  automation: [
    { level: "intermediate", years: 1.5 }, // Playwright
    { level: "intermediate", years: 1.5 }, // TypeScript
    { level: "advanced", years: 4 },       // Postman
    { level: "intermediate" },             // Newman
    { level: "beginner" },                 // GitHub Actions
  ],
  manual: [
    { level: "advanced", years: 5 },       // Test design
    { level: "advanced", years: 5 },       // Exploratory testing
    { level: "advanced" },                 // JIRA
    { level: "advanced" },                 // TestRail
    { level: "intermediate" },             // Xray
    { level: "advanced" },                 // Bug triage
  ],
  tools: [
    { level: "intermediate" },             // Git
    { level: "advanced" },                 // REST APIs
    { level: "intermediate" },             // SQL
    { level: "advanced" },                 // Chrome DevTools
  ],
};

export const labels = {
  automation: ["Playwright", "TypeScript", "Postman", "Newman", "GitHub Actions"],
  manual: ["Test design", "Exploratory testing", "JIRA", "TestRail", "Xray", "Bug triage"],
  tools: ["Git", "REST APIs", "SQL", "Chrome DevTools"],
};
`,
};
