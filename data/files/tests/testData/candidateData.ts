import type { Language } from "@/app/ide/types";
import { formatYears, totalYearsExperience } from "@/lib/experience";

function buildContent(): string {
  const years = formatYears(totalYearsExperience());
  return `import { faker } from "@faker-js/faker";

// The single source of truth. Updated more often than my LinkedIn.
export const candidate = {
  fullName: "Jakub Bruniecki",
  role: "QA Automation Engineer",
  yearsOfExperience: ${years},
  stack: ["Playwright", "TypeScript", "Claude Code", "Postman"],
} as const;

// Skills the profile claims. If I lie here, CI tells on me.
export const expectedSkills = [
  "AI-Augmented Testing",
  "Manual testing",
  "Test automation",
  "API testing",
  "Visual regression",
  "Accessibility (WCAG 2.2)",
];

// Used by TC01 (humble-brag trap) and TC04 (tricky-question gauntlet).
// Centralised so I can add a new bad question without grepping specs.
export const interviewQuestionBank = {
  humbleBragTrap: "What's your biggest weakness?",
  tricky: [
    "typeof null",
    "0.1 + 0.2 === 0.3",
    "Why are you leaving your current job?",
    "We are like family here — thoughts?",
  ],
} as const;

// Sentences that should make any sane candidate close the tab.
// @todo: TC for offer-page scanner that fails the build on any match.
export const RED_FLAGS = [
  "we are like family here",
  "rockstar developer wanted",
  "salary: competitive",
  "fast-paced environment",
  "we wear many hats",
  "unlimited PTO (please don't actually use it)",
  "we work hard, play hard",
  "must be a self-starter",
] as const;

// The opposite. Asserted indirectly by my willingness to reply within 24h.
export const GREEN_FLAGS = [
  "salary range posted upfront",
  "async-first communication",
  "written 'how we work' doc",
  "take-home capped at 2h",
  "interview process documented end-to-end",
] as const;

faker.seed(42); // reproducible recruiters — flaky tests are not on the menu.

// Three flavours of recruiter outreach. @todo: wire into softSkills TC06.
export const recruiterPersonas = [
  { style: "warm", opener: faker.lorem.sentence({ min: 6, max: 10 }) },
  { style: "blunt", opener: "We have a role. Are you in?" },
  { style: "verbose", opener: faker.lorem.paragraph() },
];

// Mentor topics for /reviews page. Still warming the bench — see softSkills TC05.
export const mentorScenarios = [
  { topic: "async testing", slug: "async-testing" },
  { topic: "your first flaky test", slug: "first-flaky-test" },
  { topic: "disagreeing in code review", slug: "code-review-disagreement" },
];

// For when "works on my machine" gets a timezone twist.
export const globalTeamTimezones = [
  { city: "Warsaw", slug: "warsaw", tz: "Europe/Warsaw" },
  { city: "New York", slug: "new-york", tz: "America/New_York" },
  { city: "Tokyo", slug: "tokyo", tz: "Asia/Tokyo" },
];
`;
}

const content = buildContent();

export const candidateData = {
  path: "tests/test-data/candidate.data.ts",
  name: "candidate.data.ts",
  language: "ts" as Language,
  content,
};
