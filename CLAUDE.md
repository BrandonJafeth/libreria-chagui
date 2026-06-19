# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Dev server (localhost:4321)
pnpm build      # Build to dist/
pnpm preview    # Preview built site
```

Package manager: **pnpm**. Node >= 22.12.0 required.

## Stack

Astro 6 + Tailwind CSS v4 + React (islands only) + Fontsource fonts. Static generation — no backend.

## Architecture

**Routing:** File-based via `src/pages/`. `producto/[slug].astro` uses `getStaticPaths()` from `getProducts()`.

**Data layer (critical):** ALL product access goes through `src/lib/products.ts` — never import `src/data/products.ts` directly in components. This layer is the Supabase migration boundary: swapping it to async Supabase calls is the only change needed when migrating.

**Component model:** `.astro` files for everything except the 3 justified React islands:
- `ProductGallery.tsx` — image carousel, `client:visible`
- `CatalogFilters.tsx` — filters + renders its own product grid, `client:visible`
- `VariantSelector.tsx` — color/variant state + WhatsApp CTA builder, `client:visible`

All other interactivity (navbar mobile, scroll shadow) uses vanilla `<script>` in `.astro` files.

**Layout chain:** page → `BaseLayout.astro` → `Navbar` + `<slot>` + `Footer` + IntersectionObserver script.

**Styling:** Tailwind v4 tokens defined in `src/styles/global.css` under `@theme {}` (no `tailwind.config.js`). Liquid-glass utilities also in `global.css`. Fonts via Fontsource imports at top of `global.css` — no Google Fonts `<link>`.

**Reveal animations:** `.reveal` class + IntersectionObserver in BaseLayout. Set delay with `style="--d: 0.12s"`. Hero animations use `.hero-in` with CSS animation.

## Key files

- `src/data/site.ts` — all nav links, contact info, social URLs, WhatsApp base URL
- `src/data/products.ts` — quemado catalog (shape matches future Supabase table)
- `src/data/services.ts` — services grouped by category (no prices, WhatsApp only)
- `src/lib/format.ts` — `formatPrice(n)` → `₡12.500`

## Palette tokens

```
bg-background  → #FAF7F2 crema
bg-card        → #FFFFFF
text-accent    → #C0392B rojo Chagui (buttons, prices, CTAs)
text-accent-2  → #2E5C8A azul (badges, links)
text-accent-3  → #E8A33D amarillo (accents)
text-foreground → #2B2B2B
```

## TODO before launch

- Fotos reales de productos (reemplazar URLs PLACEHOLDER en `src/data/products.ts`)
- Dominio real en `astro.config.mjs` y `src/data/site.ts`
- Horario del negocio en `src/data/site.ts`
- Embed de Google Maps real en `src/pages/contacto.astro`
- Ajustar/agregar servicios en `src/data/services.ts`
- Migración futura a Supabase: reescribir solo `src/lib/products.ts`
