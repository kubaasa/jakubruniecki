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
`;
}

export const candidateData = {
  path: "tests/test-data/candidate.data.ts",
  name: "candidate.data.ts",
  language: "ts" as Language,
  get content() {
    return buildContent();
  },
};
