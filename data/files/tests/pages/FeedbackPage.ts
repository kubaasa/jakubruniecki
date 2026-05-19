import type { Language } from "@/app/ide/types";

const content = `import type { Locator, Page } from "@playwright/test";

export class FeedbackPage {
  constructor(private page: Page) {}

  get disagreementStyleQuote(): Locator {
    return this.page.getByText("written-first, calm-second");
  }

  get conflictResolutionScore(): Locator {
    return this.page.getByTestId("conflict-resolution-score");
  }

  async goto(candidateSlug: string): Promise<void> {
    await this.page.goto(\`/candidates/\${candidateSlug}/feedback\`);
  }
}
`;

export const feedbackPagePOM = {
  path: "tests/pages/FeedbackPage.ts",
  name: "FeedbackPage.ts",
  language: "ts" as Language,
  content,
};
