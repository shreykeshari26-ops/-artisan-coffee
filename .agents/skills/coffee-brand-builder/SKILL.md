---
name: coffee-brand-builder
description: Expert in luxury artisan coffee UI and e-commerce logic.
---

# Coffee Brand Builder

Use this skill to guide the development and modification of the Artisan Coffee Works website. This document enforces a cohesive, luxury brand identity across all user interfaces, components, and interactions.

## 🎨 Design System & Tokens

### Color Palette
- **Deep Espresso**: `#1B1411` (Primary Background / High-contrast text)
- **Warm Cream**: `#F5E6D3` (Primary Text / Light Background elements)
- **Soft Gold**: `#D4AF37` (Accents, Buttons, Highlights, Borders)
- **Dark Roast Overlay**: `rgba(0, 0, 0, 0.88)` (For text readability over images)
- **Glassmorphism Base**: `rgba(212, 175, 55, 0.03)` with `rgba(212, 175, 55, 0.35)` borders

### Typography
- **Headings (H1, H2, Display)**: Modern Serif (`'Playfair Display', 'Georgia', serif`)
  - Use tracking (letter-spacing) tight for large headings (e.g., `-0.02em`).
- **Body Text**: Clean Sans-Serif (`system-ui, 'Segoe UI', Roboto, sans-serif`)
  - Keep line-height relaxed (`1.7` - `1.8`) for readability.
- **Eyebrows / Micro-copy**: Serif or Monospace with wide tracking (`0.2em` - `0.3em`), uppercase, and Soft Gold.

## 🧩 UI Component Registry (shadcn-ui)

When scaffolding or updating components, refer to the local `@shadcn-ui` skill and implement these custom variants:

### 1. Buttons
- **Variant:** `rounded-full`
- **Style:** Transparent background with a `1px` solid Soft Gold border (`rgba(212, 175, 55, 0.5)`).
- **Hover State:** Solid Soft Gold background (`#D4AF37`), Deep Espresso text (`#000`), slight vertical translation (`-1px`).
- **Typography:** Uppercase, wide tracking (`0.14em`), `0.68rem` font size.

### 2. Cards
- **Variant:** `glassmorphism`
- **Style:** Subtle transparent background (`rgba(212, 175, 55, 0.02)`), delicate borders (`1px solid rgba(212, 175, 55, 0.3)`).
- **Hover State:** Elevate slightly or increase border opacity to `0.4`.
- **Content:** Emphasize sensory descriptions (aroma, roast level, origin).

### 3. Dialogs & Overlays
- **Style:** Dark overlays with frosted glass effects.
- **Typography:** Elegant serif titles and sans-serif functional text.

## 📐 Layout & Grid Specification

### 'Why Choose Us' Section
- **Grid:** 3-column or 4-column balanced grid on desktop, stacking to 1-column on mobile.
- **Cards:** Glassmorphism cards with circular iconography or imagery.
- **Spacing:** Generous padding (e.g., `5rem` top/bottom) to let the content breathe.

### 'Visit Us' Section
- **Layout:** Split layout (50/50). Left side containing typography and address details; right side containing a stylized map or interior photography.
- **Integration:** Use Soft Gold accents for dividers and location pins.

## 🗣️ Brand Voice

**Core Theme:** "Savor the Perfect Brew"
- **Tone:** Sophisticated, sensory, deliberate, and artisanal.
- **Messaging:** Focus on the origin, the craft, and the experience.
- **Examples:**
  - *"Hand-selected from single-origin farms..."*
  - *"Roasted to 200 °C to lock in peak flavour..."*
  - *"Perfection on demand, every single time."*

## 🗺️ Multi-Page Schema (Logic)

The application follows a structured Multi-Page Schema. Ensure smooth transitions and consistent state management across these routes:
1. **Home (`/`)**: Cinematic Hero, 'Why Choose Us', 'Visit Us'.
2. **Menu (`/menu`)**: Dark luxury, single-column vertical list of products.
3. **Bean Story (`/story`)**: Sticky cinematic scroller detailing the sourcing and roasting process.
4. **Contact (`/contact`)**: Form and location details with glassmorphism inputs.

## ⚙️ Technical Rules

- Always verify database schema in `server/database.js` before adding new products or modifying order structures.
- Ensure all animations (GSAP/ScrollTrigger) are optimized, using `requestAnimationFrame` where appropriate and cleaning up on unmount.
- Refer to the `.agents/examples/` folder for visual consistency and layout references.