import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("Visual regression", { tag: ["@visual"] }, () => {
  test("candidate profile should look hireable", async ({ page, homePage }) => {
    await page.goto("/candidates/kuba-bruniecki");

    // Mask the live-updating years badge — it changes every six months
    // and would otherwise turn this into a flaky test.
    await expect(page).toHaveScreenshot("profile-page.png", {
      fullPage: true,
      mask: [homePage.yearsBadge],
      maxDiffPixelRatio: 0.01,
    });
  });

  test("no red flags should be visible above the fold", async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki");
    await expect(page.locator("[data-testid='red-flag']")).toHaveCount(0);
  });

  test("dark mode should still look hireable", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/candidates/kuba-bruniecki");
    await expect(page).toHaveScreenshot("profile-page-dark.png");
  });
});
`;

export const visualSpec = {
  path: "tests/specs/visual.spec.ts",
  name: "visual.spec.ts",
  language: "ts" as Language,
  content,
};
