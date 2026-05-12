import type { FileNode } from "@/app/ide/types";
import { readme } from "./readme";
import { aboutTs } from "./aboutTs";
import { skillsTs } from "./skillsTs";
import { projectsTs } from "./projectsTs";
import { contactTs } from "./contactTs";
import { envFile } from "./env";
import { candidateSpec } from "./tests/candidateSpec";
import { softSkillsSpec } from "./tests/softSkillsSpec";
import { availabilitySpec } from "./tests/availabilitySpec";
import { hireMeSpec } from "./tests/hireMeSpec";
import { fintechRegression } from "./caseStudies/fintechRegression";
import { ecommerceE2e } from "./caseStudies/ecommerceE2e";

function file(stub: {
  path: string;
  name: string;
  language: "ts" | "md" | "env";
  content: string;
}): FileNode {
  return {
    type: "file",
    name: stub.name,
    path: stub.path,
    language: stub.language,
    content: stub.content,
  };
}

export const fileTree: FileNode[] = [
  {
    type: "folder",
    name: "jakubruniecki",
    path: "jakubruniecki",
    defaultOpen: true,
    children: [
      {
        type: "folder",
        name: "portfolio",
        path: "portfolio",
        defaultOpen: true,
        children: [
          file(aboutTs),
          file(skillsTs),
          file(projectsTs),
          file(contactTs),
        ],
      },
      {
        type: "folder",
        name: "tests",
        path: "tests",
        defaultOpen: true,
        children: [
          file(candidateSpec),
          file(softSkillsSpec),
          file(availabilitySpec),
          file(hireMeSpec),
        ],
      },
      {
        type: "folder",
        name: "case-studies",
        path: "case-studies",
        defaultOpen: true,
        children: [file(fintechRegression), file(ecommerceE2e)],
      },
      file(readme),
      file(envFile),
    ],
  },
];

function flatten(nodes: FileNode[]): Extract<FileNode, { type: "file" }>[] {
  const out: Extract<FileNode, { type: "file" }>[] = [];
  for (const n of nodes) {
    if (n.type === "file") out.push(n);
    else out.push(...flatten(n.children));
  }
  return out;
}

export const allFiles = flatten(fileTree);

const byPath = new Map(allFiles.map((f) => [f.path, f]));

export function getFileByPath(path: string) {
  return byPath.get(path);
}
