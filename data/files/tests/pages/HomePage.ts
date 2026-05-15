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

  get availabilityStatus(): Locator {
    return this.page.getByTestId("availability-status");
  }

  get moodIndicator(): Locator {
    return this.page.getByTestId("mood-indicator");
  }

  get statusBarClock(): Locator {
    return this.page.getByTestId("status-bar-clock");
  }

  get hireMeButton(): Locator {
    return this.page.getByRole("button", { name: /hire me/i });
  }

  get incidentBanner(): Locator {
    return this.page.getByTestId("incident-banner");
  }

  get oncallStatus(): Locator {
    return this.page.getByTestId("oncall-status");
  }

  async acknowledgeIncident(): Promise<void> {
    await this.page.getByRole("button", { name: /acknowledge/i }).click();
  }

  async askQuestion(question: string): Promise<{
    honest: boolean;
    diplomatic: boolean;
    technicallyCorrect: boolean;
  }> {
    await this.page.getByTestId("interview-input").fill(question);
    await this.page.getByRole("button", { name: /ask/i }).click();
    return this.page
      .getByTestId("interview-response")
      .evaluate((el) => JSON.parse(el.textContent ?? "{}"));
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
