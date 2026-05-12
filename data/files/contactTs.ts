import type { Language } from "@/app/ide/types";

export const contactTs = {
  path: "portfolio/contact.ts",
  name: "contact.ts",
  language: "ts" as Language,
  content: `// contact.ts — how to reach me.

export const EMAIL = "jakubruniecki@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/REPLACE_WITH_REAL_HANDLE/";
export const LOCATION = "Warsaw, Poland · CET";
export const PHONE = "+48000000000";

export const contact = [
  {
    label: "Email",
    value: EMAIL,
    href: \`mailto:\${EMAIL}?subject=Hello%20Jakub\`,
  },
  {
    label: "LinkedIn",
    value: LINKEDIN_URL.replace(/^https?:\\/\\//, "").replace(/\\/$/, ""),
    href: LINKEDIN_URL,
  },
  {
    label: "Location",
    value: LOCATION,
    href: "https://maps.google.com/?q=Warsaw,Poland",
  },
  {
    label: "Phone",
    value: PHONE,
    href: \`tel:\${PHONE}\`,
  },
] as const;

export const cvRequestHref =
  \`mailto:\${EMAIL}?subject=CV%20Request&body=Hi%20Jakub%2C%20...\`;
`,
};
