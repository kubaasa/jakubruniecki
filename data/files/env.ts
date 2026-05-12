import type { Language } from "@/app/ide/types";

export const envFile = {
  path: ".env",
  name: ".env",
  language: "env" as Language,
  content: `OPEN_TO_WORK=true
ROLE=Senior QA Engineer
LOCATION=Warsaw, Poland
TIMEZONE=Europe/Warsaw
CV_DELIVERY=on-request
# secrets are .gitignored 😉
`,
};
