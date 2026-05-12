import type { TestSuite } from "@/app/ide/types";

export const initialTestSuites: TestSuite[] = [
  {
    name: "Jakub Bruniecki — candidate",
    file: "tests/candidate.spec.ts",
    cases: [
      { name: "has 5 years of QA experience", durMs: 12, status: "idle" },
      { name: "writes maintainable Playwright code", durMs: 18, status: "idle" },
      { name: "cuts regression from 3d to 4h", durMs: 11, status: "idle" },
    ],
  },
  {
    name: "soft skills",
    file: "tests/soft-skills.spec.ts",
    cases: [
      { name: "communicates clearly", durMs: 9, status: "idle" },
      { name: "mentors juniors", durMs: 7, status: "idle" },
      { name: "owns the outcome", durMs: 14, status: "idle" },
    ],
  },
  {
    name: "availability",
    file: "tests/availability.spec.ts",
    cases: [
      { name: "is open to work", durMs: 6, status: "idle" },
      { name: "responds within 24h", durMs: 8, status: "idle" },
      { name: "considers remote roles", durMs: 7, status: "idle" },
    ],
  },
  {
    name: "the bottom line",
    file: "tests/hire-me.spec.ts",
    cases: [{ name: "hire me", durMs: 22, status: "idle" }],
  },
];
