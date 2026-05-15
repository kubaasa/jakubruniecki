import type { Language } from "@/app/ide/types";

const content = `import { expect, test } from "@playwright/test";

test.describe("Offer pipeline (API)", { tag: ["@api"] }, () => {
  test("should accept an offer for the candidate", async ({ request }) => {
    const res = await request.post("/api/offers", {
      data: {
        candidateId: "kuba-bruniecki",
        role: "Senior QA Automation Engineer",
        salary: "competitive",
      },
    });
    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject({ status: "ACCEPTED" });
  });

  test("should mock the offer endpoint for UI tests", async ({ page }) => {
    // Intercept before navigation — order matters in route mocking.
    await page.route("**/api/offers", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ status: "ACCEPTED", startDate: "ASAP" }),
      });
    });

    await page.goto("/candidates/kuba-bruniecki");
    await page.getByRole("button", { name: /hire me/i }).click();

    await expect(page.getByRole("status")).toHaveText(/ACCEPTED/);
  });

  test("should reject malformed offers gracefully", async ({ request }) => {
    const res = await request.post("/api/offers", { data: {} });
    expect(res.status()).toBe(400);
  });
});
`;

export const apiSpec = {
  path: "tests/specs/api.spec.ts",
  name: "api.spec.ts",
  language: "ts" as Language,
  content,
};
