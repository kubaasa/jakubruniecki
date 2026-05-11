# Jakub Bruniecki — Portfolio

Personal portfolio website at [jakubruniecki.vercel.app](https://jakubruniecki.vercel.app).

Built with Next.js 16 (App Router), TypeScript (strict), Tailwind CSS v4, and `next/font/google`. Statically exported and hosted on Vercel.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint
npm run build        # static export to ./out
```

## Project layout

- `app/` — Next.js routes, root layout, global styles, OG image, favicon
- `components/sections/` — full-page sections (Hero, About, Skills, Projects, Contact)
- `components/ui/` — reusable primitives (`WindowChrome`, `CodeBlock`, `Badge`, `Avatar`, `SectionHeader`, `ProjectCard`, `NavBar`)
- `components/icons/` — inline SVG icon components
- `data/` — typed content (profile, skills, projects, contact)
- `types/` — shared TypeScript types
- `public/` — static assets (`photo.jpg`)
- `docs/superpowers/` — design spec and implementation plan

## License

All content (text, photo) © Jakub Bruniecki. Code structure is shared for personal reference and not licensed for reuse.
