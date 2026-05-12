import type { Language } from "@/app/ide/types";

export const ecommerceE2e = {
  path: "case-studies/ecommerce-e2e.md",
  name: "ecommerce-e2e.md",
  language: "md" as Language,
  content: `# E-commerce E2E Test Suite

**Type:** Public demo repository · **Tech:** Playwright + TypeScript + GitHub Actions

## Why this exists

I wanted a public, reviewable demo of how I structure an automation suite
from scratch. It runs against a public e-commerce demo site (saucedemo) so
anyone can clone it, run it, and read the code.

## Architecture

- **Page Object Model** — one POM per page (login, inventory, cart, checkout).
  Locators are getters; user actions are async methods.
- **Fixtures** — \`@playwright/test\` fixtures for logged-in users with
  different inventory states (empty cart, items in cart, etc.).
- **Test data** — a tiny TS module exports the demo users; tests reference
  it instead of hard-coded strings.
- **Selectors** — \`getByRole\` / \`getByTestId\` first, CSS as a last resort.
  Zero \`waitForTimeout\` calls in the suite.

## Parallel execution

Tests run in 4 workers with full isolation. Total suite time on CI: ~2 min for
30+ tests across the full purchase flow plus error / edge cases.

## CI integration

GitHub Actions workflow runs on every push and PR. Failures upload the
Playwright HTML report as an artifact and the trace viewer is one click away.

## Results

- **30+ end-to-end tests** covering the critical purchase path.
- **CI green badge** on the README; one-click HTML report on failure.
- **Public, reviewable code** — recruiters can read the actual implementation,
  not just the description.

## Repo

[github.com/jakubruniecki/ecommerce-e2e](https://github.com/REPLACE_WITH_REAL_URL)
`,
};
