import type { Dispatch } from "react";
import type {
  FileNode,
  IDEAction,
  TerminalLine,
} from "@/app/ide/types";
import { contactLinks, cvRequestHref, EMAIL } from "@/data/contact";
import {
  skills,
  SKILL_CATEGORY_ORDER,
  CATEGORY_LABEL,
} from "@/data/skills";
import {
  AUTOMATION_START,
  QA_START,
  halfYearSuffixed,
  yearsBetween,
} from "@/lib/experience";

export type CommandCtx = {
  files: FileNode[];
  dispatch: Dispatch<IDEAction>;
};

export type Command = {
  name: string;
  description: string;
  run: (args: string[], ctx: CommandCtx) => TerminalLine[];
};

const out = (text: string): TerminalLine => ({ kind: "output", text });
const err = (text: string): TerminalLine => ({ kind: "error", text });
const sys = (text: string, href?: string): TerminalLine =>
  href ? { kind: "system", text, href } : { kind: "system", text };

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "list commands",
    run: () => {
      const rows: Array<[string, string]> = [
        ["clear", "clear the terminal"],
        ["contact", "print email / linkedin / location / phone"],
        ["cv", "open CV request mailto"],
        ["help", "list commands"],
        ["philosophy", "how I approach testing"],
        ["skills", "list skills by category"],
        ["whoami", "short bio"],
      ];
      return [
        sys("Available commands:"),
        ...rows.map(([cmd, desc]): TerminalLine => ({
          kind: "helpRow",
          cmd,
          desc,
        })),
      ];
    },
  },
  cv: {
    name: "cv",
    description: "open CV request mailto",
    run: () => {
      if (typeof window !== "undefined") {
        window.open(cvRequestHref, "_blank");
      }
      return [
        out("Opening CV request email…"),
        sys("✉  I reply within 24h."),
      ];
    },
  },
  contact: {
    name: "contact",
    description: "print contact details",
    run: () => {
      const lines: TerminalLine[] = [];
      for (const c of contactLinks) {
        lines.push(sys(`${c.label.padEnd(10)} ${c.value}`, c.href));
      }
      const email = contactLinks.find((c) => c.icon === "email");
      if (email && typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(email.value).catch(() => {
          /* permission denied - silent. */
        });
        lines.push(out(`✓ email copied: ${email.value}`));
      }
      return lines;
    },
  },
  skills: {
    name: "skills",
    description: "list skills by category",
    run: () => {
      const lines: TerminalLine[] = [];
      for (const category of SKILL_CATEGORY_ORDER) {
        const names = skills
          .filter((s) => s.category === category)
          .map((s) => s.name);
        if (names.length === 0) continue;
        lines.push(out(`${CATEGORY_LABEL[category]}:`));
        lines.push(out(`  ${names.join(" · ")}`));
      }
      return lines;
    },
  },
  clear: {
    name: "clear",
    description: "clear the terminal",
    run: (_args, ctx) => {
      ctx.dispatch({ type: "TERMINAL_CLEAR" });
      return [];
    },
  },
  whoami: {
    name: "whoami",
    description: "short bio line",
    run: () => {
      const manual = halfYearSuffixed(
        yearsBetween(QA_START, AUTOMATION_START.getTime()),
      );
      const automation = halfYearSuffixed(yearsBetween(AUTOMATION_START));
      const sinceYear = QA_START.getFullYear();
      return [
        out(`Author: Jakub Bruniecki <${EMAIL}>`),
        out("Role:   QA Automation Engineer (Playwright/TS · manual senior)"),
        out(`Since:  ${sinceYear}  (${manual} manual · ${automation} automation)`),
        out("Cert:   ISTQB Foundation Level (CTFL)"),
        out("Where:  Gdańsk, PL · CET · open-to-work"),
      ];
    },
  },
  philosophy: {
    name: "philosophy",
    description: "how I approach testing",
    run: () => [
      sys("How I work:"),
      out("  • I show up at refinement and ask the awkward questions."),
      out("  • Scenarios are written before the first line of code is pushed."),
      out("  • I work embedded with developers - branches land on dev first, I verify, team merges."),
      out("  • AI is a tool, not a shortcut. Claude Code + Playwright MCP/CLI act as senior assistants in test design and triage."),
    ],
  },
  sudo: {
    name: "sudo",
    description: "elevate privileges",
    run: () => [
      out("[sudo] password for recruiter:"),
      err("sorry, you are not in the sudoers file. this incident will be reported."),
      sys("hint: try `cv` instead - you don't need sudo for that."),
    ],
  },
};

export function runCommand(raw: string, ctx: CommandCtx): TerminalLine[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const [name, ...rest] = trimmed.split(/\s+/);
  if (!name) return [];
  const cmd = commands[name];
  if (!cmd) return [err(`command not found: ${name}. Try 'help'.`)];
  return cmd.run(rest, ctx);
}
