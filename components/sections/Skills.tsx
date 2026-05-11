import { skills } from "@/data/skills";
import type { Skill, SkillCategory } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const categoryLabels: Record<SkillCategory, string> = {
  automation: "Automation",
  manual: "Manual & QA process",
  tools: "Tools",
};

const categoryOrder: ReadonlyArray<SkillCategory> = [
  "automation",
  "manual",
  "tools",
];

function groupByCategory(
  list: ReadonlyArray<Skill>
): Record<SkillCategory, ReadonlyArray<Skill>> {
  const empty: Record<SkillCategory, Array<Skill>> = {
    automation: [],
    manual: [],
    tools: [],
  };
  for (const skill of list) {
    empty[skill.category].push(skill);
  }
  return empty;
}

export function Skills() {
  const grouped = groupByCategory(skills);

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// skills.ts" title="Skills" />

      <div className="space-y-8">
        {categoryOrder.map((cat) => (
          <div key={cat}>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-fg-muted">
              {categoryLabels[cat]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {grouped[cat].map((skill) => (
                <Badge
                  key={skill.name}
                  label={skill.name}
                  variant="level"
                  level={skill.level}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
