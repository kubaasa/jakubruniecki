import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import {
  globalTeamTimezones,
  mentorScenarios,
  recruiterPersonas,
} from "../test-data/candidate.data";

test.describe("Soft skills", { tag: ["@regression"] }, () => {
  // Data-driven — every recruiter persona deserves the same hello.
  for (const persona of recruiterPersonas) {
    test(\`TC01 - should communicate clearly with a \${persona.style} recruiter\`, async ({ page, contactPage }) => {
      await page.goto("/candidates/kuba-bruniecki/contact");
      await contactPage.messageInput.fill(persona.opener);
      await expect(page.getByRole("status")).toContainText(/typing indicator/i);
    });
  }

  test("TC02 - should mentor juniors without ego", { tag: ["@soft"] }, async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki/reviews");
    await expect(page.getByTestId("mentor-score")).toHaveText("10/10");
  });

  test("TC03 - should disagree without burning bridges", async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki/feedback");
    await expect(page.getByText("written-first, calm-second")).toBeVisible();
  });

  test("TC04 - should keep cool under production fire", async ({ page, homePage }) => {
    await page.route("**/api/offers", (route) => route.fulfill({ status: 500 }));
    await page.goto("/candidates/kuba-bruniecki");

    await homePage.hireMeButton.click();

    await expect(homePage.moodIndicator).toHaveAttribute("data-status", "calm");
    await expect(page.getByRole("alert")).toHaveText(/something failed — no panic/i);
  });

  for (const scenario of mentorScenarios) {
    test(\`TC05 - should mentor on \${scenario.topic} without saying "actually"\`, async ({
      page,
    }) => {
      await page.goto(\`/candidates/kuba-bruniecki/mentor/\${scenario.slug}\`);

      await expect(page.getByTestId("mentor-transcript"))
        .not.toContainText(/\\b(actually|just|obviously|literally|basically)\\b/i);
    });
  }

  test("TC06 - should write commit messages in conventional format", async ({ request }) => {
    const res = await request.get("/api/git/log?limit=20");
    const commits: { sha: string; subject: string }[] = await res.json();

    const conventionalCommit = /^(feat|fix|docs|chore|refactor|test|style|perf)(\\([^)]+\\))?: .+/;

    for (const commit of commits) {
      expect.soft(commit.subject, \`commit \${commit.sha} breaks convention\`).toMatch(conventionalCommit);
    }
  });

  for (const member of globalTeamTimezones) {
    test(\`TC07 - should schedule async standup in \${member.city}'s work hours\`, async ({
      page,
    }) => {
      await page.emulateTimezone(member.tz);
      await page.goto("/candidates/kuba-bruniecki/team");

      await expect(page.getByTestId(\`standup-slot-\${member.slug}\`))
        .toHaveAttribute("data-in-work-hours", "true");
    });
  }
});
`;

export const softSkillsSpecNew = {
  path: "tests/specs/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content,
};
