import type { Skill, SkillCategory, SkillLevel } from "@/types";

export const skills: ReadonlyArray<Skill> = [
  // test-automation
  { name: "Playwright", level: "intermediate", category: "test-automation", yearsUsed: 1.5 },
  { name: "TypeScript", level: "intermediate", category: "test-automation", yearsUsed: 1.5 },

  // test-manual
  { name: "Test design", level: "senior", category: "test-manual", yearsUsed: 5 },
  { name: "Functional testing", level: "senior", category: "test-manual", yearsUsed: 5 },
  { name: "Defect management", level: "senior", category: "test-manual", yearsUsed: 5 },

  // ai-augmented
  { name: "Claude Code", level: "advanced", category: "ai-augmented", yearsUsed: 1 },
  { name: "Playwright MCP/CLI", level: "advanced", category: "ai-augmented", yearsUsed: 0.5 },
  { name: "Cursor", level: "intermediate", category: "ai-augmented", yearsUsed: 1 },
  { name: "AI-powered SaaS prototyping", level: "intermediate", category: "ai-augmented", yearsUsed: 0.5 },

  // api-testing
  { name: "Postman", level: "advanced", category: "api-testing", yearsUsed: 4 },
  { name: "SoapUI", level: "intermediate", category: "api-testing", yearsUsed: 2 },
  { name: "REST", level: "intermediate", category: "api-testing", yearsUsed: 4 },
  { name: "GraphQL", level: "intermediate", category: "api-testing", yearsUsed: 1.5 },

  // ci-cd
  { name: "GitLab CI", level: "intermediate", category: "ci-cd", yearsUsed: 1 },
  { name: "Git", level: "intermediate", category: "ci-cd", yearsUsed: 5 },

  // test-management
  { name: "JIRA", level: "senior", category: "test-management", yearsUsed: 5 },
  { name: "Confluence", level: "advanced", category: "test-management", yearsUsed: 5 },
  { name: "HP ALM", level: "senior", category: "test-management", yearsUsed: 2 },
  { name: "TestRail", level: "advanced", category: "test-management", yearsUsed: 3 },
  { name: "Xray", level: "advanced", category: "test-management", yearsUsed: 1.5 },

  // debugging
  { name: "PostgreSQL", level: "intermediate", category: "debugging", yearsUsed: 3 },
  { name: "Oracle", level: "intermediate", category: "debugging", yearsUsed: 2 },
  { name: "Chrome DevTools", level: "senior", category: "debugging", yearsUsed: 5 },
  { name: "Kibana", level: "senior", category: "debugging", yearsUsed: 1.5 },
  { name: "ArgoCD", level: "intermediate", category: "debugging", yearsUsed: 1 },
];

export const SKILL_CATEGORY_ORDER: ReadonlyArray<SkillCategory> = [
  "test-automation",
  "test-manual",
  "ai-augmented",
  "api-testing",
  "ci-cd",
  "test-management",
  "debugging",
];

export const LEVEL_EMOJI: Record<SkillLevel, string> = {
  senior: "🏆 senior",
  advanced: "🔥 advanced",
  intermediate: "⚡ intermediate",
  beginner: "🌱 beginner",
};

export const CATEGORY_EMOJI: Record<SkillCategory, string> = {
  "test-automation": "🎭",
  "test-manual": "🧪",
  "ai-augmented": "🤖",
  "api-testing": "🔌",
  "ci-cd": "🚀",
  "test-management": "📋",
  "debugging": "🔍",
};

export const CATEGORY_LABEL: Record<SkillCategory, string> = {
  "test-automation": "Test Automation",
  "test-manual": "Test Manual",
  "ai-augmented": "AI-Augmented Engineering",
  "api-testing": "API Testing",
  "ci-cd": "CI/CD & Infrastructure",
  "test-management": "Test Management & Docs",
  "debugging": "Debugging & Analysis",
};
