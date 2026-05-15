import type { Language } from "@/app/ide/types";

export const envFile = {
  path: ".env",
  name: ".env",
  language: "env" as Language,
  content: `# .env.production.public — sanitized snapshot for the public build.
# real secrets live in Vercel project settings → environment variables.
NEXT_PUBLIC_SITE_URL=https://jakubruniecki.dev
NEXT_PUBLIC_SITE_NAME=Jakub Bruniecki — QA Portfolio
NEXT_PUBLIC_LOCALE=pl-PL
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_ANALYTICS_ID=G-QA5Y4SX7B1
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jakubruniecki.dev
NEXT_PUBLIC_BUILD_ID=2026.05.15.a1f3c0

NEXTAUTH_URL=https://jakubruniecki.dev
NEXTAUTH_SECRET=••••••••••••••••••••••••••••••••
SESSION_MAX_AGE=2592000
SESSION_COOKIE_NAME=__Secure-jr.session

CONTACT_FORM_ENDPOINT=https://api.jakubruniecki.dev/v1/contact
CONTACT_FORM_RATE_LIMIT=5/min
RESEND_API_KEY=re_•••••••••••••••••••
MAIL_FROM=hello@jakubruniecki.dev
MAIL_TO=jakubruniecki@gmail.com
MAIL_REPLY_TO=jakubruniecki@gmail.com

GITHUB_URL=https://github.com/kubaasa
GITHUB_TOKEN=ghp_•••••••••••••••••••••••
LINKEDIN_URL=https://www.linkedin.com/in/jakub-bruniecki/
CV_DOWNLOAD_URL=https://jakubruniecki.dev/cv?token=

FF_RECRUITER_MODE=true
FF_EASTER_EGGS=true
FF_VISUAL_REGRESSION=true
FF_A11Y_AUDIT=true
FF_DARK_MODE_DEFAULT=true
FF_CV_DOWNLOAD=on-request

NODE_ENV=production
LOG_LEVEL=info

# repro steps:
# 1. notice this file is suspiciously empty of real secrets
# 2. open the file next door
# 3. decode. severity: P1 (hire).
`,
};
