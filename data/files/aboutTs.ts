import type { Language } from "@/app/ide/types";
import {
  AUTOMATION_START,
  QA_START,
  formatYears,
  formatYearsPhrase,
  halfYearSuffixed,
  yearsBetween,
} from "@/lib/experience";

function buildContent(): string {
  const totalYears = formatYears(yearsBetween(QA_START));
  const automationSplit = halfYearSuffixed(yearsBetween(AUTOMATION_START));
  const automationPhrase = formatYearsPhrase(yearsBetween(AUTOMATION_START));
  const manualSplit = halfYearSuffixed(
    yearsBetween(QA_START, AUTOMATION_START.getTime()),
  );

  return `// about.ts — who I am, in code.

type Profile = {
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly status: "open-to-work" | "employed" | "freelance";
  // ...
};

export const about = {
  // ─── identity ─────────────────────────────────────────────────
  name: "Jakub Bruniecki",
  role: "QA Automation Engineer 🤖",
  tagline: "Manual senior. Automation builder. AI-augmented. ⚡",

  // ─── experience ──────────────────────────────────────────────
  yearsOfExperience: ${totalYears}, // auto-updated, rounded to 0.5y
  split: { manual: "${manualSplit}", automation: "${automationSplit}" }, // manual frozen, automation auto-updated
  domain: "Telecom 📡",

  // ─── location & availability ─────────────────────────────────────
  location: "Gdańsk, Poland 🌊", // sometimes Bangkok, Thailand
  timezone: "Europe/Warsaw",
  openTo: "remote, EU-friendly hours 🌍",
  status: "open-to-work 🟢",

  // ─── certifications ──────────────────────────────────────────────
  certifications: ["ISTQB Foundation Level (CTFL) 🎓"],

  // ─── bio ─────────────────────────────────────────────────
  bio: [
    "QA engineer who grew up inside complex telecom systems —",
    "self-service portals, regulatory flows, digital signatures,",
    "device management. 25+ delivered projects, 2500+ tickets",
    "filed before they ever reached production.",
    "",
    "Last ${automationPhrase} I've been building Playwright + TypeScript",
    "frameworks from scratch — POM, auth-state reuse, API mocks,",
    "custom HTML reporting, CI on GitLab. AI is part of the stack:",
    "Claude Code and Playwright MCP cut test-authoring time ~4–5×.",
    "",
    "What I focus on is catching defects before they cost time.",
    "I show up at refinement, ask the awkward questions, and",
    "write scenarios before the first line of code is pushed.",
    "Coverage numbers don't interest me — the bugs I prevent do.",
    "Regression suites are the floor, not the strategy.",
    "",
    "I work embedded with developers, not after them. Branches",
    "land on dev environments first; I verify, the team merges.",
    "Together we debug logs and surface edge cases mid-flight;",
    "with PMs and analysts I keep acceptance criteria honest, so",
    "by release day the call is calm.",
  ],
} as const satisfies Profile;

export type About = typeof about;
`;
}

export const aboutTs = {
  path: "portfolio/about.ts",
  name: "about.ts",
  language: "ts" as Language,
  get content() {
    return buildContent();
  },
};
