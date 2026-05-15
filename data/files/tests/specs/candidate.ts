import type { Language } from "@/app/ide/types";
import { formatYears, totalYearsExperience } from "@/lib/experience";

function buildContent(): string {
  const years = formatYears(totalYearsExperience());
  return `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { candidate } from "../test-data/candidate.data";

test.describe("Candidate profile", { tag: ["@smoke", "@critical"] }, () => {
  test.beforeEach(async ({ authenticatedRecruiter }) => {
    await authenticatedRecruiter.goto("/candidates/kuba-bruniecki");
  });

  test("should load candidate profile without red flags", async ({ homePage }) => {
    await expect(homePage.candidateName).toHaveText(candidate.fullName);
    await expect(homePage.yearsBadge).toContainText("${years}");
  });

  test("should display ${years} years of QA experience", async ({ homePage }) => {
    await expect(homePage.experienceYears).toHaveText("${years}");
  });

  test("should pass the smell test", async ({ homePage }) => {
    await expect(homePage.hireMeButton).toBeVisible();
    await expect(homePage.hireMeButton).toBeEnabled();
  });
});
`;
}

export const candidateSpecNew = {
  path: "tests/specs/candidate.spec.ts",
  name: "candidate.spec.ts",
  language: "ts" as Language,
  get content() {
    return buildContent();
  },
};
