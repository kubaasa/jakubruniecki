import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { contactLinks } from "@/data/contact";

export function SEOContent() {
  return (
    <div id="seo-content" className="sr-only">
      <h1>
        {profile.name} — {profile.role}
      </h1>
      <p>{profile.tagline}</p>

      <section aria-label="About">
        <h2>About</h2>
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p>
          Location: {profile.location}. Status: {profile.status}. Experience:{" "}
          {profile.yearsOfExperience} years (
          {profile.experienceBreakdown.join(", ")}).
        </p>
      </section>

      <section aria-label="Skills">
        <h2>Skills</h2>
        <ul>
          {skills.map((s) => (
            <li key={s.name}>
              {s.name} — {s.level} ({s.category})
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Projects">
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.type === "demo-repo" ? (
              <>
                <p>Tech: {p.tech.join(", ")}</p>
                <ul>
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <p>
                  <a href={p.githubUrl}>GitHub</a>
                </p>
              </>
            ) : (
              <>
                <p>
                  {p.industry} · {p.role} · {p.duration}
                </p>
                <ul>
                  {p.metrics.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <p>Tech used: {p.techUsed.join(", ")}</p>
              </>
            )}
          </article>
        ))}
      </section>

      <section aria-label="Contact">
        <h2>Contact</h2>
        <ul>
          {contactLinks.map((c) => (
            <li key={c.label}>
              <a href={c.href}>
                {c.label}: {c.value}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
