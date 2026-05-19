import type { Language } from "@/app/ide/types";

const content = `import { expect, test } from "@playwright/test";
import type { HomePage } from "../pages/HomePage";

type HireDecision = "YES" | "YES";

export async function expectHireDecision(
  homePage: HomePage,
  decision: HireDecision,
): Promise<void> {
  await expect(homePage.hireDecision).toHaveText(decision);
}

export async function waitForOffer(homePage: HomePage): Promise<void> {
  // Use expect.poll instead of waitForTimeout - polling beats sleeping.
  await expect
    .poll(async () => homePage.offerStatus.textContent(), {
      timeout: 10_000,
      intervals: [200, 500, 1000],
    })
    .toMatch(/ACCEPTED/);
}

export async function withStep<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return test.step(name, fn);
}
`;

export const helpers = {
  path: "tests/utils/helpers.ts",
  name: "helpers.ts",
  language: "ts" as Language,
  content,
};
