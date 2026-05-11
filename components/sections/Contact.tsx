import { contactLinks } from "@/data/contact";
import type { ContactIcon } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  EmailIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/components/icons";

const iconMap: Record<
  ContactIcon,
  (props: { className?: string }) => React.JSX.Element
> = {
  email: EmailIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeader comment="// contact.ts" title="Let's talk" />

      <p className="mb-8 max-w-prose text-fg-muted">
        Open to international remote QA roles. Full CV available on request —
        drop me an email or message on LinkedIn.
      </p>

      <ul className="space-y-3">
        {contactLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const isExternal = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group inline-flex items-center gap-3 rounded text-fg transition hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
              >
                <Icon className="h-5 w-5 text-fg-muted transition group-hover:text-accent-green" />
                <span className="font-mono text-sm">{link.value}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <footer className="mt-16 border-t border-border-subtle pt-6 text-sm text-fg-subtle">
        <p>© 2026 Jakub Bruniecki · Built with Next.js</p>
      </footer>
    </section>
  );
}
