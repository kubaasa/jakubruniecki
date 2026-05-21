"use client";

import Image from "next/image";
import type { ComponentType } from "react";

import { useIDE } from "@/app/ide/IDEContext";
import {
  ClaudeIcon,
  CursorIcon,
  GitLabIcon,
  PlaywrightIcon,
  PostmanIcon,
} from "@/components/icons";
import { TSIcon } from "@/components/ui/Icon";
import { profile } from "@/data/profile";

type Tone = "default" | "green" | "blue";

type IconComponent = ComponentType<{ className?: string }>;

const TECH_BADGES: { Icon: IconComponent; label: string }[] = [
  { Icon: PlaywrightIcon, label: "Playwright" },
  { Icon: TSIcon, label: "TypeScript" },
  { Icon: PostmanIcon, label: "Postman" },
  { Icon: GitLabIcon, label: "GitLab" },
];

const AI_BADGES: { Icon: IconComponent; label: string }[] = [
  { Icon: ClaudeIcon, label: "Claude Code" },
  { Icon: CursorIcon, label: "Cursor" },
];

function SplitBadge({
  left,
  right,
  rightTone = "default",
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  rightTone?: Tone;
}) {
  const rightTones: Record<Tone, string> = {
    default: "bg-bg-elevated text-fg",
    green: "bg-accent-green/20 text-accent-green",
    blue: "bg-accent-blue/20 text-accent-blue",
  };
  return (
    <span className="inline-flex items-stretch overflow-hidden rounded-md border border-border font-mono text-[11px]">
      <span className="flex items-center gap-1 bg-bg-subtle px-2 py-0.5 text-fg-muted">
        {left}
      </span>
      <span
        className={`flex items-center border-l border-border px-2 py-0.5 ${rightTones[rightTone]}`}
      >
        {right}
      </span>
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
    <code className="rounded bg-bg-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-sx-string">
      {children}
    </code>
  );
}

function FileLink({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { dispatch } = useIDE();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "OPEN_FILE", path })}
      className="cursor-pointer rounded bg-bg-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-sx-string transition-colors hover:bg-bg-elevated hover:text-accent-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
    >
      {children}
    </button>
  );
}

export function ReadmePreview() {
  return (
    <div className="@container h-full overflow-auto bg-bg-base">
      <div className="mx-auto max-w-[1100px] px-14 pb-20 pt-7 font-sans text-[14.5px] leading-[1.7] text-fg">
        <div className="mb-1 flex items-start justify-between gap-8">
          <div className="min-w-0 flex-1 @[900px]:pr-[110px]">
            <h1 className="mb-1 font-mono text-[26px] tracking-tight">
              Jakub Bruniecki / QA Automation Engineer
            </h1>
            <p className="mb-6 font-mono text-[13px] text-fg-muted">
              Gdańsk, Poland · Open to international remote
            </p>

            <div className="mt-2 flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-1.5">
                <SplitBadge left="status" right="open to work" rightTone="green" />
                <SplitBadge
                  left="exp"
                  right={`${profile.yearsOfExperience} years`}
                  rightTone="blue"
                />
                <SplitBadge left="domain" right="Telecom" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TECH_BADGES.map(({ Icon, label }) => (
                  <SplitBadge
                    key={label}
                    left={<Icon className="h-4 w-4" />}
                    right={label}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AI_BADGES.map(({ Icon, label }) => (
                  <SplitBadge
                    key={label}
                    left={<Icon className="h-4 w-4" />}
                    right={label}
                  />
                ))}
              </div>
            </div>
          </div>
          <Image
            src="/photo.jpg"
            alt="Jakub Bruniecki"
            width={200}
            height={200}
            priority
            className="hidden h-[140px] w-[140px] flex-shrink-0 rounded-xl object-cover shadow-lg shadow-black/40 ring-1 ring-border @[680px]:block @[900px]:h-[200px] @[900px]:w-[200px] @[900px]:-translate-x-1/2"
          />
        </div>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          A QA&apos;s workspace, in your browser
        </h2>
        <p className="mb-3.5">
          Any given morning: files open on the left, a test suite waiting on
          the right, the terminal blinking below. I rebuilt that view for the
          browser so you can sit in my seat for a few minutes. Click, run, type
          - every piece is real content about how I work.
        </p>

        <blockquote className="mx-auto my-6 max-w-[820px] space-y-1.5 rounded-md border border-border-subtle bg-bg-elevated px-6 py-5 text-center italic text-fg-muted">
          <p>
            AI didn&apos;t replace my testing instincts. It removed the friction between having them and acting on them.
          </p>
          <p>
            What used to take days of test authoring now takes an afternoon
          </p>
          <p>
            so I spend the rest hunting the bugs no script would catch.
          </p>
        </blockquote>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          Quick navigation
        </h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <FileLink path="portfolio/about.ts">about.ts</FileLink> - Who I am as an engineer,  what I focus on, how I work with teams, and what I think tests are actually for
          </li>
          <li>
            <FileLink path="portfolio/skills.ts">skills.ts</FileLink> - 23 tools across 7 categories: automation, manual, API, CI/CD, debugging, test management, and the AI stack I actually use
          </li>
          <li>
            <FileLink path="portfolio/projects.ts">projects.ts</FileLink> - Two real projects, both telecom, both via Asseco: Cyfrowy Polsat self-service (automation, ongoing) and Polkomtel/Plus (manual UAT, 25+ releases)
          </li>
          <li>
            <FileLink path="portfolio/contact.ts">contact.ts</FileLink> - Every way to reach me - email for serious chats, LinkedIn for the slow lane, CV available on request
          </li>
        </ul>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          Try the terminal
        </h2>
        <p className="mb-3.5">
          Type <Code>help</Code> in the terminal below to see what it can do. A
          few favourites: <Code>cv</Code>, <Code>contact</Code>,{" "}
          <Code>whoami</Code>, or <Code>philosophy</Code>.
        </p>

        <h2 className="mb-2.5 mt-7 border-b border-border-subtle pb-1.5 font-mono text-[18px]">
          Keyboard
        </h2>
        <p className="mb-3.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd> or <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd> opens the command palette.
        </p>
        <p className="mb-3.5">
          <Kbd>↑</Kbd> in the terminal replays your last command.
        </p>
        <p className="mb-3.5">
          And if you crack open DevTools, there&apos;s a hello waiting in the
          console.
        </p>
      </div>
    </div>
  );
}
