import type { Language } from "@/app/ide/types";

const content = `import type { Locator, Page } from "@playwright/test";

export class DashboardPage {
  constructor(private page: Page) {}

  get recruiterGreeting(): Locator {
    return this.page.getByTestId("recruiter-greeting");
  }

  get candidateList(): Locator {
    return this.page.getByRole("list", { name: /shortlisted candidates/i });
  }

  get pendingOffersCount(): Locator {
    return this.page.getByTestId("pending-offers-count");
  }

  async goto(): Promise<void> {
    await this.page.goto("/dashboard");
  }

  async waitForLoaded(): Promise<void> {
    await this.recruiterGreeting.waitFor();
  }
}
`;

export const dashboardPagePOM = {
  path: "tests/pages/DashboardPage.ts",
  name: "DashboardPage.ts",
  language: "ts" as Language,
  content,
};
