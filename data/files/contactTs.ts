import type { Language } from "@/app/ide/types";

export const contactTs = {
  path: "portfolio/contact.ts",
  name: "contact.ts",
  language: "ts" as Language,
  content: `// contact.ts - how to reach me.

type ContactEntry = {
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly note?: string;
};

export const contact = [
  {
    label:  "Email ✉️",
    value:  "jakubruniecki@gmail.com",
    href:   "mailto:jakubruniecki@gmail.com?subject=Hello%20Jakub",
  },
  {
    label:  "LinkedIn 💼",
    value:  "linkedin.com/in/jakub-bruniecki",
    href:   "https://www.linkedin.com/in/jakub-bruniecki/",
  },
  {
    label:  "GitHub 🐙",
    value:  "github.com/kubaasa",
    href:   "https://github.com/kubaasa",
    note:   "mostly private repos - ask if curious",
  },
  {
    label:  "Location 🌊",
    value:  "Gdańsk, Poland",
    note:   "remote preferred 🌍",
  },
  {
    label:  "Phone 📱",
    value:  "+48 798 909 998",
    href:   "tel:+48798909998",
  },
] as const satisfies ReadonlyArray<ContactEntry>;
`,
};
