import { profile } from "@/data/profile";
import { cvRequestHref } from "@/data/contact";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { CodeBlock, type CodeLine } from "@/components/ui/CodeBlock";
import { Avatar } from "@/components/ui/Avatar";

function buildBioLines(): ReadonlyArray<CodeLine> {
  return [
    [
      { kind: "keyword", text: "const" },
      { kind: "plain", text: " " },
      { kind: "ident", text: "me" },
      { kind: "plain", text: " " },
      { kind: "keyword", text: "=" },
      { kind: "punct", text: " {" },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "name" },
      { kind: "punct", text: ": " },
      { kind: "string", text: `'${profile.name}'` },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "role" },
      { kind: "punct", text: ": " },
      { kind: "string", text: `'${profile.role}'` },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "focus" },
      { kind: "punct", text: ": " },
      { kind: "string", text: `'${profile.tagline}'` },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "years" },
      { kind: "punct", text: ": " },
      { kind: "number", text: String(profile.yearsOfExperience) },
      { kind: "punct", text: "," },
    ],
    [
      { kind: "plain", text: "  " },
      { kind: "ident", text: "openToWork" },
      { kind: "punct", text: ": " },
      { kind: "boolean", text: String(profile.status === "open-to-work") },
      { kind: "punct", text: "," },
    ],
    [{ kind: "punct", text: "};" }],
  ];
}

export function Hero() {
  const lines = buildBioLines();

  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pt-20">
      <WindowChrome title="portfolio.ts">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <Avatar
            src="/photo.jpg"
            alt={`${profile.name}, ${profile.role}`}
            status="online"
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <CodeBlock lines={lines} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={cvRequestHref}
            className="rounded-md bg-accent-green/15 px-4 py-2 font-mono text-sm text-accent-green ring-1 ring-accent-green/30 transition hover:bg-accent-green/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          >
            ✉ Request CV
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-4 py-2 font-mono text-sm text-fg transition hover:border-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          >
            Contact →
          </a>
        </div>
      </WindowChrome>
    </section>
  );
}
