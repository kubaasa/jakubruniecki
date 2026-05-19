import type { Language } from "@/app/ide/types";

const content = `import { test as base, type Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ContactPage } from "../pages/ContactPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import { FeedbackPage } from "../pages/FeedbackPage";
import { DashboardPage } from "../pages/DashboardPage";

type RecruiterFixtures = {
  authenticatedRecruiter: Page;
  homePage: HomePage;
  contactPage: ContactPage;
  reviewsPage: ReviewsPage;
  feedbackPage: FeedbackPage;
  dashboardPage: DashboardPage;
};

// Custom fixtures: tests stay short, ceremony lives here.
export const test = base.extend<RecruiterFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },

  reviewsPage: async ({ page }, use) => {
    await use(new ReviewsPage(page));
  },

  feedbackPage: async ({ page }, use) => {
    await use(new FeedbackPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Logs in once. Lives forever. Like good test data.
  authenticatedRecruiter: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.waitForLoaded();
    await use(page);
    await page.request.post("/api/telemetry/recruiter-visit");
  },
});

export { expect } from "@playwright/test";
`;

export const recruiterFixture = {
  path: "tests/fixtures/fixtures.ts",
  name: "fixtures.ts",
  language: "ts" as Language,
  content,
};
