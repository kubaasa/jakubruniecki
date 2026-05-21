import type { Language } from "@/app/ide/types";

export const polkomtel = {
  path: "case-studies/Polkomtel.md",
  name: "Polkomtel.md",
  language: "md" as Language,
  content: `# Polkomtel (Plus) - Telecom QA across 25+ UAT releases

## About the project

For three and a half years I worked as part of an Asseco QA team leased to
Polkomtel, the operator behind the Plus telecom brand and one of Poland's
largest mobile providers. Polkomtel runs a portfolio of close to 150
internal and customer-facing applications, and the testers from my team
were assigned to specific projects across that portfolio depending on
business priorities. I joined the team as a junior tester in 2021 and left
in late 2024 as a Senior Software Tester, after leading my own UAT project
end to end.

## What I worked on

Over those three and a half years I went through many projects across
Plus's application portfolio. The list below covers the most representative
ones, but it is not exhaustive - there were many more in between.

- **Sales and retention applications** - tools used by Plus consultants
  and retail stores for customer acquisition (postpaid and prepaid),
  contract extensions, retention, mobile number portability (MNP), tariff
  changes and device sales
- **Cross-system end-to-end flows** - business processes such as
  "customer acquisition" that touch four to five applications at once,
  from front-office through billing to CRM, plus retention, equipment
  shipping and complaint handling
- **PKE (Polish Electronic Communications Act)** - a large regulatory
  programme that forced the client to restructure many existing
  applications, rolled out in multiple technical phases
- **Sygnaturix and Signer** - electronic signature applications used
  across Plus's customer journeys (cloud, SMS code and one-time code
  variants)
- **Rabatnik** - a system that completely rewrote how customer service
  discounts were calculated and applied across the portfolio
- **Rukola** - a system that automatically registered Apple devices
  bought by B2B customers into Apple Business Manager (ABM)
- **B2C self-care portal** - testing the consumer-facing self-service
  portal for Plus customers
- **B2B self-care portal** - the culmination of my time on the project,
  which I led end to end as the senior QA on the team

## My journey from junior to senior

I joined the team with no prior telecom experience. As a junior tester I
approached every application as an end user would: clicking through the
UI, following the documented happy path and trying to make sense of the
heavy telecom domain underneath. Plus has dozens of products (postpaid,
prepaid, internet, MNP, roaming, B2B, SOHO), hundreds of tariffs and
several regulatory constraints, and the business processes often weave
through four or five applications before they complete. The first few
months were mostly about absorbing all of that.

By the end of the project my perspective was completely different. I no
longer tested an "application", I tested **a process**. For any feature
that landed on UAT I would in parallel verify the UI, the API calls, the
underlying database, the logs and the integrations with neighbouring
systems. I caught edge cases that were simply invisible from the UI, and
I could usually tell whether a defect belonged to the frontend, the
backend or the integration before raising the ticket. That shift in
perspective is what took me from junior to senior in this role.

## Daily work and process

The default rhythm on Polkomtel projects was waterfall: the client
announced a release scope, I prepared test cases up front, and then I
ran a focused **UAT phase of about thirty working days** per project.
At the end of the phase I delivered a final report and the release went
to production. Some teams ran a more typical scrum process, working in
sprints with the client's dev team and verifying incrementally, but the
30-day waterfall UAT was the most common shape.

Experienced testers on the team usually ran two or three projects in
parallel, because the volume of applications and releases at Plus made
back-to-back single-project work impractical. Context switching, status
tracking across projects and choosing what to test deeply versus what
to smoke became part of the day job.

## Tools and technologies

As a junior I lived in the UI, Chrome DevTools and HP ALM QC, with
defects and conversation in Jira and Confluence. As I grew into senior
work the toolchain on paper stayed largely the same, but the **depth**
of use changed completely. Postman moved from "send a sample request"
to maintaining collections with environments and chained requests.
SoapUI was used to verify SOAP traffic end to end. Kibana became the
first place I looked when a process got stuck, and queries to
PostgreSQL and MongoDB let me confirm the actual state of data rather
than guess it from the UI. The same tools, used by a senior, give a
completely different signal than they do in the hands of a junior.

## Leading my own UAT project

The B2B self-care portal was the project where I worked as a full QA
Project Lead. The client needed a dedicated UAT team for it, and I
owned that team end to end: I recruited two additional testers
(reviewing CVs and running interviews), onboarded them onto Plus and
into the system, distributed work across the team, reviewed their
test cases and bug reports, and reported project status directly to
the client. I was still hands-on as a tester at the same time - the
team was small enough that leadership and delivery had to live in
one head.

## What we went through

Four things made this project hard, in different ways.

The **telecom domain** itself was an enormous onboarding mountain.
Postpaid versus prepaid, MNP, roaming, B2B versus SOHO, regulatory
constraints like PKE and GDPR - none of it is intuitive when you walk
in from outside the industry, and the client expects you to be useful
on day one anyway. The **30-day UAT phase** sounds long until a
complex feature ships with late-arriving bugs, and then you are
choosing in real time what to test deeply and what to accept
calculated risk on. Client **documentation was rich but not always in
sync with what actually landed on UAT** - catching those drifts and
pushing them back to the analyst before release was a constant part
of the role. Finally, the backend was often a **black box** from the
tester's seat: a process would stall and there was no UI signal
explaining why. The senior version of this work was to dig the answer
out yourself - Kibana, database, SOAP traffic - rather than wait for
a developer to explain it.

## Lessons learned

**Telecom is a long domain onboarding, and the business pays for you from day one.**
The Plus domain takes months to internalise, but nobody on the project
will hold your hand through it. The chaos you feel for the first six
months becomes a coherent mental map in the second year, but only if
you invest your own time into learning it.

**Documentation lies, implementation is the truth, and the tester is the judge.**
Specs from the client were detailed but frequently drifted from what
was actually delivered. A tester is not just an executor of test
cases, they are the arbiter between what the business ordered and
what was built. Escalating those gaps is uncomfortable but
non-negotiable senior-grade work.

**Under a 30-day UAT deadline, prioritisation beats coverage.**
You will never test everything deeply. A senior knows where to invest
depth (high business risk, regulatory, cross-system flows) and where
smoke is enough. A junior tries to do everything and drowns.

**Cross-system flows live in your head, not on a checklist.**
A "customer acquisition" process touches four or five applications. A
senior holds the end-to-end flow in their head and can predict which
link will fail. A junior tests an application; a senior tests a
process.

**Leading a project is a new skillset, not a promotion from testing.**
Recruiting, onboarding, allocating work and reporting status to the
client is different work than testing. Being a strong tester does not
automatically make you a good lead - you have to invest in
communication, planning and judging people on purpose, not assume it
will appear by itself.
`,
};
