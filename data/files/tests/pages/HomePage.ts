import type { Language } from "@/app/ide/types";

const content = `import type { Locator, Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async goto(candidateSlug: string): Promise<void> {
    await this.page.goto(\`/candidates/\${candidateSlug}\`);
  }

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

  get crewPresenceIndicator(): Locator {
    return this.page.getByTestId("crew-presence");
  }

  get afterHoursBadge(): Locator {
    return this.page.getByTestId("after-hours-badge");
  }

  get employmentStatus(): Locator {
    return this.page.getByTestId("employment-status");
  }

  get brewCoffeeButton(): Locator {
    return this.page.getByRole("button", { name: /brew coffee/i });
  }

  get beverageIndicator(): Locator {
    return this.page.getByTestId("beverage-indicator");
  }

  get teaModeStatus(): Locator {
    return this.page.getByRole("status", { name: /tea mode/i });
  }

  get errorAlert(): Locator {
    return this.page.getByRole("alert");
  }

  get hireDecision(): Locator {
    return this.page.getByTestId("hire-decision");
  }

  get offerStatus(): Locator {
    return this.page.getByTestId("offer-status");
  }

  get acknowledgeButton(): Locator {
    return this.page.getByRole("button", { name: /acknowledge/i });
  }

  get interviewInput(): Locator {
    return this.page.getByTestId("interview-input");
  }

  get askButton(): Locator {
    return this.page.getByRole("button", { name: /ask/i });
  }

  get interviewResponse(): Locator {
    return this.page.getByTestId("interview-response");
  }

  get vibeCheckButton(): Locator {
    return this.page.getByRole("button", { name: /run vibe check/i });
  }

  get vibeCheckResult(): Locator {
    return this.page.getByTestId("vibe-check-result");
  }

  get deployToProdButton(): Locator {
    return this.page.getByRole("button", { name: /deploy to prod/i });
  }

  get skillsTab(): Locator {
    return this.page.getByRole("tab", { name: "Skills" });
  }

  get caseStudiesLink(): Locator {
    return this.page.getByRole("link", { name: "Case studies" });
  }

  async acknowledgeIncident(): Promise<void> {
    await this.acknowledgeButton.click();
  }

  async askQuestion(question: string): Promise<{
    honest: boolean;
    diplomatic: boolean;
    technicallyCorrect: boolean;
    selfAware: boolean;
    humbleBrag: boolean;
  }> {
    await this.interviewInput.fill(question);
    await this.askButton.click();
    return this.interviewResponse.evaluate((el) => JSON.parse(el.textContent ?? "{}"));
  }

  async runTeamVibeCheck(): Promise<{
    fitsTheCulture: boolean;
    laughsAtCeoJokes: boolean;
    bringsActualCoffee: boolean;
  }> {
    await this.vibeCheckButton.click();
    return this.vibeCheckResult.evaluate((el) => JSON.parse(el.textContent ?? "{}"));
  }

  async triggerFridayDeploy(): Promise<void> {
    await this.deployToProdButton.click();
  }

  async openSkills(): Promise<void> {
    await this.skillsTab.click();
  }

  async openCaseStudies(): Promise<void> {
    await this.caseStudiesLink.click();
  }
}
`;

export const homePagePOM = {
  path: "tests/pages/HomePage.ts",
  name: "HomePage.ts",
  language: "ts" as Language,
  content,
};
