import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { recruiterPersonas } from "../test-data/candidate.data";

// Data-driven — every recruiter persona deserves the same hello.
test.describe("Soft skills", { tag: ["@regression"] }, () => {
  for (const persona of recruiterPersonas) {
    test(\`should communicate clearly with a \${persona.style} recruiter\`, async ({
      page,
      contactPage,
    }) => {
      await page.goto("/candidates/kuba-bruniecki/contact");
      await contactPage.messageInput.fill(persona.opener);

      await expect(page.getByRole("status")).toContainText(/typing indicator/i);
    });
  }

  test("should mentor juniors without ego", { tag: ["@soft"] }, async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki/reviews");
    await expect(page.getByTestId("mentor-score")).toHaveText("10/10");
  });

  test("should disagree without burning bridges", async ({ page }) => {
    await page.goto("/candidates/kuba-bruniecki/feedback");
    await expect(page.getByText("written-first, calm-second")).toBeVisible();
  });
});
`;

export const softSkillsSpecNew = {
  path: "tests/specs/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content,
};
