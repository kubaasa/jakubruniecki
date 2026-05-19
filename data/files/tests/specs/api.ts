import type { Language } from "@/app/ide/types";

const content = `import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { candidate, expectedStatuses } from "../test-data/candidate.data";

test.describe("Hiring API", { tag: ["@api"] }, () => {
  test("TC11 - should return 400 when offer payload forgets the salary", async ({ request }) => {
    const res = await request.post("/api/offers", {
      data: {
        candidateId: candidate.slug,
        role: "Senior QA Automation Engineer",
        // salary intentionally omitted - recruiters, please.
      },
    });

    expect(res.status()).toBe(400);
    // toMatchObject ignores extra fields (timestamp, traceId) - only the contract matters.
    expect(await res.json()).toMatchObject({
      errors: [{ field: "salary", message: /required/i }],
    });
  });

  test("TC12 - should fall back to tea when /api/coffee returns 503", async ({ page, homePage }) => {
    // Intercept before navigation - order matters in route mocking.
    await page.route("**/api/coffee", (route) => route.fulfill({ status: 503 }));

    await page.goto(candidate.profileUrl);
    await homePage.brewCoffeeButton.click();

    await expect(homePage.beverageIndicator).toHaveAttribute("data-mode", expectedStatuses.beverageFallback);
    await expect(homePage.teaModeStatus).toHaveText(/tea mode engaged/i);
  });

  test("TC13 - should expire the offer link after 7 days", async ({ request }) => {
    // Seed an offer that expired 8 days ago via the test-only fixture endpoint.
    const expiredAt = "2026-05-08T00:00:00Z";
    const seedRes = await request.post("/api/test/offers", {
      data: {
        candidateId: candidate.slug,
        expiresAt,
      },
    });
    const { id } = await seedRes.json();

    const res = await request.get(\`/api/offers/\${id}\`);

    // 410 Gone - it existed, but it's over. 404 would lie.
    expect(res.status()).toBe(410);
    expect(await res.json()).toMatchObject({
      error: "OFFER_EXPIRED",
      expiredAt,
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
