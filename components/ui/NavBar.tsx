"use client";

import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-mono text-sm text-fg hover:text-accent-green"
        >
          jakubbruniecki
        </a>

        {/* Desktop nav */}
        <ul className="hidden gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-sm text-fg-muted transition hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green rounded p-1"
        >
          <span className="font-mono text-lg">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <ul
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-border bg-bg-surface px-6 py-3 md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-mono text-sm text-fg-muted transition hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
