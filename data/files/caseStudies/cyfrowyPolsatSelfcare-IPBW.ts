import type { Language } from "@/app/ide/types";

export const cyfrowyPolsatSelfcareIPBW = {
  path: "case-studies/iPolsatBox-IPBW.md",
  name: "iPolsatBox-IPBW.md",
  language: "md" as Language,
  content: `# iPolsatBox (IPBW) - Self-care platform for Cyfrowy Polsat

## About the project

iPolsatBox (IPBW) is a new self-care web platform built by Asseco Poland for
Cyfrowy Polsat, one of Poland's largest TV, internet and mobile providers. It
replaces the previous self-care portal and serves both individual (B2C) and
business (B2B) customers across TV (DTH/OTT) and internet (DATA) services. The
platform is aligned with WCAG 2.2 accessibility standards from day one, and
shares its backend with the existing Cyfrowy Polsat mobile app.

## What customers can do on the platform

The portal covers the full lifecycle of a customer's relationship with Cyfrowy
Polsat. The most important areas are:

- **Balance and finances** - check current balance, overpayments and
  outstanding debt, settle dues
- **Payments and invoices** - pay all services in bulk or service by service,
  download invoices
- **Contracts** - view current agreements, extend contracts
- **Usage history** - browse internet usage
- **Equipment** - manage devices linked to the account
- **Services and events** - manage film services, subscriptions and event
  purchases
- **Consents and personal data** - manage marketing consents, update personal
  and contact details
- **Customer contact** - chat with consultants, manage messages, submit forms

This is only a slice of the functional scope. The platform covers many more
flows, but the items above represent the customer journeys that mattered most
for the business.

## Team and my role

The development team was 1 PM, 5 frontend developers, 4 backend developers and
1 business analyst. Design mockups were delivered by the client. I was the
**only tester on the dev side**, the last checkpoint before any work could
leave the dev environment.

Every feature flowed through me before it could reach UAT. Developers handed
me their work on dedicated branches, we walked through the changes together
against the documentation, and I ran the first round of testing. A feature
was only promoted to UAT once I had verified it and confirmed that every
defect I had raised was fixed.

On the UAT side, the client had its own QA team. I was their **first point
of contact** - I walked them through new functionality,
answered their questions about how features were supposed to behave, and
triaged every bug they raised. Valid reports went back to dev; reports based
on a misunderstanding I rejected with an explanation.

## My QA work, stage by stage

### Refinement and requirements analysis

Requirements arrived as user stories in Jira together with mockups from the
client. Before every refinement session I prepared a written list of
questions covering ambiguities, edge cases and potential conflicts with the
existing system. I came to every meeting fully prepared and was consistently
the most active person in the room.

To shape requirements properly, I also analysed the previous self-care
system. By signing in under different user types I could map out the
behaviour customers were used to and verify whether the new portal would
preserve, change or break those expectations. Several times this analysis
revealed that a feature from the old system could not be re-implemented in
the new one as designed, so we adjusted scope early. This saved the team
development time and protected the client from paying for work they would
not have been happy with.

### Test scenarios and test case design

Test scenarios and test cases were authored before development started, based
on user stories and on what I had learned from the old portal. I used the
format the project already standardised on: classic test cases with steps,
expected results and proof, stored in Jira and Confluence. Each feature was
covered across the full spectrum of testing types - happy path, negative,
edge cases, integration and accessibility checks tied to WCAG 2.2.

### Manual testing on dev branches (gatekeeping before UAT)

Before any feature reached UAT, I ran manual testing against the dev branch
alongside the developers. We checked the implementation against the
documentation together, I logged defects, and the cycle repeated until every
finding was resolved. Only then did the feature get a green light to be
deployed to UAT. This gatekeeping role meant the client's UAT testers
received features that were already stable, which directly reduced the noise
of trivial bugs being filed by the business side.

### Automation (Playwright, Postman, CI)

I built the Playwright + TypeScript framework from scratch. I set up the
project, designed the Page Object Model, custom fixtures and storage-state
based authentication so tests could skip the login flow. Automation was
always added **after** manual stabilisation - I never wrote E2E tests on top
of fresh, moving code. The suite focused on smoke and regression flows with
high business impact, and every new feature added another layer of
confidence that the existing portal still worked.

On the API side, I maintained a Postman collection covering every endpoint
exposed by the portal. The collection works both as an exploration tool
while testing new flows and as an API regression suite.

The full automation suite runs in GitLab CI on every deployment to
UAT environment, so regressions are caught as soon as a release
candidate lands on the target environment.

### UAT moderation

Once a feature passed dev testing, I moved into the moderator role for the
client's QA team. I explained how each new feature was supposed to behave,
resolved their doubts, and triaged every defect they raised against the
project documentation before passing valid ones back to the dev team.

## What we went through

Two things shaped this project. The first was **time pressure**: we
committed to delivering an MVP in under two months, and the first release
was not perfect, it was pragmatic. As the sole tester on the dev side I had
to make sharp calls about where to invest in deep testing and where to
accept calculated risk.

The second was my own transition. I joined this project after moving from
the client-side QA team into the development team. Being close to
developers turned out to be a very different - and much better - way of
working for me. I learned a lot from them, particularly about testing on
the dev environment before anything reaches UAT, and I grew to enjoy
direct daily contact with the people building the product.

## Lessons learned

**Early QA involvement saves the client money.** The questions I prepared
for refinement and the analysis of the previous system caught things that
could not have been ported 1:1. Catching them before development started
saved the team time and protected the client's budget. QA has its biggest
leverage before the first line of code is written.

**Direct contact with developers beats QA silos.** Moving from the
client-side QA team to sitting inside the dev team showed me that quality
grows exponentially when the tester is next to the developers, not behind
a wall. When a tester sits inside the dev team, defects get caught before
they ever leave a branch.

**Selective automation: not everything is worth automating.** Each feature
added a layer of confidence in the areas where the business had the most
to lose, not "automate everything because we can". ROI in QA always wins
over coverage for coverage's sake.

**AI is a personal team on demand.** As the only tester on the dev side, I
use Claude Code as an assistant across the full QA lifecycle: documentation
analysis, scenario design, writing tests, code review and debugging flaky
tests. It is like having a second senior QA available full time, one I
consult for input while the final judgement and responsibility stay with
me. A solo tester with well-orchestrated AI delivers like a small QA team.
`,
};
