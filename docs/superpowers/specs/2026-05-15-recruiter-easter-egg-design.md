# Recruiter Easter Egg — JWT in a Cookie

**Date:** 2026-05-15
**Status:** Approved

## Goal

Plant a hidden, decodable JWT in a cookie on the portfolio site. A curious recruiter who opens DevTools sees a friendly console message pointing at the cookie. Pasting the token into jwt.io reveals a humorous, personal payload — hobbies, preferences, the proudest bug, fun facts, what Jakub looks for in a team, and a CTA to get in touch.

The token is **signed (HS256), not encrypted**, so anyone with the string can read the payload. The "secret" is a formality — there is no security boundary here, only an easter egg.

## Why JWT (not JWE)

Recruiter receives a token they can decode. JWE (like the one Claude uses on its dashboard) is encrypted and useless without the shared key — most people would not bother. A standard JWT is the universal "hey, paste me into jwt.io" format. Discoverability beats mystery here.

## Discovery flow

1. Recruiter opens any page on `jakubruniecki.vercel.app`.
2. On mount, a tiny client component:
   - Sets a cookie `recruiter_token=<JWT>` (path `/`, `max-age=31536000`, `SameSite=Lax`, no `httpOnly` — must be visible to DevTools).
   - Prints a styled `console.log` greeting that names the cookie and points at jwt.io.
3. Recruiter opens DevTools → Application → Cookies, copies the value, pastes it into [jwt.io](https://jwt.io), reads the personal note.

No backend, no API route — the site is `output: "export"` (SSG), so everything is client-side and the token is hardcoded as a string in the bundle.

## JWT structure

### Header

```json
{ "alg": "HS256", "typ": "JWT" }
```

### Payload

```json
{
  "iss": "jakubruniecki.pl",
  "sub": "jakub-bruniecki",
  "aud": "curious-recruiter",
  "iat": 1747267200,
  "exp": 9999999999,
  "jti": "ee-001",

  "role": "senior-qa-engineer",
  "scope": [
    "manual-testing",
    "test-automation",
    "bug-hunting",
    "edge-case-thinking"
  ],

  "name": "Jakub Bruniecki",
  "location": "Gdańsk, PL → open to remote / EU",
  "languages": ["pl", "en"],

  "hobbies": [
    "vibe-coding",
    "gym",
    "longboarding",
    "self-development",
    "poker (Texas Hold'em)"
  ],

  "preferences": {
    "coffee": "with milk, no sugar ☕",
    "os": "Windows",
    "theme": "dark-mode-only",
    "ide": "VSCode / Cursor"
  },

  "proudestBug": {
    "where": "telco production",
    "impact": "horizontal privilege escalation — modify services on customer A's account from customer B's session",
    "ageBeforeFound": "2 years",
    "lesson": "obvious-looking flows hide the deepest bugs"
  },

  "funFact": "Spent all of 2025 in Thailand 🇹🇭 — where my girlfriend is from. Highly recommend pad krapow.",

  "lookingFor": {
    "team": "supportive, motivating, knowledge-sharing",
    "project": "interesting product, modern stack, no bikeshedding",
    "mode": "remote / hybrid"
  },

  "notInTheCV": [
    "soul of the team — at work and after",
    "I overdeliver by default, not on demand"
  ],

  "message": "If you decoded this — you've got the curiosity I look for in teammates. Let's talk: jakubruniecki@gmail.com"
}
```

### Signing

- Algorithm: `HS256`
- Secret: `the-cake-is-a-lie` (cosmetic — the token is not protecting anything)

The token is generated **once**, offline, by Jakub via a one-shot script using Node's built-in `node:crypto` (HMAC-SHA256 + base64url). No third-party JWT library is needed at all — neither in production nor in development. The resulting compact-serialized string is hardcoded as a constant in the easter-egg component.

## Implementation

### New file: `components/RecruiterEasterEgg.tsx`

A client component (`"use client"`) that:

1. Holds the precomputed JWT string as a constant.
2. In `useEffect` (runs once on mount):
   - Sets `document.cookie = "recruiter_token=<JWT>; path=/; max-age=31536000; SameSite=Lax";`
   - Calls `console.log` with `%c` styling — the greeting and the hint.
3. Returns `null` (no DOM output).

The console message (English — the site is English and Jakub targets international roles):

```
👋  Hi there.

You opened DevTools on a portfolio site.
That already says something about you — and we're going to get along.

🍪  There is a cookie called  recruiter_token  in Application → Cookies.
     Paste it into  https://jwt.io  for a personal note.

— Jakub
```

Use a single `console.log` with `%c` to style it (large heading, smaller body).

### Wiring: `app/layout.tsx`

Render `<RecruiterEasterEgg />` once inside `<body>`, before `{children}`. Side-effect-only, no visual impact.

### Token generation script: `scripts/generate-recruiter-token.mjs`

A one-off Node script that:
- Imports `createHmac` from `node:crypto`.
- Builds the payload above.
- Encodes header + payload as base64url JSON, computes HMAC-SHA256 over `<header>.<payload>` with the secret, base64url-encodes the signature.
- Prints `<header>.<payload>.<signature>` to stdout.

Run via `node scripts/generate-recruiter-token.mjs` whenever the payload changes. Output is copy-pasted into the component constant. **No third-party dependency** — Node's built-in modules only.

## What we deliberately skip (YAGNI)

- ❌ Backend / API route — site is SSG.
- ❌ Token rotation, real expiration logic — it is an easter egg, not auth.
- ❌ Recruiter detection (UA sniffing, etc.) — token is set for everyone.
- ❌ Analytics on cookie reads — overkill for MVP; can come later.
- ❌ A "decode here" UI on the site itself — the whole point is that the recruiter discovers and decodes it themselves; jwt.io exists.

## Acceptance criteria

- Cookie `recruiter_token` is present after visiting any page.
- Cookie value is a valid HS256 JWT — verifiable on jwt.io with the secret `the-cake-is-a-lie`.
- Decoded payload matches the structure above.
- Console shows the greeting + cookie hint with visible styling.
- No regressions in existing pages (typecheck + lint pass; visual check by Jakub).
- Production bundle does **not** contain the `jose` library.
