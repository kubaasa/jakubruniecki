import type { Language } from "@/app/ide/types";

function nextFridayAt3am(now: Date = new Date()): string {
  const d = new Date(now);
  const daysUntilFriday = (5 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + daysUntilFriday);
  d.setHours(3, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function buildContent(): string {
  const onCallFriday = nextFridayAt3am();
  return `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { candidate, expectedStatuses, interviewQuestionBank } from "../test-data/candidate.data";

test.describe("Candidate profile", { tag: ["@smoke", "@critical"] }, () => {
  test.beforeEach(async ({ authenticatedRecruiter }) => {
    await authenticatedRecruiter.goto(candidate.profileUrl);
  });

  test("TC01 - should handle \"whats your biggest weakness?\" without stack overflow", { tag: ["@interview", "@critical"] }, async ({ homePage }) => {
    // "perfectionism" is the wrong answer - response must be honest and selfAware, no humble-brag escape hatch
    const answer = await homePage.askQuestion(interviewQuestionBank.humbleBragTrap);
    expect(answer).toMatchObject({
      honest: true,
      selfAware: true,
      humbleBrag: false,
    });
  });

  test("TC02 - should handle 3 AM on-call page without coffee dependency", { tag: ["@incident", "@oncall"] }, async ({ homePage, page }) => {
    // nearest Friday at 03:00 - oncall flow has to work when prod picks the worst possible moment
    await page.clock.setSystemTime(new Date("${onCallFriday}"));
    await expect(homePage.statusBarClock).toHaveText(/03:00/);
    await homePage.acknowledgeIncident();
    await expect(homePage.incidentBanner).toHaveAttribute("data-severity", expectedStatuses.incidentSeverity);
    await expect(homePage.oncallStatus).toHaveText(expectedStatuses.incidentAcknowledged);
  });

  test("TC03 - should load candidate profile without red flags", async ({ homePage }) => {
    await expect(homePage.candidateName).toHaveText(candidate.fullName);
    await expect(homePage.yearsBadge).toHaveText(\`\${candidate.yearsOfExperience} years\`);
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
