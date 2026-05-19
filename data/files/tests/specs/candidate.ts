import type { Language } from "@/app/ide/types";
import { formatYears, totalYearsExperience } from "@/lib/experience";

function buildContent(): string {
  const years = formatYears(totalYearsExperience());
  return `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { candidate, expectedStatuses, interviewQuestionBank } from "../test-data/candidate.data";

test.describe("Candidate profile", { tag: ["@smoke", "@critical"] }, () => {
  test.beforeEach(async ({ authenticatedRecruiter }) => {
    await authenticatedRecruiter.goto(candidate.profileUrl);
  });

  test("TC01 - should handle \"whats your biggest weakness?\" without stack overflow", { tag: ["@interview", "@critical"] }, async ({ homePage }) => {
    // classic recursive trap - answer "perfectionism" and you're in an infinite humble-brag loop
    const answer = await homePage.askQuestion(interviewQuestionBank.humbleBragTrap);
    expect(answer).toMatchObject({
      honest: true,
      selfAware: true,
      humbleBrag: false,
    });
  });

  test("TC02 - should handle 3 AM on-call page without coffee dependency", { tag: ["@incident", "@oncall"] }, async ({ homePage, page }) => {
    // 3 AM page lands - ack within SLA, severity stays P1, no rage-quit
    await page.clock.setSystemTime(new Date("2026-05-15T03:00:00"));
    await homePage.acknowledgeIncident();
    await expect(homePage.incidentBanner).toHaveAttribute("data-severity", expectedStatuses.incidentSeverity);
    await expect(homePage.oncallStatus).toHaveText(expectedStatuses.incidentAcknowledged);
  });

  test("TC03 - should load candidate profile without red flags", async ({ homePage }) => {
    await expect(homePage.candidateName).toHaveText(candidate.fullName);
    await expect(homePage.yearsBadge).toContainText("${years}");
  });

  test("TC04 - should not throw NullPointerException on tricky interview questions", async ({ homePage }) => {
    // each answer must clear all 3 gates: honest, diplomatic, technically correct
    for (const question of interviewQuestionBank.tricky) {
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
