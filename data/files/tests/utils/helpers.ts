import type { Language } from "@/app/ide/types";

const content = `import { expect, type Page, test } from "@playwright/test";

type HireDecision = "YES" | "YES";

export async function expectHireDecision(
  page: Page,
  decision: HireDecision,
): Promise<void> {
  await expect(page.getByTestId("hire-decision")).toHaveText(decision);
}

export async function waitForOffer(page: Page): Promise<void> {
  // Use expect.poll instead of waitForTimeout — polling beats sleeping.
  await expect
    .poll(async () => page.getByTestId("offer-status").textContent(), {
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
