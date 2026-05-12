import type { Language } from "@/app/ide/types";

export const softSkillsSpec = {
  path: "tests/soft-skills.spec.ts",
  name: "soft-skills.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("soft skills", () => {
  test("communicates clearly", async () => {
    expect(candidate.communication.style).toBe("direct, written-first");
  });

  test("mentors juniors", async () => {
    expect(candidate.mentorship.junior).toBeGreaterThanOrEqual(2);
  });

  test("owns the outcome", async () => {
    expect(candidate.ownership).toBe(true);
  });
});
`,
};
