import type { Language } from "@/app/ide/types";
import {
  skills,
  SKILL_CATEGORY_ORDER,
  LEVEL_EMOJI,
  CATEGORY_EMOJI,
} from "@/data/skills";

const NAME_COL = 36;
const LEVEL_COL = 16;

const pad = (s: string, width: number) =>
  s.length >= width ? s : s + " ".repeat(width - s.length);

function buildContent(): string {
  const sections = SKILL_CATEGORY_ORDER.map((category) => {
    const rows = skills
      .filter((s) => s.category === category)
      .map((s) => {
        const name = pad(JSON.stringify(s.name) + ",", NAME_COL);
        const level = pad(`"${LEVEL_EMOJI[s.level]}"`, LEVEL_COL);
        return `    { name: ${name} level: ${level}},`;
      })
      .join("\n");

    return `  // ${CATEGORY_EMOJI[category]} ${category}\n  "${category}": [\n${rows}\n  ],`;
  }).join("\n\n");

  return `// skills.ts — grouped by category, levelled honestly.
// legend:  🏆 senior   🔥 advanced   ⚡ intermediate   🌱 beginner

type Level = "🏆 senior" | "🔥 advanced" | "⚡ intermediate" | "🌱 beginner";
type Skill = { name: string; level: Level };

export const skills: Record<string, Skill[]> = {
${sections}
};
`;
}

export const skillsTs = {
  path: "portfolio/skills.ts",
  name: "skills.ts",
  language: "ts" as Language,
  get content() {
    return buildContent();
  },
};
