---
name: chagui-ferrari-design
description: Design system enforcer for Librería y Bazar Chagui. Ferrari-derived dark editorial aesthetic adapted for a Costa Rican bookstore. Enforces palette, typography, component patterns, and anti-patterns. Load this before touching any UI file.
---

# Chagui × Ferrari — Design System Enforcer

> "The darkness of the canvas is not emptiness. It's precision."
> Librería Chagui runs on near-black. Every red is earned.

---

## Stack Context

Astro 6 + Tailwind v4 + React islands (`client:visible`). Static generation.

**Tailwind v4 — NO `tailwind.config.js`.** Tokens live in `src/styles/global.css` under `@theme {}`.

Data flows through `src/lib/products.ts` only. Never import `src/data/products.ts` directly.

---

## 1. The Canvas — Color Tokens

**Chagui is a LIGHT site.** Ferrari principles are applied TO the light palette — not replacing it with dark.

Use token names in Tailwind classes, inline values only when Tailwind can't reach them.

```
Background (crema)         →  hsl(37 33% 96%)  →  bg-background
Card (white surface)       →  hsl(0 0% 100%)   →  bg-card
Hairline (dividers)        →  rgba(43,43,43,0.08)  →  (inline style)

Rojo Chagui (primary CTA)  →  hsl(6 63% 46%)   →  bg-accent / text-accent
Rojo hover                 →  hsl(6 63% 38%)

Foreground (display text)  →  hsl(0 0% 17%)    →  text-foreground
Body (running text)        →  text-foreground/55 or /45
Muted (labels, captions)   →  text-foreground/30

Azul info (icons, links)   →  hsl(211 50% 36%) →  text-accent-2
Amarillo accent            →  hsl(36 80% 58%)  →  text-accent-3
WhatsApp green             →  #25D366          →  (icon fill only, never background)
```

**THE SINGLE ACCENT RULE:** `text-accent` (Rojo Chagui) is the ONLY CTA fill color. Primary buttons, price highlights, active nav underline. Nowhere else. Scarcity = impact.

---

## 2. Typography

Font: **Inter** (loaded via Fontsource, all weights). This is the FerrariSans substitute.
Classes: `font-heading` and `font-body` both resolve to Inter — no split families.

```
Display hero     → 500 weight, clamp(2.8rem, 7.5vw, 5.5rem), tracking-tight, lh 1.05
Section heads    → 500 weight, clamp(2.2rem, 5.5vw, 3.5rem), tracking-tight, lh 1.05
Component titles → 700 weight, 18px, lh 1.2
Nav links        → 600 weight, 13px, tracking-[0.65px], UPPERCASE
CTA labels       → 700 weight, 13px, tracking-[1.4px], UPPERCASE
Eyebrow labels   → 600 weight, 11px, tracking-[0.22em], UPPERCASE, color #969696 or white/35
Body text        → 400 weight, 14–16px, lh 1.5, color #969696
Caption          → 400 weight, 12px, lh 1.4
```

**Weight ceiling for display copy: 500.** Not bold. The photography and the red do the screaming.

---

## 3. Spacing Ladder

8px base unit. Named scale only — no ad-hoc `px` values.

| Token | Value | Tailwind |
|---|---|---|
| xxxs | 4px | p-1 |
| xxs | 8px | p-2 |
| xs | 16px | p-4 |
| sm | 24px | p-6 |
| md | 32px | p-8 |
| lg | 48px | p-12 |
| xl | 64px | p-16 |
| xxl | 96px | py-24 |
| super | 128px | py-32 |

Section vertical padding: `xxl` (py-24) for content bands, `super` (py-32) for hero depth.

---

## 4. Components

### Navbar — `src/components/Navbar.astro`

```
Height: h-16 (64px)
Background: #181818, solid (no glass, no pill)
Border: border-b, #2a2a2a
Container: max-w-7xl, px-6 lg:px-10
```

Nav links:
```
text-[13px] font-semibold tracking-[0.65px] uppercase
Idle:   text-white/50
Active: text-white
Hover:  text-white
```

**No WhatsApp pill in the navbar.** Mobile menu gets a subtle WA text link at the bottom with a small green icon, no button.

---

### Buttons

**Primary (Rosso CTA):**
```html
<a class="bg-accent text-white px-8 py-3.5 font-bold text-[13px] tracking-[1.4px] uppercase 
          hover:bg-[#b01e0a] active:bg-[#9d2211] active:scale-[0.98] transition-all duration-150">
  Label
  <svg><!-- arrow or contextual icon --></svg>
</a>
```

**Outline (on dark):**
```html
<a class="px-8 py-3.5 font-semibold text-[13px] tracking-[1.4px] uppercase text-white/60 
          hover:text-white active:scale-[0.98] transition-all duration-150"
   style="border:1px solid rgba(255,255,255,0.15);">
  Label
  <svg><!-- chevron --></svg>
</a>
```

**ZERO ROUNDED CORNERS on CTAs and cards. Sharp is the brand.**
`rounded-none` or no radius class. `rounded-full` is for badge pills only.

---

### WhatsApp — Floating Icon Only + CTA Diversity

**THE RULE: WhatsApp es contacto, no conversión.** El ícono flotante en BaseLayout maneja todo el contacto. Agregar más botones WA solo diluye la acción.

**Cuándo SÍ usar WA en CTA:**
- `catalogo.astro` — "no encontré el producto, escribime" → válido
- `producto/[slug].astro` — consulta puntual de producto → válido

**Cuándo NO usar WA en CTA (usar links internos):**
- `index.astro` → `/catalogo`
- `servicios.astro` → `/catalogo`
- `sobre-nosotros.astro` → `/contacto`

**CtaBanner acepta `buttonIcon?: 'whatsapp' | 'arrow'`** — omitir = arrow por defecto.

Defined in `src/layouts/BaseLayout.astro`. Fixed bottom-right. No text. No green pill.

```html
<!-- Inline SVG: green circle + WA phone logo, 56×56px -->
<a href="{whatsappBase}" class="fixed bottom-6 right-6 z-50 w-14 h-14 hover:scale-110 
                                 active:scale-95 transition-transform duration-150 drop-shadow-xl">
  <svg viewBox="0 0 56 56">...</svg>
</a>
```

Above it: a scroll-to-top circle button (appears after 500px scroll, `id="scroll-top"`).

---

### Hero Section — `src/components/sections/HeroHome.astro`

```
Background: bg-background (#181818)
Texture: .cuaderno-bg (very subtle white grid lines, ~2.2% opacity)
Accent glow: radial-gradient rgba(218,41,28,0.07) top-right corner
Vertical line: 1px, left 10%, rgba(218,41,28,0.35) with fade-in/out gradient
```

Layout: `grid lg:grid-cols-[1fr_380px]` — text left, product image right.
Image: no rounded corners. Box shadow `0 32px 80px -20px rgba(0,0,0,0.55)`.
Offset frame: `border: 1px solid rgba(218,41,28,0.18)`.
Stat badge: `bg-card` (`#252525`), `border: 1px solid #3a3a3a`, no rounding.

**CTAs in hero: both navigate to internal pages.** No WhatsApp as a hero CTA.
- Primary: "Ver catálogo" → `/catalogo`
- Secondary: "Ver servicios" → `/servicios`

---

### CTA Banner — `src/components/sections/CtaBanner.astro`

Full-width red band. The one place Rosso goes full-bleed.

```
Background: #da291c
Overlay: diagonal repeating-linear-gradient (black, 4% opacity) for texture
Bottom shadow: linear-gradient to top, rgba(155,14,1,0.45) for depth
Button: white bg, text-accent (Rosso), sharp corners, 13px/700/1.4px tracking
Layout: centered (exception to anti-center rule — this is a livery band, not a hero)
```

---

### Card Surfaces

```
bg-card (#252525)  →  elevated surface on dark canvas
border: 1px solid #3a3a3a  →  hairline border
No box-shadow tiers. Depth from brightness-step only.
```

BentoHomeServices cards use `bg-card` + colored `accent` top-border stripe (1.5px). This stays.

---

### Footer — `src/components/Footer.astro`

```
Background: #181818
Top border: 1px solid #2a2a2a
Column labels: 11px, 600, tracking-[0.18em], uppercase, #666666
Body text: 14px, #969696
Links: #969696 hover→#ffffff
Social icons: #252525 bg, border #3a3a3a, border-radius full, 36×36px
Location / phone icons: #4c98b9 (info blue)
WA icon: fill #25D366 (green, no pill)
```

---

## 5. Reveal Animations

`.reveal` class + IntersectionObserver in BaseLayout. Set delay with `style="--d: 0.12s"`.
Hero animations use `.hero-in` with CSS keyframe `hero-in`.

```css
/* hero-in: opacity 0→1, translateY 20px→0, blur 8px→0, 0.7s cubic */
/* reveal: opacity 0→1, translateY 22px→0, 0.65s cubic on .visible class */
```

**Reduced motion:** Both animations disabled via `prefers-reduced-motion`. Already handled in global.css.

---

## 6. Section IDs (internal anchor targets)

When buttons should scroll to a section, use these IDs:
```
#categorias    → FeaturesGrid section
#destacados    → ProductGrid section
#servicios     → BentoHomeServices section (also /servicios page)
#contacto      → CtaBanner / contacto page
```

---

## 7. Editorial Texture

`.cuaderno-bg` = repeating grid lines, white at 2.2% opacity, 32px grid.
Used on dark backgrounds as subtle depth. **Do NOT use on light backgrounds** (the pattern inverts to almost invisible there).

---

## 8. Anti-Patterns — These Are Banned

| What | Why banned |
|---|---|
| Dark background (`#181818`) everywhere | Chagui is a light/crema site — dark only on contrast bands (CtaBanner) |
| `rounded-full` on buttons | Pill CTAs = not Ferrari |
| `rounded-xl` / `rounded-2xl` on major cards | Sharp is brand precision |
| WhatsApp pill/button in navbar | Intrusive — floating icon handles contact |
| `text-accent` on decorative elements | Rojo = CTA only, scarce |
| Poppins font | Replaced by Inter |
| `box-shadow` glow effects | No outer glows — depth via shadow-sm/md only |
| Centered hero headings | Left-aligned. Split-screen. Always. |
| `h-screen` on hero | Use `min-h-[92svh]` |
| WhatsApp as hero CTA | Hero CTAs → /catalogo and /servicios |

---

## 9. File Map

```
src/styles/global.css          →  all @theme tokens + .liquid-glass + animations
src/layouts/BaseLayout.astro   →  floating WA button + scroll-to-top + reveal observer
src/components/Navbar.astro    →  dark flat header, no WA pill
src/components/Footer.astro    →  dark footer, hairline, muted palette
src/data/site.ts               →  all nav links, contact, social, WA base URL
src/lib/products.ts            →  ONLY way to access products (Supabase boundary)
src/components/sections/
  HeroHome.astro               →  cinema dark hero, internal CTAs
  FeaturesGrid.astro           →  photo cards w/ gradient overlay (works on dark ✓)
  BentoHomeServices.astro      →  dark cards, accent stripe, WA inquiry links
  CtaBanner.astro              →  full-bleed Rosso band, centered, sharp button
src/components/ui/
  SectionHeader.astro          →  heading + subtext, text-foreground + text-accent-3
  ProductCard.astro            →  bg-card surface, sharp corners
```

---

## 10. Quick Diagnostic Checklist

Before shipping any UI change, verify:

- [ ] Background is `#181818`, not cream or white
- [ ] All CTA buttons have sharp corners (no `rounded-*` except badge pills)
- [ ] Red (`#da291c`) appears only on primary CTAs, prices, and active states
- [ ] Nav links are white/50→white, uppercase, 0.65px tracking, no pill
- [ ] WhatsApp contact = floating icon only (bottom-right, `z-50`)
- [ ] Hero secondary CTA goes to internal page, not WhatsApp
- [ ] Body/descriptive text uses `#969696`, not `text-foreground/50` (which was for light mode)
- [ ] New sections use `bg-background` (dark) — no standalone white bands unless specifically editorial
- [ ] Section padding follows spacing ladder (`py-20` / `py-24` / `py-32`)
- [ ] Fonts are Inter only — no Poppins imports
