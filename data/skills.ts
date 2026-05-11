import type { Skill } from "@/types";

export const skills: ReadonlyArray<Skill> = [
  // Automation
  { name: "Playwright", level: "intermediate", category: "automation", yearsUsed: 1.5 },
  { name: "TypeScript", level: "intermediate", category: "automation", yearsUsed: 1.5 },
  { name: "Postman", level: "advanced", category: "automation", yearsUsed: 4 },
  { name: "Newman", level: "intermediate", category: "automation" },
  { name: "GitHub Actions", level: "beginner", category: "automation" },

  // Manual
  { name: "Test design", level: "advanced", category: "manual", yearsUsed: 5 },
  { name: "Exploratory testing", level: "advanced", category: "manual", yearsUsed: 5 },
  { name: "JIRA", level: "advanced", category: "manual" },
  { name: "TestRail", level: "advanced", category: "manual" },
  { name: "Xray", level: "intermediate", category: "manual" },
  { name: "Bug triage", level: "advanced", category: "manual" },

  // Tools
  { name: "Git", level: "intermediate", category: "tools" },
  { name: "REST APIs", level: "advanced", category: "tools" },
  { name: "SQL", level: "intermediate", category: "tools" },
  { name: "Chrome DevTools", level: "advanced", category: "tools" },
];
