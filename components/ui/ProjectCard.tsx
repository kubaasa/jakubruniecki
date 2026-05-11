import type { Project } from "@/types";
import { Badge } from "./Badge";
import { GitHubIcon } from "@/components/icons";

type ProjectCardProps = { project: Project };

export function ProjectCard({ project }: ProjectCardProps) {
  if (project.type === "demo-repo") {
    return (
      <article className="flex h-full flex-col rounded-lg border border-border bg-bg-surface p-6 transition hover:border-fg-muted">
        <header className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-mono text-lg font-semibold text-fg">
            <span className="mr-2 text-accent-green" aria-hidden>
              ▣
            </span>
            {project.title}
          </h3>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub repository for ${project.title}`}
            className="flex-shrink-0 text-fg-muted transition hover:text-fg"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        </header>

        <p className="mb-4 text-sm text-fg-muted">{project.description}</p>

        <ul className="mb-4 list-none space-y-1 text-sm text-fg">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-accent-green" aria-hidden>
                ›
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {project.tech.map((t) => (
            <Badge key={t} label={t} variant="tag" />
          ))}
        </div>
      </article>
    );
  }

  // project.type === "case-study" — narrowed by TS
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-bg-surface p-6 transition hover:border-fg-muted">
      <header className="mb-3 flex items-center gap-3">
        <Badge label={project.industry} variant="muted" />
        <span className="font-mono text-xs text-fg-subtle">
          {project.duration}
        </span>
      </header>

      <h3 className="mb-3 text-lg font-semibold text-fg">{project.title}</h3>
      <p className="mb-4 text-sm text-fg-muted">{project.description}</p>

      <ul className="mb-4 space-y-1">
        {project.metrics.map((m) => (
          <li key={m} className="font-mono text-sm text-accent-green">
            → {m}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {project.techUsed.map((t) => (
          <Badge key={t} label={t} variant="tag" />
        ))}
      </div>

      <footer className="mt-4 border-t border-border-subtle pt-3 text-xs text-fg-subtle">
        Anonymized — details available on request.
      </footer>
    </article>
  );
}
