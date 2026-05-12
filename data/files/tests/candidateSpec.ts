import type { Language } from "@/app/ide/types";

export const candidateSpec = {
  path: "tests/candidate.spec.ts",
  name: "candidate.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("Jakub Bruniecki — candidate", () => {
  test("has 5 years of QA experience", async () => {
    expect(candidate.yearsOfExperience).toBe(5);
  });

  test("writes maintainable Playwright code", async () => {
    expect(candidate.automation.framework).toBe("Playwright + TS");
    expect(candidate.automation.patterns).toContain("Page Object Model");
  });

  test("cuts regression from 3d to 4h", async () => {
    expect(candidate.impact.regression).toEqual({
      before: "3d",
      after: "4h",
    });
  });
});
`,
};
