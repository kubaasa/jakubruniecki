import type { Language } from "@/app/ide/types";

export const availabilitySpec = {
  path: "tests/availability.spec.ts",
  name: "availability.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("availability", () => {
  test("is open to work", async () => {
    expect(candidate.status).toBe("open-to-work");
  });

  test("responds within 24h", async () => {
    expect(candidate.responseSLA.hours).toBeLessThanOrEqual(24);
  });

  test("considers remote roles", async () => {
    expect(candidate.workMode).toContain("remote");
  });
});
`,
};
