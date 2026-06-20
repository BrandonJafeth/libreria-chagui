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

Astro 6 + Tailwind CSS v4 + React (islands only) + Fontsource Inter. Static generation — no backend.

## Architecture

**Routing:** File-based via `src/pages/`. `producto/[slug].astro` uses `getStaticPaths()` from `getProducts()`.

**Data layer (critical):** ALL product access goes through `src/lib/products.ts` — never import `src/data/products.ts` directly in components. This layer is the Supabase migration boundary: swapping it to async Supabase calls is the only change needed when migrating.

**Component model:** `.astro` files for everything except the 3 justified React islands:
- `ProductGallery.tsx` — image carousel, `client:visible`
- `CatalogFilters.tsx` — filters + renders its own product grid, `client:visible`
- `VariantSelector.tsx` — color/variant state + WhatsApp CTA builder, `client:visible`

All other interactivity (navbar mobile, scroll-to-top) uses vanilla `<script>` in `.astro` files.

**Layout chain:** page → `BaseLayout.astro` → `Navbar` + `<slot>` + `Footer` + floating WA button + scroll-to-top + IntersectionObserver.

**Styling:** Tailwind v4 tokens in `src/styles/global.css` under `@theme {}` (no `tailwind.config.js`). Fonts via Fontsource imports — no Google Fonts. Single font: **Inter** (400/500/600/700).

**Reveal animations:** `.reveal` + IntersectionObserver in BaseLayout. Delay via `style="--d: 0.12s"`. Hero uses `.hero-in` CSS animation.

## Design system — Ferrari adapted to Chagui light palette

Ferrari editorial principles applied to a **light/crema canvas**. NOT a dark site.

**Rule: sharp corners everywhere.** No `rounded-full` or `rounded-xl` on buttons or major cards.

**Rule: single accent.** `text-accent` / `bg-accent` (Rojo Chagui) appears only on primary CTAs, prices, and active nav underline. Never decorative.

**Rule: WhatsApp = floating icon only.** Do not add WhatsApp pills or prominent buttons. The floating icon in BaseLayout handles all contact. Inline WA links (footer, service cards, catalog/product CTAs) are acceptable if contextually justified — but NOT in every CTA on every page.

**Rule: CTA diversity.** Each page's CtaBanner should lead somewhere meaningful, not always WhatsApp:
- `index.astro` → `/catalogo`
- `servicios.astro` → `/catalogo`
- `sobre-nosotros.astro` → `/contacto`
- `catalogo.astro` → WA (can't find product = valid)
- `producto/[slug].astro` → WA (product inquiry = valid)

**Rule: uppercase + tracking on nav and CTAs.**
- Nav links: `text-[12px] font-semibold tracking-[0.65px] uppercase`
- CTA labels: `text-[13px] font-bold tracking-[1.4px] uppercase`

## Palette tokens

```
bg-background  → hsl(37 33% 96%)  crema
bg-card        → hsl(0 0% 100%)   white
text-accent    → hsl(6 63% 46%)   rojo Chagui — CTAs, prices, active
text-accent-2  → hsl(211 50% 36%) azul — info icons, location
text-accent-3  → hsl(36 80% 58%) amarillo — accents (scarce)
text-foreground → hsl(0 0% 17%)  dark text
```

## Key files

- `src/data/site.ts` — nav links, contact info, social URLs, WhatsApp base URL
- `src/data/products.ts` — quemado catalog (matches future Supabase shape)
- `src/data/services.ts` — services by category (4 groups: Impresión, Sublimación, Diseño, Fotografía)
- `src/lib/format.ts` — `formatPrice(n)` → `₡12.500`

## CtaBanner props

```ts
interface Props {
  eyebrow: string
  heading: string
  subtext: string
  buttonLabel: string
  buttonHref: string
  external?: boolean          // true for external URLs (WhatsApp, etc.)
  buttonIcon?: 'whatsapp' | 'arrow'  // defaults to 'arrow'
}
```

## TODO before launch

- Fotos reales de productos (reemplazar URLs PLACEHOLDER en `src/data/products.ts`)
- Dominio real en `astro.config.mjs` y `src/data/site.ts`
- Horario del negocio en `src/data/site.ts`
- Embed de Google Maps real en `src/pages/contacto.astro`
- Migración futura a Supabase: reescribir solo `src/lib/products.ts`
