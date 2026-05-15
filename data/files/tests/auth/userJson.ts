import type { Language } from "@/app/ide/types";

const content = `{
  "cookies": [
    {
      "name": "rec_session",
      "value": "kuba-is-hired-already",
      "domain": ".hire.kuba.dev",
      "path": "/",
      "expires": 9999999999,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://hire.kuba.dev",
      "localStorage": [
        { "name": "recruiter.id", "value": "rec_001" },
        { "name": "recruiter.role", "value": "tech-lead" }
      ]
    }
  ]
}
`;

export const authUserJson = {
  path: "tests/.auth/user.json",
  name: "user.json",
  language: "json" as Language,
  content,
};
