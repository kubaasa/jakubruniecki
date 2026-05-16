import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("Hiring API", { tag: ["@api"] }, () => {
  test("TC11 - should return 400 when offer payload forgets the salary", async ({ request }) => {
    const res = await request.post("/api/offers", {
      data: {
        candidateId: "kuba-bruniecki",
        role: "Senior QA Automation Engineer",
        // salary intentionally omitted — recruiters, please.
      },
    });

    expect(res.status()).toBe(400);
    // toMatchObject ignores extra fields (timestamp, traceId) — only the contract matters.
    expect(await res.json()).toMatchObject({
      errors: [{ field: "salary", message: /required/i }],
    });
  });

  test("TC12 - should fall back to tea when /api/coffee returns 503", async ({ page }) => {
    // Intercept before navigation — order matters in route mocking.
    await page.route("**/api/coffee", (route) => route.fulfill({ status: 503 }));

    await page.goto("/candidates/kuba-bruniecki");
    await page.getByRole("button", { name: /brew coffee/i }).click();

    await expect(page.getByTestId("beverage-indicator")).toHaveAttribute("data-mode", "tea");
    await expect(page.getByRole("status")).toHaveText(/tea mode engaged/i);
  });

  test("TC13 - should expire the offer link after 7 days", async ({ request }) => {
    // Seed an offer that expired 8 days ago via the test-only fixture endpoint.
    const seedRes = await request.post("/api/test/offers", {
      data: {
        candidateId: "kuba-bruniecki",
        expiresAt: "2026-05-08T00:00:00Z",
      },
    });
    const { id } = await seedRes.json();

    const res = await request.get(\`/api/offers/\${id}\`);

    // 410 Gone — it existed, but it's over. 404 would lie.
    expect(res.status()).toBe(410);
    expect(await res.json()).toMatchObject({
      error: "OFFER_EXPIRED",
      expiredAt: "2026-05-08T00:00:00Z",
    });
  });
});
`;

export const apiSpec = {
  path: "tests/specs/api.spec.ts",
  name: "api.spec.ts",
  language: "ts" as Language,
  content,
};
