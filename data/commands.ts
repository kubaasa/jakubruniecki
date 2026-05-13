import type { Dispatch } from "react";
import type {
  FileNode,
  IDEAction,
  TerminalLine,
} from "@/app/ide/types";
import { allFiles } from "@/data/files";
import { contactLinks, cvRequestHref } from "@/data/contact";
import { projects } from "@/data/projects";
import {
  skills,
  SKILL_CATEGORY_ORDER,
  CATEGORY_LABEL,
} from "@/data/skills";

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

function resolveFilePath(arg: string): string | null {
  if (allFiles.some((f) => f.path === arg)) return arg;
  for (const prefix of ["", "portfolio/", "tests/", "case-studies/"]) {
    const p = prefix + arg;
    if (allFiles.some((f) => f.path === p)) return p;
  }
  const q = arg.toLowerCase();
  const candidates = allFiles.filter((f) => {
    let i = 0;
    const lower = f.path.toLowerCase();
    for (const ch of lower) {
      if (ch === q[i]) i++;
      if (i === q.length) return true;
    }
    return false;
  });
  if (candidates.length === 1) return candidates[0]!.path;
  return null;
}

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "list commands",
    run: () => {
      const rows: Array<[string, string]> = [
        ["help", "list commands"],
        ["whoami", "short bio"],
        ["open <file>", "open a file in the editor"],
        ["projects", "list public projects"],
        ["skills", "list skills by category"],
        ["contact", "print email / linkedin / location / phone"],
        ["cv", "open CV request mailto"],
        ["clear", "clear the terminal"],
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
          /* permission denied — silent. */
        });
        lines.push(out(`✓ email copied: ${email.value}`));
      }
      return lines;
    },
  },
  projects: {
    name: "projects",
    description: "list public projects",
    run: () => {
      const lines: TerminalLine[] = [];
      for (const p of projects) {
        if (p.type === "demo-repo") {
          lines.push(out(`● ${p.title} — demo repo`));
          lines.push(out(`    ${p.tech.join(" · ")}`));
          lines.push(sys(`    ${p.githubUrl}`, p.githubUrl));
        } else {
          lines.push(out(`● ${p.title} — case study (${p.industry})`));
          lines.push(out(`    ${p.metrics.join(" · ")}`));
        }
        lines.push(out(""));
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
  open: {
    name: "open",
    description: "open a file in the editor",
    run: (args, ctx) => {
      const arg = args.join(" ").trim();
      if (!arg) return [err("open: missing file")];
      const path = resolveFilePath(arg);
      if (!path) return [err(`error: no such file: ${arg}`)];
      ctx.dispatch({ type: "OPEN_FILE", path });
      return [out(`opened ${path}`)];
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
    run: () => [out("jakubruniecki @ Warsaw · CET · open-to-work")],
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
