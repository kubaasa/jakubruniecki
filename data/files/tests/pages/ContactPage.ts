import type { Language } from "@/app/ide/types";

const content = `import type { Locator, Page } from "@playwright/test";

export class ContactPage {
  constructor(private page: Page) {}

  get nameInput(): Locator {
    return this.page.getByLabel("Your name");
  }

  get companyInput(): Locator {
    return this.page.getByLabel("Company");
  }

  get messageInput(): Locator {
    return this.page.getByLabel("Your message");
  }

  get sendOfferButton(): Locator {
    return this.page.getByRole("button", { name: /send offer/i });
  }

  get successToast(): Locator {
    return this.page.getByRole("status", { name: /offer sent/i });
  }

  async sendOffer(recruiterName: string, company: string, message: string): Promise<void> {
    await this.nameInput.fill(recruiterName);
    await this.companyInput.fill(company);
    await this.messageInput.fill(message);
    await this.sendOfferButton.click();
  }
}
`;

export const contactPagePOM = {
  path: "tests/pages/ContactPage.ts",
  name: "ContactPage.ts",
  language: "ts" as Language,
  content,
};
