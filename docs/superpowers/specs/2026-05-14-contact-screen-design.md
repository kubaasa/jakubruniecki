# Contact Screen Design

**Date:** 2026-05-14  
**Status:** Approved

## Goal

Update the `contact.ts` file displayed in the IDE editor with real contact data, consistent with the style of `about.ts` and `skills.ts`.

## Data

| Field    | Value                                        |
|----------|----------------------------------------------|
| Email    | jakubruniecki@gmail.com                      |
| LinkedIn | https://www.linkedin.com/in/jakub-bruniecki/ |
| GitHub   | https://github.com/kubaasa                   |
| Location | Gdańsk, Poland                               |
| Phone    | +48 798 909 998                              |

## Design

### Style

- "C" — data + a few contextual comments, no overdoing it
- Emojis in labels, consistent with `about.ts`
- No `cvRequestHref`
- No availability/response-time section

### File content (`data/files/contactTs.ts`)

```ts
// contact.ts — how to reach me.

type ContactEntry = {
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly note?: string;
};

export const contact: ContactEntry[] = [
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
    note:   "mostly private repos — ask if curious",
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
```

### Data file (`data/contact.ts`)

Update to match:
- Real LinkedIn URL: `https://www.linkedin.com/in/jakub-bruniecki/`
- Real phone: `+48798909998`
- Add GitHub entry
- Location: `Gdańsk, Poland` + `remote preferred` note
- Remove `cvRequestHref`

## Files to Change

1. `data/files/contactTs.ts` — full rewrite of the `content` string
2. `data/contact.ts` — update placeholders with real data, add GitHub, remove `cvRequestHref`
