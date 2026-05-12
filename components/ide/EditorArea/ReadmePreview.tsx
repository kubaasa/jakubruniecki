"use client";

import { profile } from "@/data/profile";

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "green" | "blue";
}) {
  const tones: Record<typeof tone, string> = {
    default:
      "border-border bg-bg-elevated text-fg",
    green:
      "border-accent-green/35 bg-accent-green/10 text-accent-green",
    blue:
      "border-accent-blue/35 bg-accent-blue/10 text-accent-blue",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] ${tones[tone]}`}
    >
      {tone !== "default" ? (
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
      ) : null}
      {children}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-border border-b-2 bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-fg">
      {children}
    </span>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-accent-string">
      {children}
    </code>
  );
}

export function ReadmePreview() {
  return (
    <div className="h-full overflow-auto bg-bg-base">
      <div className="mx-auto max-w-[880px] px-14 pb-20 pt-7 font-sans text-[14.5px] leading-[1.7] text-fg">
        <h1 className="mb-1 font-mono text-[26px] tracking-tight">
          jakubruniecki / portfolio
        </h1>
        <p className="mb-6 font-mono text-[13px] text-fg-muted">
          {profile.role} · {profile.location}
        </p>

        <div className="mb-1 mt-2 flex flex-wrap gap-1.5">
          <Badge tone="green">open to work</Badge>
          <Badge tone="blue">{profile.yearsOfExperience} years</Badge>
          <Badge>Playwright</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Fintech</Badge>
          <Badge>E-commerce</Badge>
        </div>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          About this workspace
        </h2>
        <p className="mb-3.5">
          This is an interactive portfolio. Browse files in the Explorer on the
          left, run the test suite on the right, or use the terminal below.
          Everything you see is real content — just shaped like the tool I work
          in every day.
        </p>

        <blockquote className="my-3.5 rounded-r-md border-l-[3px] border-accent-blue bg-bg-elevated px-3.5 py-1 italic text-fg-muted">
          I treat tests as a feature, not a tax. The goal isn&apos;t coverage
          numbers — it&apos;s catching the issues that would have shipped, and
          giving the team enough confidence to move faster.
        </blockquote>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          Quick navigation
        </h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <Code>about.ts</Code> — bio, focus areas, working style
          </li>
          <li>
            <Code>skills.ts</Code> — manual + automation toolkit
          </li>
          <li>
            <Code>projects.ts</Code> — demo repo + case study
          </li>
          <li>
            <Code>contact.ts</Code> — email, LinkedIn, CV on request
          </li>
          <li>
            <Code>case-studies/fintech-regression.md</Code> — 3 days → 4 hours
          </li>
          <li>
            <Code>tests/*.spec.ts</Code> — runnable in the right panel
          </li>
        </ul>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          Try the terminal
        </h2>
        <p className="mb-3.5">
          Type <Code>help</Code> in the terminal below to see commands. A few
          favourites: <Code>open about.ts</Code>, <Code>cv</Code>,{" "}
          <Code>contact</Code>.
        </p>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          Keyboard
        </h2>
        <p className="mb-3.5">
          Open the command palette with <Kbd>⌘</Kbd>
          <Kbd>K</Kbd> or <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>.
        </p>
      </div>
    </div>
  );
}
