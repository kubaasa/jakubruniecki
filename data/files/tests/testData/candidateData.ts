import type { Language } from "@/app/ide/types";
import { formatYears, totalYearsExperience } from "@/lib/experience";

function buildContent(): string {
  const years = formatYears(totalYearsExperience());
  return `import { faker } from "@faker-js/faker";

export const candidate = {
  fullName: "Jakub Bruniecki",
  role: "Senior QA Engineer",
  yearsOfExperience: ${years},
  stack: ["Playwright", "TypeScript", "Postman", "GitHub Actions"],
  patterns: ["Page Object Model", "Custom fixtures", "Data-driven tests"],
  impact: { regression: { before: "3d", after: "4h" } },
} as const;

export const expectedSkills = [
  "Manual testing",
  "Test automation",
  "API testing",
  "Visual regression",
  "Accessibility (WCAG 2.2)",
];

faker.seed(42); // reproducible recruiters — flaky tests are not on the menu.

export const recruiterPersonas = [
  { style: "warm", opener: faker.lorem.sentence({ min: 6, max: 10 }) },
  { style: "blunt", opener: "We have a role. Are you in?" },
  { style: "verbose", opener: faker.lorem.paragraph() },
];

export const mentorScenarios = [
  { topic: "async testing", slug: "async-testing" },
  { topic: "your first flaky test", slug: "first-flaky-test" },
  { topic: "disagreeing in code review", slug: "code-review-disagreement" },
];

export const globalTeamTimezones = [
  { city: "Warsaw", slug: "warsaw", tz: "Europe/Warsaw" },
  { city: "New York", slug: "new-york", tz: "America/New_York" },
  { city: "Tokyo", slug: "tokyo", tz: "Asia/Tokyo" },
];
`;
}

const content = buildContent();

export const candidateData = {
  path: "tests/test-data/candidate.data.ts",
  name: "candidate.data.ts",
  language: "ts" as Language,
  content,
};
