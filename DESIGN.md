---
name: Cubby UI
description: Framework-agnostic UI components — pure HTML + Tailwind CSS, shadcn-style restraint
colors:
  primary: "hsl(221 83% 53%)"
  primary-foreground: "hsl(210 40% 99.5%)"
  background: "hsl(210 40% 98.8%)"
  foreground: "hsl(222.2 47.4% 11.2%)"
  card: "hsl(210 40% 99.5%)"
  muted: "hsl(210 40% 96.1%)"
  muted-foreground: "hsl(215 20% 41.5%)"
  border: "hsl(242 7% 88%)"
  ring: "hsl(221 83% 53%)"
  destructive: "hsl(0 84% 60%)"
  success: "hsl(142 71% 41%)"
  warning: "hsl(38 92% 62%)"
  info: "hsl(199 89% 53%)"
typography:
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "2.25rem"
---

# Design System: Cubby UI

## 1. Overview

**Creative North Star: "The Quiet Toolkit"**

Cubby UI is a tool that gets out of the way. It draws from the shadcn/ui lineage: confident, restrained, and quietly precise, never loud. Surfaces are calm and tinted toward a single cool-blue brand hue; the one saturated accent earns its place by being rare. The system favours soft corners, hairline borders, and shadows that suggest depth rather than announce it. Every interaction has a deliberate, short transition; nothing bounces, nothing shouts.

It explicitly rejects the over-stimulated end of the component-library spectrum: garish high-saturation accents, decorative gradients, glassmorphism for its own sake, and the dense, busy chrome of enterprise dashboards. The aesthetic reference points are shadcn/ui, Flowbite, and FlyonUI, not neon-on-black crypto dashboards or 2014-era skeuomorphism.

Because every `cu-` class is meant to be copied and pasted standalone, the visual system must hold together at the level of a single component, not just the whole page. Consistency is enforced through shared semantic tokens, not through a global cascade.

**Key Characteristics:**
- Cool-blue brand hue (221°) over tinted, near-neutral surfaces
- Hairline borders, soft corners (`0.5rem` controls, `0.75rem` overlays)
- Flat at rest; elevation is a response to state, not a default
- Short, purposeful motion (150–200ms, ease-out, no bounce)
- One accent, used sparingly

## 2. Colors

A restrained palette: tinted neutrals carry almost every surface, one cool-blue primary provides the single accent, and four feedback hues appear only in their semantic contexts.

### Primary
- **Brand Blue** (`hsl(221 83% 53%)`): The sole accent. Solid buttons, links, focus rings, active states, selection. Pairs with a near-white tinted foreground.

### Neutral
- **Tinted Background** (`hsl(210 40% 98.8%)`): The page canvas, faintly cool rather than stark white.
- **Card Surface** (`hsl(210 40% 99.5%)`): Slightly brighter than the canvas so cards lift without a shadow.
- **Foreground** (`hsl(222.2 47.4% 11.2%)`): Primary text, a deep desaturated navy, never pure black.
- **Muted / Muted Foreground** (`hsl(210 40% 96.1%)` / `hsl(215 20% 41.5%)`): Secondary surfaces and supporting text.
- **Border** (`hsl(242 7% 88%)`): Hairline dividers and input strokes.

### Feedback (used only in semantic contexts)
- **Destructive** (`hsl(0 84% 60%)`), **Success** (`hsl(142 71% 41%)`), **Warning** (`hsl(38 92% 62%)`), **Info** (`hsl(199 89% 53%)`): Each appears with a matched `bg-{color}/5` tint and `border-{color}/50` in alerts, toasts, and validation states.

### Named Rules
**The One Accent Rule.** Brand Blue is the only saturated colour on a default screen. If a layout reads as colourful, something is wrong; the accent's rarity is what gives it meaning.

**The No Pure White / Black Rule.** Every neutral is tinted toward the brand hue (even surfaces and foregrounds). `#fff` and `#000` are forbidden as token values.

**The Color-Mix Rule.** Semi-transparent semantic colours use `color-mix(in srgb, var(--color-*) N%, transparent)`, never hardcoded HSL or RGBA. Dark mode then adapts automatically.

## 3. Typography

**Display / Body / Label Font:** Inter (with `ui-sans-serif, system-ui, -apple-system, sans-serif` fallback)

**Character:** A single, neutral, highly legible sans across the whole system. There is no display/body contrast by family; hierarchy comes from scale and weight, not from mixing typefaces. This keeps copied components self-consistent without importing a second font.

### Hierarchy
- **Heading** (700, tight `-0.025em` tracking, `text-3xl`–`text-4xl` for page titles down to `text-lg`): Section and page titles via `cu-h1`–`cu-h5`.
- **Body** (400, `0.875rem`, `1.5` line-height): Default UI text. Long-form prose caps around 65–75ch.
- **Label** (500, `0.875rem`): Form labels, button text, table headers.
- **Muted / Small** (400–500, `0.75rem`–`0.875rem`, `muted-foreground`): Descriptions, timestamps, helper text via `cu-text-muted` / `cu-text-small`.

### Named Rules
**The One Family Rule.** Hierarchy is expressed through size and weight, never by introducing a second font family. Weight contrast between steps stays meaningful (≥ medium jump).

## 4. Elevation

The system is flat by default and uses a tight, three-step shadow vocabulary. Depth is a response to state and stacking context, not decoration. There is no glassmorphism except as a deliberate, sparse backdrop on the sticky header and carousel controls.

### Shadow Vocabulary
- **`shadow-xs`** — Resting cards and static surfaces. Barely-there separation.
- **`shadow-md`** — Floating layers: dropdowns, popovers, hover cards, combobox panels. In dark mode these gain `dark:shadow-lg dark:shadow-black/20`.
- **`shadow-lg`** — Overlay-level surfaces: Dialog, Drawer, Toast.

### Named Rules
**The Flat-By-Default Rule.** Cards are flat at rest; the hover shadow is opt-in (`cu-card-hover`), never automatic. Elevation appears only on hover, focus, or genuine layering.

## 5. Components

### Buttons
- **Shape:** Soft corners (`rounded-lg`, `0.5rem`).
- **Primary:** Brand Blue fill + tinted-white text, `hover:bg-primary/90` with a subtle `hover:shadow-sm` micro-lift.
- **Variants:** `secondary`, `outline`, `ghost` (muted-foreground that darkens on hover), `link`, `destructive`.
- **Focus:** `ring-2 ring-ring/40 ring-offset-2`. Icon buttons combine `cu-button-ghost` + `cu-button-icon`.

### Cards / Containers
- **Corner Style:** `rounded-xl` (`0.75rem`).
- **Background:** Card Surface, one step brighter than the canvas.
- **Shadow Strategy:** `shadow-xs` at rest; `cu-card-hover` or `cu-card-elevated` opt-in. See Elevation.
- **Border:** Hairline `border-border`.
- **Internal Padding:** `1.5rem` (`cu-card-content`), with `cu-card-content-flush` for table-in-card.

### Inputs / Fields
- **Style:** Hairline `border-input`, background canvas, `rounded-lg`, `h-9`. `appearance-none` with custom styling, never raw browser chrome.
- **Hover:** `hover:border-muted-foreground/30` micro-interaction.
- **Focus:** `ring-2 ring-ring/40 ring-offset-2`.
- **Validation / Disabled:** `cu-input-error` / `cu-input-success`; disabled is `pointer-events-none opacity-50 bg-muted text-muted-foreground` with hover border neutralised.

### Navigation
- **Style:** Text-weight links with `hover:bg-muted/60`; active state `bg-primary/8 font-medium text-primary`.
- **Focus:** Lighter `ring-1 ring-ring/30` for navigation and expand/collapse triggers.

### Overlays (Dialog / Drawer / Popover / Dropdown)
- **Corner Style:** Unified `rounded-xl`.
- **Motion:** CSS `@starting-style` + `transition-behavior: allow-discrete`, a single `0.2s ease` for open/close.
- **Focus management:** On open, focus moves to the first interactive element (respecting `[autofocus]`); on close it returns to the trigger. Escape and outside-click close via a shared delegated handler.

### Feedback (Alert / Toast)
- **Style:** Full hairline border + a faint `bg-{color}/5` tint per variant. The `cu-alert-accent` modifier is a stronger filled emphasis (full border + tinted background), not a side stripe.

## 6. Do's and Don'ts

### Do:
- **Do** tint every neutral toward the brand hue (221°/210°); keep surfaces faintly cool, never stark.
- **Do** keep the single Brand Blue accent rare — links, primary actions, focus, selection, and little else.
- **Do** pair `transition-colors` / `transition-shadow` / `transition-opacity` with an explicit `duration-150` (micro) or `duration-200` (state change).
- **Do** use `color-mix(in srgb, var(--color-*) N%, transparent)` for semi-transparent semantic colours so dark mode adapts.
- **Do** keep cards flat at rest; make elevation opt-in or state-driven.
- **Do** ensure every `cu-` class is self-contained and copy-pasteable on its own.

### Don't:
- **Don't** use `#fff` or `#000` as a token value; both are forbidden — tint toward the brand hue.
- **Don't** use a `border-left` / `border-right` greater than 1px as a coloured accent stripe on alerts, cards, or list items. Use a full border, a background tint, or a leading dot instead.
- **Don't** use gradient text (`background-clip: text` over a gradient) or decorative gradients.
- **Don't** reach for glassmorphism by default; the sticky header's `backdrop-blur` is the rare, deliberate exception.
- **Don't** use `transition-all`; always name the specific properties and a duration.
- **Don't** introduce a second font family for hierarchy; use size and weight.
- **Don't** add bounce or elastic easing; motion eases out, short and calm.
