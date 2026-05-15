import type { Language } from "@/app/ide/types";

const content = `import { test as base, type Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ContactPage } from "../pages/ContactPage";

type RecruiterFixtures = {
  authenticatedRecruiter: Page;
  homePage: HomePage;
  contactPage: ContactPage;
};

  // Custom fixtures: tests stay short, ceremony lives here.
  export const test = base.extend<RecruiterFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },

  // Logs in once. Lives forever. Like good test data.
  authenticatedRecruiter: async ({ page }, use) => {
    await page.goto("/dashboard");
    await page.waitForSelector("[data-testid='recruiter-greeting']");
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
