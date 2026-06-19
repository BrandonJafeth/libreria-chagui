# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Dev server
pnpm build      # Build to dist/
pnpm preview    # Preview built site
pnpm astro check  # TypeScript check
```

Package manager: **pnpm**. Node >= 22.12.0 required.

## Architecture

Astro 6 static site with Tailwind CSS 4. No backend, no database — pure static generation.

**Routing:** File-based via `src/pages/`. Each `.astro` file = one route.

**Component model:** `.astro` files have a fenced frontmatter block (`---`) for server-side JS/imports, then an HTML template below. Components render to static HTML at build time.

**Layout chain:** `src/pages/*.astro` → wraps in `src/layouts/Layout.astro` (root HTML shell) → imports reusable components from `src/components/`.

**Styling:** `src/styles/global.css` imports Tailwind via `@import "tailwindcss"`. Tailwind runs through Vite plugin (configured in `astro.config.mjs`).

**Static assets:** `src/assets/` — imported in components (Astro optimizes these). `public/` — served as-is at root.

**TypeScript:** Strict mode via `astro/tsconfigs/strict`. Astro generates types into `.astro/` (gitignored).

No lint or test tooling configured yet.
