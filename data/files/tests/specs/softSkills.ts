import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("Soft skills", { tag: ["@regression"] }, () => {
  test("TC05 - should mentor juniors without ego", { tag: ["@soft"] }, async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki/reviews");
    await expect(page.getByTestId("mentor-score")).toHaveText("10/10");
  });

  test("TC06 - should disagree without burning bridges", { tag: ["@soft"] }, async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki/feedback");
    await expect(page.getByText("written-first, calm-second")).toBeVisible();
  });

  test("TC07 - should keep cool under production fire", { tag: ["@soft"] }, async ({ page, homePage }) => {
    await page.route("**/api/offers", (route) => route.fulfill({ status: 500 }));
    await page.goto("/candidates/kuba-bruniecki");
    await homePage.hireMeButton.click();
    await expect(homePage.moodIndicator).toHaveAttribute("data-status", "calm");
    await expect(page.getByRole("alert")).toHaveText(/something failed — no panic/i);
  });
});
`;

export const softSkillsSpecNew = {
  path: "tests/specs/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content,
};
