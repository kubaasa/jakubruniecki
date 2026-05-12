import { profile } from "@/data/profile";
import { contactLinks, cvRequestHref } from "@/data/contact";
import {
  EmailIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";

const iconFor = {
  email: EmailIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};

export function MobileFallback() {
  return (
    <main className="block min-h-screen bg-bg-base px-6 py-10 text-fg md:hidden">
      <div className="flex flex-col items-center text-center">
        <img
          src="/photo.jpg"
          alt={profile.name}
          className="h-16 w-16 rounded-full border-2 border-border object-cover"
        />
        <h1 className="mt-4 text-xl font-semibold">{profile.name}</h1>
        <p className="mt-1 font-mono text-sm text-fg-muted">
          {profile.role} · {profile.tagline}
        </p>
      </div>

      <div className="mt-6 rounded-md border border-border bg-bg-surface p-4 font-mono text-xs text-fg-muted">
        Open on desktop for the full IDE experience — interactive file tree,
        terminal commands, and a live test runner.
      </div>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8">
        <div className="font-mono text-xs text-fg-muted">{"// contact"}</div>
        <ul className="mt-2 space-y-2">
          {contactLinks.map((c) => {
            const Icon = iconFor[c.icon];
            return (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="flex items-center gap-2 text-[14px] text-fg hover:text-accent-blue"
                >
                  <Icon className="h-4 w-4 text-fg-muted" />
                  {c.value}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href={cvRequestHref}
        className="mt-8 inline-flex items-center gap-2 rounded-md border border-accent-green/40 bg-accent-green/10 px-4 py-2 font-mono text-sm text-accent-green"
      >
        ✉ Request CV
      </a>
    </main>
  );
}
