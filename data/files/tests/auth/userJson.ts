import type { Language } from "@/app/ide/types";
import { RECRUITER_TOKEN } from "@/data/recruiterToken";

const content = `{
  // pssst — this token isn't fake.
  // Paste it into jwt.io for a personal note from me. 👀
  "cookies": [
    {
      "name": "recruiter_token",
      "value": "${RECRUITER_TOKEN}",
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
