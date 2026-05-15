import type { Language } from "@/app/ide/types";

const content = `import type { Locator, Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  get candidateName(): Locator {
    return this.page.getByTestId("candidate-name");
  }

  get yearsBadge(): Locator {
    return this.page.getByTestId("years-badge");
  }

  get experienceYears(): Locator {
    return this.page.getByRole("meter", { name: /years of experience/i });
  }

  get hireMeButton(): Locator {
    return this.page.getByRole("button", { name: /hire me/i });
  }

  async openSkills(): Promise<void> {
    await this.page.getByRole("tab", { name: "Skills" }).click();
  }

  async openCaseStudies(): Promise<void> {
    await this.page.getByRole("link", { name: "Case studies" }).click();
  }
}
`;

export const homePagePOM = {
  path: "tests/pages/HomePage.ts",
  name: "HomePage.ts",
  language: "ts" as Language,
  content,
};
