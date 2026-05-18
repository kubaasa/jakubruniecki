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
  tagline: "Manual leadership + Playwright automation",
  bio: [
    "I'm a QA engineer with 5 years of experience in Telecom. Most of that time was hands-on manual testing, now extended with Playwright automation suites that actually pay off — fewer regressions, faster releases, predictable outcomes.",
    "I treat tests as a feature, not a tax. The goal isn't coverage numbers — it's catching the issues that would have shipped, and giving the team enough confidence to move faster.",
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
