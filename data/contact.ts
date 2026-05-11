import type { ContactLink } from "@/types";

const EMAIL = "jakubruniecki@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/REPLACE_WITH_REAL_HANDLE/";
const PHONE = "+48000000000";

export const contactLinks: ReadonlyArray<ContactLink> = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Hello Jakub")}`,
    icon: "email",
  },
  {
    label: "LinkedIn",
    value: LINKEDIN_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    href: LINKEDIN_URL,
    icon: "linkedin",
  },
  {
    label: "Location",
    value: "Warsaw, Poland · CET",
    href: "https://maps.google.com/?q=Warsaw,Poland",
    icon: "location",
  },
  {
    label: "Phone",
    value: PHONE,
    href: `tel:${PHONE}`,
    icon: "phone",
  },
];

export const cvRequestHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "CV Request — [Your Company]"
)}&body=${encodeURIComponent(
  "Hi Jakub,\n\nI'm [name] from [company]. We're looking for a [role]. Could you share your CV?\n\nThanks!"
)}`;
