import type { ContactLink } from "@/types";

export const EMAIL = "jakubruniecki@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/jakub-bruniecki/";
const GITHUB_URL = "https://github.com/kubaasa";
const PHONE = "+48798909998";

export const contactLinks: ReadonlyArray<ContactLink> = [
  {
    label: "Email ✉️",
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Hello Jakub")}`,
    icon: "email",
  },
  {
    label: "LinkedIn 💼",
    value: LINKEDIN_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    href: LINKEDIN_URL,
    icon: "linkedin",
  },
  {
    label: "GitHub 🐙",
    value: GITHUB_URL.replace(/^https?:\/\//, ""),
    href: GITHUB_URL,
    icon: "github",
  },
  {
    label: "Location 🌊",
    value: "Gdańsk, Poland",
    href: "https://maps.google.com/?q=Gdansk,Poland",
    icon: "location",
  },
  {
    label: "Phone 📱",
    value: "+48 798 909 998",
    href: `tel:${PHONE}`,
    icon: "phone",
  },
];

export const cvRequestHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "CV request - [your company]"
)}&body=${encodeURIComponent(
  "Hi Jakub,\n\nI'm [name] from [company]. We have an opening for a [role] and your portfolio caught our attention. Could you send over your CV?\n\nThanks,\n[name]"
)}`;
