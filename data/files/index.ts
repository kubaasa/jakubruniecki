import type { FileNode, Language } from "@/app/ide/types";
import { readme } from "./readme";
import { aboutTs } from "./aboutTs";
import { skillsTs } from "./skillsTs";
import { projectsTs } from "./projectsTs";
import { contactTs } from "./contactTs";
import { envFile } from "./env";
import { authUserJson } from "./tests/auth/userJson";
import { playwrightConfig } from "./tests/playwrightConfig";
import { candidateSpecNew } from "./tests/specs/candidate";
import { softSkillsSpecNew } from "./tests/specs/softSkills";
import { visualSpec } from "./tests/specs/visual";
import { apiSpec } from "./tests/specs/api";
import { homePagePOM } from "./tests/pages/HomePage";
import { contactPagePOM } from "./tests/pages/ContactPage";
import { reviewsPagePOM } from "./tests/pages/ReviewsPage";
import { feedbackPagePOM } from "./tests/pages/FeedbackPage";
import { dashboardPagePOM } from "./tests/pages/DashboardPage";
import { recruiterFixture } from "./tests/fixtures/recruiterFixture";
import { candidateData } from "./tests/testData/candidateData";
import { helpers } from "./tests/utils/helpers";
import { candidateProfileChromiumSnapshot } from "./tests/visualSnapshots/candidateProfileChromium";
import { candidateProfileDarkChromiumSnapshot } from "./tests/visualSnapshots/candidateProfileDarkChromium";
import { candidateProfileChromiumDiffSnapshot } from "./tests/visualSnapshots/candidateProfileChromiumDiff";
import { cyfrowyPolsatSelfcareIPBW } from "./caseStudies/cyfrowyPolsatSelfcare-IPBW";
import { plusB2BSelfcare } from "./caseStudies/PlusB2Bselfcare";

function file(stub: {
  path: string;
  name: string;
  language: Language;
  content: string;
}): FileNode {
  return {
    type: "file",
    name: stub.name,
    path: stub.path,
    language: stub.language,
    get content() {
      return stub.content;
    },
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
        name: "case-studies",
        path: "case-studies",
        defaultOpen: true,
        children: [file(cyfrowyPolsatSelfcareIPBW), file(plusB2BSelfcare)],
      },
      {
        type: "folder",
        name: "tests",
        path: "tests",
        defaultOpen: true,
        children: [
          {
            type: "folder",
            name: ".auth",
            path: "tests/.auth",
            children: [file(authUserJson)],
          },
          {
            type: "folder",
            name: "specs",
            path: "tests/specs",
            children: [
              file(candidateSpecNew),
              file(softSkillsSpecNew),
              file(visualSpec),
              file(apiSpec),
            ],
          },
          {
            type: "folder",
            name: "pages",
            path: "tests/pages",
            children: [
              file(homePagePOM),
              file(contactPagePOM),
              file(reviewsPagePOM),
              file(feedbackPagePOM),
              file(dashboardPagePOM),
            ],
          },
          {
            type: "folder",
            name: "fixtures",
            path: "tests/fixtures",
            children: [file(recruiterFixture)],
          },
          {
            type: "folder",
            name: "test-data",
            path: "tests/test-data",
            children: [file(candidateData)],
          },
          {
            type: "folder",
            name: "utils",
            path: "tests/utils",
            children: [file(helpers)],
          },
          {
            type: "folder",
            name: "visual-snapshots",
            path: "tests/visual-snapshots",
            children: [
              {
                type: "folder",
                name: "visual.spec.ts-snapshots",
                path: "tests/visual-snapshots/visual.spec.ts-snapshots",
                children: [
                  file(candidateProfileChromiumSnapshot),
                  file(candidateProfileDarkChromiumSnapshot),
                  file(candidateProfileChromiumDiffSnapshot),
                ],
              },
            ],
          },
          file(playwrightConfig),
        ],
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
