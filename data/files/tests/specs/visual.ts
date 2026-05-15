import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("Visual regression", { tag: ["@visual"] }, () => {
  test("TC01 - profile page should look hireable", async ({ page, homePage }) => {
    await page.goto("/candidates/kuba-bruniecki");

    // Mask everything that changes by itself — years badge ticks every 6 months,
    // "last updated" is relative, and the clock badge is literally a clock.
    await expect(page).toHaveScreenshot("profile-page.png", {
      fullPage: true,
      mask: [
        homePage.yearsBadge,
        homePage.lastUpdatedTimestamp,
        homePage.currentTimeBadge,
      ],
      maxDiffPixelRatio: 0.01,
    });
  });

  test("TC02 - dark mode should still look hireable", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/candidates/kuba-bruniecki");
    await expect(page).toHaveScreenshot("profile-page-dark.png");
  });

  test("TC03 - no red flags should be visible above the fold", async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki");
    await expect(page.locator("[data-testid='red-flag']")).toHaveCount(0);
  });

  test("TC04 - hire-me button should scream 'click me' on hover", async ({ page, homePage }) => {
    await page.goto("/candidates/kuba-bruniecki");

    await homePage.hireMeButton.hover();

    await expect(homePage.hireMeButton).toHaveCSS("cursor", "pointer");
    await expect(homePage.hireMeButton).toHaveScreenshot("hire-me-button-hover.png", {
      animations: "disabled",
    });
  });
});
`;

export const visualSpec = {
  path: "tests/specs/visual.spec.ts",
  name: "visual.spec.ts",
  language: "ts" as Language,
  content,
};
