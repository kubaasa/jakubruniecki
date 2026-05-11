import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// about.ts" title="About" />

      <div className="max-w-prose space-y-4 text-fg">
        {profile.bio.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed text-fg-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Badge label={`${profile.yearsOfExperience} years`} variant="tag" />
        {profile.experienceBreakdown.map((item) => (
          <Badge key={item} label={item} variant="muted" />
        ))}
      </div>
    </section>
  );
}
