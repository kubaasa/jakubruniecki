import type { TestSuite } from "@/app/ide/types";

export const initialTestSuites: TestSuite[] = [
  {
    name: "Candidate profile",
    file: "tests/specs/candidate.spec.ts",
    cases: [
      {
        name: 'TC01 - should handle "whats your biggest weakness?" without stack overflow',
        durMs: 18,
        status: "idle",
      },
      {
        name: "TC02 - should handle 3 AM on-call page without coffee dependency",
        durMs: 22,
        status: "idle",
      },
      {
        name: "TC03 - should load candidate profile without red flags",
        durMs: 11,
        status: "idle",
      },
      {
        name: "TC04 - should not throw NullPointerException on tricky interview questions",
        durMs: 28,
        status: "idle",
      },
    ],
  },
  {
    name: "Soft skills",
    file: "tests/specs/soft-skills.spec.ts",
    cases: [
      { name: "TC05 - should mentor juniors without ego", durMs: 9, status: "idle" },
      { name: "TC06 - should disagree without burning bridges", durMs: 10, status: "idle" },
      { name: "TC07 - should keep cool under production fire", durMs: 15, status: "idle" },
    ],
  },
  {
    name: "Visual regression",
    file: "tests/specs/visual.spec.ts",
    cases: [
      {
        name: "TC08 - new hire should pass team vibe check on day one",
        durMs: 28,
        status: "idle",
      },
      {
        name: "TC09 - after-hours crew session should still render in dark mode",
        durMs: 24,
        status: "idle",
      },
      {
        name: "TC10 - should prove the new hire survived first Friday deploy",
        durMs: 18,
        status: "idle",
      },
    ],
  },
  {
    name: "Hiring API",
    file: "tests/specs/api.spec.ts",
    cases: [
      {
        name: "TC11 - should return 400 when offer payload forgets the salary",
        durMs: 7,
        status: "idle",
      },
      {
        name: "TC12 - should fall back to tea when /api/coffee returns 503",
        durMs: 12,
        status: "idle",
      },
      { name: "TC13 - should expire the offer link after 7 days", durMs: 10, status: "idle" },
    ],
  },
];
