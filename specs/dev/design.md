<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# DESIGN: Visual Design System

## Intent

This spec is the canonical, complete, and faithful definition of the SubLang website's visual design system:
color, typography, spacing, radii, elevation, surfaces, base elements, the shared component grammar (buttons, cards, tags, links), layout primitives, page chrome, logo and iconography usage, and motion.
It is the single source of truth for these decisions; no external brand document governs them.

It describes the site as built — `src/styles/global.css` and the shared `Header`, `Footer`, and `BaseHead` components — at the values it actually ships, so that following this spec reproduces the site's look.
The system favors a warm, restrained light surface: cream paper, dark ink, brand purple used sparingly, hairline borders, soft shadows, and spare motion.
A full brand-conformance pass was attempted and judged worse for this site, so the system stays close to this as-built design rather than a stricter brand ideal.

Brand assets named here — the wordmark and monogram (`src/assets/brand/`) and the Euclid Circular A fonts (`public/fonts/`) — live in the repository; brand voice and editorial-content rules are out of scope for this spec.

Tokens named with a `--` prefix are this package's shared subjects;
they are defined in the Color and Typography sections and referenced by later items.

## Color

### DESIGN-1

The color system shall define two brand purples:

| Token | Value | Name |
| --- | --- | --- |
| `--accent` | `#890FBC` | brand purple |
| `--accent-dark` | `#27063D` | deep purple |

`--accent-dark` is the dark half of the two-tone wordmark; `--accent` is the single purple that stands for the brand in UI.

### DESIGN-2

The design system shall assign the purples these roles:

| Role | Token |
| --- | --- |
| The brand color — primary CTAs, links, active marks, hover accents, tag text, eyebrows, blockquote rule | `--accent` |
| Deepest brand purple — primary-button hover/active fill | `--accent-dark` |

### DESIGN-3

Where a foreground element is at body-text size on a light surface, it shall use an ink tone or `--accent`.
`--accent` (`#890FBC`) is the lightest purple permitted at body size — it clears WCAG AA contrast on white [[2]] — and lighter or more-saturated purples shall not be used for small text.

### DESIGN-4

The neutral surface palette shall be warm: `--bg` `#F7F4EF` (paper), `--surface` `#FFFFFF`, `--line` `#E3DED5` (hairline), with `--accent-soft` `rgba(137, 15, 188, 0.12)` for tinted fills.

### DESIGN-5

Text shall use the ink scale: `--ink` `#15161A` (headings, emphasis, primary text), `--ink-soft` `#4A4F5A` (body prose), `--ink-muted` `#6C717B` (captions, metadata).

## Typography

### DESIGN-6

The display and body typeface shall be Euclid Circular A, self-hosted, in weights 400/500/600/700 with matching italics, exposed as `--font-display` and `--font-body`.
Code and identifiers shall use a `--font-mono` system-monospace stack: `"SFMono-Regular", "Consolas", "Liberation Mono", monospace`.

### DESIGN-7

Type weight shall be 700 for display and large headings, 600 for section headings, 500 for buttons and labels, and 400 for body.

### DESIGN-8

The type scale shall be fluid: h1 `clamp(2.6rem, 5vw, 4.5rem)`, h2 `clamp(1.9rem, 3.5vw, 3rem)`, h3 `clamp(1.4rem, 2.4vw, 2.1rem)`, h4 `1.2rem`; body `18px`, reduced to `16px` where the viewport width is at most `720px`.
Line-height shall be `1.1` for headings and `1.7` for body.

### DESIGN-9

Headings shall carry tight tracking (`letter-spacing: -0.02em`), and `h4` shall additionally be uppercase tracked `0.14em`.
Eyebrows, tags, and nav labels shall be uppercase with positive tracking: eyebrow `0.3em`, tag `0.12em`, nav `0.2em`.

### DESIGN-10

Headings and section titles shall be sentence case; ALL-CAPS shall be reserved for eyebrows, tags, nav labels, and the wordmark.
Emoji shall not appear anywhere in the interface.

## Layout and spacing

### DESIGN-11

The primary content column shall be centered with `max-width: var(--grid-max)` (`1120px`); `main` shall pad `5rem 2rem 6rem`, reducing at the breakpoints in [DESIGN-29](#design-29).

### DESIGN-12

Top-level sections shall be separated by at least `3.5rem` of vertical space and a single `1px` `--line` hairline (`.section`); the first section shall omit its top border.

### DESIGN-33

The layout primitives shall be: `.hero` a single-column grid (`minmax(0, 1fr)`) with `2rem` gaps and `5rem 0 4rem` padding, whose `.hero-actions` is a wrapping flex row with `1rem` gaps; `.grid` an auto-fit grid of `minmax(240px, 1fr)` tracks with `2rem` gaps; `.split` an auto-fit grid of `minmax(280px, 1fr)` tracks, vertically centered; and `.list` an unstyled grid with `1.5rem` gaps.

## Radii

### DESIGN-13

Corner radii shall be `--radius-sm` `8px`, `--radius-md` `14px`, and `--radius-lg` `22px`; cards shall use `--radius-lg`, and buttons and tags shall be full pills (`999px`).

## Elevation and borders

### DESIGN-14

Shadows shall be soft and tinted with near-black `rgba(21, 22, 26, …)`: `--shadow-soft` = `0 24px 60px rgba(21, 22, 26, 0.12)`, and cards shall use `0 18px 40px rgba(21, 22, 26, 0.08)`.

### DESIGN-15

Hairlines (`1px` `--line`) shall be the default separator; a card may pair a hairline border with a soft shadow, but a heavy shadow and a heavy border shall not be combined on one element.

## Surfaces and background

### DESIGN-16

The page background shall be the warm paper `--bg` overlaid with two soft brand-tinted radial glows (top-left `rgba(137, 15, 188, 0.08)`, top-right `rgba(39, 6, 61, 0.06)`) and a white-to-cream vertical wash.
This ambient page-background glow shall be the only gradient in the system; every other surface, fill, section band, and text treatment — across chrome, shared components, and product and marketing pages — shall use solid colors.

### DESIGN-17

The site shall be a single light theme: page and panel background surfaces shall be `--bg` paper or `--surface` white, and the system shall define no dark or inverse page surface (no dark mode, no dark section bands).
Component fills and product accents are not page surfaces and are exempt — for example the primary button's `--ink` fill ([DESIGN-18](#design-18)) and product-diagram solid accent nodes ([DESIGN-16](#design-16)).

## Components

### DESIGN-18

Buttons shall render as a full pill with `0.85rem 1.6rem` padding, a `1px` border, an uppercase label in the display family tracked `0.08em`, and no bottom-border underline.
The default button shall be transparent with `--ink` text and border;
the primary button shall fill with `--ink`, use `--surface` text, and carry `--shadow-soft`.

### DESIGN-19

When a default button is hovered, it shall shift its text and border to `--accent` and translate upward `2px`;
when a primary button is hovered, it shall fill with `--accent-dark`.
Button state changes shall alter real colors and shall not use opacity.

### DESIGN-20

On `:focus-visible`, interactive controls — links, `button`, `.button`, `summary`, and form fields (`input`, `textarea`, `select`) — shall show one consistent focus ring: a `2px` solid `--accent` outline at `2px` offset.
The ring shall use `outline` (not `box-shadow` alone) so it survives forced-colors mode, and the default focus outline shall not be removed unless replaced by this ring.

### DESIGN-21

Cards (`.card`) shall fill with `--surface`, carry a `1px` `--line` border and `--radius-lg`, pad `1.8rem`, and use the soft card shadow from [DESIGN-14](#design-14).
An interactive card shall, on hover, lift by a few pixels (`translateY`) and shift its border toward `--accent`.

### DESIGN-22

Tags (`.tag`) shall be pills filled `--accent-soft` with `--accent-dark` text, uppercase and tracked `0.12em`, in the display family.
Eyebrows (`.eyebrow`) shall be uppercase `--accent` text at `0.72rem` tracked `0.3em`.

### DESIGN-23

Inline links shall carry a `1px` bottom-border underline at rest (a faint ink rule) and shift their text and underline to `--accent` on hover without an opacity change.
A link that wraps a card or block shall opt out of the underline.

## Content elements

### DESIGN-31

Inline code (`code`) shall use `--font-mono` at `0.9em` on a `rgba(21, 22, 26, 0.08)` fill with `6px` radius and `2px 6px` padding.
Preformatted blocks (`pre`) shall pad `1.5em`, use `--radius-md` and a `rgba(21, 22, 26, 0.06)` fill, and reset any nested `code` to inherit.

### DESIGN-32

Long-form content elements shall render as: `blockquote` — a `3px` `--accent` left rule, `20px` left padding, `--ink-soft` text at `1.1rem`; `table` — full width with a `1px` `--line` border on `--surface` and a `rgba(21, 22, 26, 0.04)` header row; `hr` — a single `1px` `--line` rule; and `img` — `--radius-sm` corners.

## Chrome

### DESIGN-24

The top bar shall be sticky and at most `72px` tall, with a translucent warm-paper background (`rgba(247, 244, 239, 0.8)`), a `backdrop-filter` blur, and a `1px` `--line` bottom hairline; it shall place the wordmark at the left and sparse nav at the right.

### DESIGN-25

The footer shall be separated by a `1px` `--line` top hairline over a translucent light background (`rgba(255, 255, 255, 0.65)`); its link lists shall be uppercase and tracked in the display family.

## Logo and iconography

### DESIGN-26

The two-tone wordmark shall be the default mark wherever it fits horizontally; the monogram shall be used only for constrained chrome (favicon, avatar, app icon).
The wordmark shall not be recolored, re-typeset in another face, skewed, or given a drop shadow.

### DESIGN-27

UI and action icons shall be outline-style (about `1.5px` stroke, rounded caps, no fill) delivered as inline SVG, with Lucide [[1]] as the working icon set.
Official brand and social marks — for example the GitHub and X logos in the header — are exempt: they shall use their canonical glyphs (typically filled) and shall not be redrawn as outlines.
Emoji and unicode glyphs shall not be used as iconography.

## Motion

### DESIGN-28

Transitions shall run at about `200ms` (`0.2s`) with an `ease` timing function.
The motion vocabulary shall be limited to color and border changes, fades, and translations of at most `4px`;
bounce, spring, scale-from-zero, and rotation shall not be used.

### DESIGN-30

Where the user agent reports `prefers-reduced-motion: reduce`, looping and decorative animations shall be disabled or collapsed to an instantaneous end state, and only essential, user-triggered motion shall remain.

## Responsive

### DESIGN-29

Where the viewport width is at most `900px`, `main` padding shall reduce to `3.5rem 1.5rem 5rem` and the hero top padding shall reduce.
Where the viewport width is at most `720px`, the base font size shall be `16px`, buttons shall span the full container width, hero actions shall stack vertically, and the header social links shall be hidden.

## Utilities

### DESIGN-34

Utility classes shall be: `.muted` — text in `--ink-muted`; and `.sr-only` — content removed from the visual layout while remaining available to assistive technology.

## References

[1]: https://lucide.dev "Lucide — open-source icon library"
[2]: https://www.w3.org/TR/WCAG21/#contrast-minimum "WCAG 2.1 — Contrast (Minimum)"
