import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { candidate, expectedStatuses } from "../test-data/candidate.data";

test.describe("Soft skills", { tag: ["@regression"] }, () => {
  test("TC05 - should mentor juniors without ego", { tag: ["@soft"] }, async ({ reviewsPage }) => {
    await reviewsPage.goto(candidate.slug);
    await expect(reviewsPage.mentorScore).toHaveText(expectedStatuses.mentorScore);
  });

  test("TC06 - should disagree without burning bridges", { tag: ["@soft"] }, async ({ feedbackPage }) => {
    await feedbackPage.goto(candidate.slug);
    await expect(feedbackPage.disagreementStyleQuote).toBeVisible();
  });

  test("TC07 - should keep cool under production fire", { tag: ["@soft"] }, async ({ page, homePage }) => {
    await page.route("**/api/offers", (route) => route.fulfill({ status: 500 }));
    await page.goto(candidate.profileUrl);
    await homePage.hireMeButton.click();
    await expect(homePage.moodIndicator).toHaveAttribute("data-status", expectedStatuses.moodCalm);
    await expect(homePage.errorAlert).toHaveText(/something failed - no panic/i);
  });
});
`;

export const softSkillsSpecNew = {
  path: "tests/specs/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content,
};
