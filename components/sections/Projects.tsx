import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// projects.ts" title="Projects" />

      <div className="grid auto-rows-fr gap-6 lg:grid-cols-2">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </section>
  );
}
