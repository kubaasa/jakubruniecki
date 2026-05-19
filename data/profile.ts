import type { Profile } from "@/types";
import {
  AUTOMATION_START,
  QA_START,
  halfYearSuffixed,
  totalYearsExperience,
  yearsBetween,
} from "@/lib/experience";

export const profile: Profile = {
  name: "Jakub Bruniecki",
  role: "QA Automation Engineer",
  tagline: "Manual senior. Automation builder. AI-augmented.",
  bio: [
    "I'm a QA engineer with 5 years of experience in Telecom. Most of that time was hands-on manual testing, now extended with Playwright automation suites that actually pay off: fewer regressions, faster releases, predictable outcomes.",
    "These days QA is half thinking, half tooling. AI runs alongside me through test design, debugging, and code review. One engineer with the right tools can do what a team used to.",
  ],
  location: "Gdańsk, Poland · Open to international remote",
  status: "open-to-work",
  get yearsOfExperience() {
    return totalYearsExperience();
  },
  get experienceBreakdown() {
    const manual = halfYearSuffixed(
      yearsBetween(QA_START, AUTOMATION_START.getTime()),
    );
    const automation = halfYearSuffixed(yearsBetween(AUTOMATION_START));
    return [
      `${manual} manual testing`,
      `${automation} test automation`,
      "Telecom",
    ];
  },
  cvDelivery: "on-request",
};
