import type { Language } from "@/app/ide/types";

export const fintechRegression = {
  path: "case-studies/fintech-regression.md",
  name: "fintech-regression.md",
  language: "md" as Language,
  content: `# Cutting regression cycle from 3 days to 4 hours

**Industry:** Fintech · **Role:** Senior QA Engineer · **Duration:** 2023–2024

## Context

I joined a fintech team where every release was gated by a three-day manual
regression pass. Two QAs ran a shared spreadsheet of ~400 cases by hand.
Releases shipped weekly; effectively half of every week was regression.

## Problem

- Regression was the slowest, most error-prone step in the pipeline.
- Manual coverage drifted: cases were skipped under deadline pressure.
- Bug feedback arrived 2–3 days after the change that caused it.

## Approach

1. **Mapped the critical user journeys** with product and engineering — 12
   end-to-end paths covered ~80% of the regression value.
2. **Built a Playwright + TypeScript suite** using POM, fixtures for auth /
   accounts, and a shared API client for test data setup.
3. **Wired it into CI** (GitHub Actions) so the suite ran on every PR with
   parallel workers; total suite time ~6 min.
4. **Triaged flakes ruthlessly** — every flaky test was either stabilised or
   deleted within a week.

## Outcome

- Regression cycle: **3 days → 4 hours**.
- 150+ automated E2E tests, green CI badge on the main branch.
- **0 production incidents** from covered paths in the 6 months after launch.
- The team gained a release cadence of ~2× per week.

## What I'd do differently

- Start with API-level tests for the data setup earlier — cut UI flakes.
- Invest in test-data isolation (per-run accounts) from day one, not month two.
- Document the "stable test" criteria up front so the team agrees on the bar.
`,
};
