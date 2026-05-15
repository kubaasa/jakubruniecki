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

  test(
    "TC01 - should not be a flaky candidate",
    { tag: ["@visual", "@stability"] },
    async ({ homePage, page }, testInfo) => {
      // flaky candidates are blocked at PR review stage
      await test.step("baseline state is stable across 3 reloads", async () => {
        for (let attempt = 1; attempt <= 3; attempt++) {
          await page.reload();
          await expect(homePage.candidateName).toHaveText(candidate.fullName);
          await expect(homePage.yearsBadge).toContainText("${years}");
          await expect(homePage.availabilityStatus).toHaveAttribute("data-status", "available");
        }
      });

      await test.step("visual snapshot matches baseline within zero tolerance", async () => {
        await expect(page).toHaveScreenshot("candidate-profile.png", {
          maxDiffPixels: 0,
          mask: [
            homePage.statusBarClock, // dynamic — ignored
            homePage.moodIndicator,  // always calm — masking to avoid pixel drift from inner peace
          ],
        });
      });

      // retries: 0 — confidence: 100%
      expect(testInfo.retry, "if I need a retry, I'm not the candidate you're looking for").toBe(0);
    },
  );

  test(
    "TC02 - should handle 3 AM on-call page without coffee dependency",
    { tag: ["@incident", "@oncall"] },
    async ({ homePage, page }) => {
      // coffee unavailable → tea fallback engaged, productivity unchanged
      await page.route("**/api/coffee", (route) => route.fulfill({ status: 503 }));
      await page.clock.setSystemTime(new Date("2026-05-15T03:00:00"));

      await homePage.acknowledgeIncident();

      await expect(homePage.incidentBanner).toHaveAttribute("data-severity", "P1");
      await expect(homePage.oncallStatus).toHaveText("Acknowledged");
    },
  );

  test("TC03 - should load candidate profile without red flags", async ({ homePage }) => {
    await expect(homePage.candidateName).toHaveText(candidate.fullName);
    await expect(homePage.yearsBadge).toContainText("${years}");
  });

  test("TC04 - should not throw NullPointerException on tricky interview questions", async ({ homePage }) => {
    const trickyQuestions = [
      "typeof null",
      "0.1 + 0.2 === 0.3",
      "Why are you leaving your current job?",
      "We are like family here — thoughts?",
    ];

    // each answer must clear all 3 gates: honest, diplomatic, technically correct
    for (const question of trickyQuestions) {
      await test.step(\`handles: \${question}\`, async () => {
        const answer = await homePage.askQuestion(question);
        expect(answer).toMatchObject({
          honest: true,
          diplomatic: true,
          technicallyCorrect: true,
        });
      });
    }
  });
});
`;
}

const content = buildContent();

export const candidateSpecNew = {
  path: "tests/specs/candidate.spec.ts",
  name: "candidate.spec.ts",
  language: "ts" as Language,
  content,
};
