import type { Language } from "@/app/ide/types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function isoLocal(d: Date, hours: number, minutes: number): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hours)}:${pad(minutes)}:00`;
}

// next working day from today - represents the day of hire
function nextWorkday(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

// today if it matches targetDay (0=Sun..6=Sat), otherwise the next occurrence of it
function currentOrNextWeekday(targetDay: number, from: Date = new Date()): Date {
  const d = new Date(from);
  const daysToAdd = (targetDay - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + daysToAdd);
  return d;
}

function buildContent(): string {
  const hireDay = isoLocal(nextWorkday(), 9, 0);
  const afterHoursThursday = isoLocal(currentOrNextWeekday(4), 23, 0);
  const fridayDeploy = isoLocal(currentOrNextWeekday(5), 16, 55);

  return `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { candidate, expectedStatuses } from "../test-data/candidate.data";

test.describe("Visual regression", { tag: ["@visual"] }, () => {
  test("TC08 - new hire should pass team vibe check on day one", async ({ page, homePage }) => {
    // day one at the new gig - vibe check is the only test that matters
    await page.clock.setSystemTime(new Date("${hireDay}"));
    await homePage.goto(candidate.slug);

    const vibeCheck = await homePage.runTeamVibeCheck();
    expect(vibeCheck).toMatchObject({
      fitsTheCulture: true,
      laughsAtCeoJokes: true,
      bringsActualCoffee: true,
    });

    await expect(page).toHaveScreenshot("new-hire-vibe-check-passed.png", {
      fullPage: true,
      mask: [
        homePage.yearsBadge,
        homePage.availabilityStatus,
      ],
      maxDiffPixelRatio: 0.01,
    });
  });

  test("TC09 - after-hours crew session should still render in dark mode", async ({ page, homePage }) => {
    // 23:00 on a thursday, second beer in - the dashboard better still render
    await page.clock.setSystemTime(new Date("${afterHoursThursday}"));
    await page.emulateMedia({ colorScheme: "dark" });
    await homePage.goto(candidate.slug);

    await expect(homePage.crewPresenceIndicator).toContainText(/[3-9] online/);
    await expect(homePage.afterHoursBadge).toBeVisible();

    await expect(page).toHaveScreenshot("after-hours-with-the-crew.png");
  });

  test("TC10 - should prove the new hire survived first Friday deploy", async ({ page, homePage }) => {
    // friday 16:55 deploy - every junior's nightmare, but not for me
    await page.clock.setSystemTime(new Date("${fridayDeploy}"));
    await homePage.goto(candidate.slug);

    await homePage.triggerFridayDeploy();
    await expect(homePage.employmentStatus).toHaveText(expectedStatuses.postFridayEmployment);
    await expect(homePage.incidentBanner).not.toBeVisible();

    await expect(page).toHaveScreenshot("still-employed-after-friday.png");
  });
});
`;
}

export const visualSpec = {
  path: "tests/specs/visual.spec.ts",
  name: "visual.spec.ts",
  language: "ts" as Language,
  get content() {
    return buildContent();
  },
};
