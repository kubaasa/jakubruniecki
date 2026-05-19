import type { Language } from "@/app/ide/types";

const content = `import type { Locator, Page } from "@playwright/test";

export class ReviewsPage {
  constructor(private page: Page) {}

  get mentorScore(): Locator {
    return this.page.getByTestId("mentor-score");
  }

  get juniorTestimonial(): Locator {
    return this.page.getByTestId("junior-testimonial");
  }

  async goto(candidateSlug: string): Promise<void> {
    await this.page.goto(\`/candidates/\${candidateSlug}/reviews\`);
  }
}
`;

export const reviewsPagePOM = {
  path: "tests/pages/ReviewsPage.ts",
  name: "ReviewsPage.ts",
  language: "ts" as Language,
  content,
};
