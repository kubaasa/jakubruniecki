import type { Language } from "@/app/ide/types";

export const hireMeSpec = {
  path: "tests/hire-me.spec.ts",
  name: "hire-me.spec.ts",
  language: "ts" as Language,
  content: `import { test, expect } from "@playwright/test";
import { candidate } from "./fixtures";

test.describe("the bottom line", () => {
  test("hire me", async () => {
    const decision = candidate.shouldHire();
    expect(decision).toBe("YES");
  });
});
`,
};
