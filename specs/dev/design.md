<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# DESIGN: Visual Design System

## Intent

This spec is the canonical, authoritative definition of the SubLang website's visual design system:
color, typography, spacing, radii, elevation, surfaces, the shared component grammar (buttons, cards, tags, links), page chrome, logo and iconography usage, and motion.
It is the single source of truth for these decisions; no external brand document governs them.

It records the as-built site — `src/styles/global.css` and the shared `Header`, `Footer`, and `BaseHead` components — as one auditable system.
The warm light surface and component grammar are kept, and selected brand ideas are adopted where they improve the result: the deep-purple ink, the three-tone purple (with the bright `#A416EF` pop and a focus ring), a tokenized machine voice, warm-tinted elevation, and a disciplined motion vocabulary.
Adoption is deliberate and partial — the system does not require wholesale brand conformance, since a full brand pass was tried on this site and judged worse.

Brand assets named here — the wordmark and monogram (`src/assets/brand/`) and the Euclid Circular A fonts (`public/fonts/`) — live in the repository; brand voice and editorial-content rules are out of scope for this spec.

Tokens named with a `--` prefix are this package's shared subjects;
they are defined in the Color and Typography sections and referenced by later items.

## Color

### DESIGN-1

The color system shall define the brand purple triad as three fixed values:

| Token | Value | Name |
| --- | --- | --- |
| `--accent-dark` | `#27063D` | Deep |
| `--accent` | `#890FBC` | Mid |
| `--accent-bright` | `#A416EF` | Bright |

The triad is the brand's central idea — the two-tone wordmark splits deep "SUB" from bright "LANG"; every accent choice points back to that split.

### DESIGN-2

The design system shall assign the triad these roles:

| Role | Token |
| --- | --- |
| Primary brand color — primary CTAs, links, active marks | `--accent` |
| Decoration and energy — focus rings, highlights, hero glow | `--accent-bright` |
| Ink and the dark surface | `--accent-dark` |

### DESIGN-3

Where a foreground element is at body-text size on a light surface, the design system shall use `--accent` or an ink tone and shall not use `--accent-bright` (`#A416EF`), which does not meet WCAG AA contrast for small text on white [[2]].

### DESIGN-4

The neutral surface palette shall be warm: `--bg` `#F7F4EF` (paper), `--surface` `#FFFFFF`, `--line` `#E3DED5` (hairline), with `--accent-soft` `rgba(137, 15, 188, 0.12)` for tinted fills.

### DESIGN-5

Text shall use the deep brand purple as its darkest tone, never pure black: `--ink` `#27063D` (headings, emphasis, primary text), `--ink-soft` `#4A4F5A` (body prose), `--ink-muted` `#6C717B` (captions, metadata).

## Typography

### DESIGN-6

The display and body typeface shall be Euclid Circular A, self-hosted, in weights 400/500/600/700 with matching italics (300 available), exposed as `--font-display` and `--font-body`.
The machine voice — code, identifiers, eyebrows, status chips — shall be exposed as a `--font-mono` token whose value is a system-monospace stack (`ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`).
JetBrains Mono is the preferred machine-voice face; where it is adopted it shall be self-hosted alongside Euclid (no third-party font CDN) and prepended to `--font-mono`, leaving the system stack as the fallback.

### DESIGN-7

Type weight shall be 700 for display and large headings, 600 for section headings, 500 for buttons and labels, and 400 for body.

### DESIGN-8

The type scale shall be fluid: h1 `clamp(2.6rem, 5vw, 4.5rem)`, h2 `clamp(1.9rem, 3.5vw, 3rem)`, h3 `clamp(1.4rem, 2.4vw, 2.1rem)`, h4 `1.2rem`; body `18px`, reduced to `16px` where the viewport width is at most `720px`.
Line-height shall be `1.1` for headings and `1.7` for body.

### DESIGN-9

Headings shall carry tight tracking (`letter-spacing: -0.02em`, tightest on the largest display sizes).
Eyebrows, tags, and nav labels shall be uppercase with positive tracking: eyebrow `0.3em`, tag `0.12em`, nav `0.2em`.

### DESIGN-10

Headings and section titles shall be sentence case; ALL-CAPS shall be reserved for eyebrows, tags, nav labels, and the wordmark.
Emoji shall not appear anywhere in the interface.

## Layout and spacing

### DESIGN-11

The primary content column shall be centered with `max-width: var(--grid-max)` (`1120px`); `main` shall pad `5rem 2rem 6rem`, reducing at the breakpoints in [DESIGN-29](#design-29).

### DESIGN-12

Top-level sections shall be separated by at least `3.5rem` of vertical space and a single `1px` `--line` hairline (`.section`); the first section shall omit its top border.

## Radii

### DESIGN-13

Corner radii shall be `--radius-sm` `8px`, `--radius-md` `14px`, and `--radius-lg` `22px`; cards shall use `--radius-lg`, and buttons and tags shall be full pills (`999px`).

## Elevation and borders

### DESIGN-14

Shadows shall be soft and warm-tinted with the deep brand purple: `--shadow-soft` = `0 24px 60px rgba(39, 6, 61, 0.12)`, and cards shall use `0 18px 40px rgba(39, 6, 61, 0.08)`.

### DESIGN-15

Hairlines (`1px` `--line`) shall be the default separator, and a heavy shadow and a heavy border shall not be combined on the same element.

## Surfaces and background

### DESIGN-16

The page background shall be the warm paper `--bg` overlaid with two soft brand-tinted radial glows (top-left `rgba(137, 15, 188, 0.08)`, top-right `rgba(39, 6, 61, 0.06)`) and a white-to-cream vertical wash.
Across global chrome and shared components — the header, the footer, `.card`, `.button`, and `.tag` — this ambient glow shall be the only gradient, and gradient washes shall not be used as their fills.
Product and marketing surfaces — hero treatments, gradient text emphasis, and product diagrams — shall be allowed brand-tinted gradients as deliberate accents.

### DESIGN-17

Where a hero mark sits on a deep (`--accent-dark`) surface, a single `--accent-bright` glow shall be permitted behind it; no other element shall carry a decorative glow.

## Components

### DESIGN-18

Buttons shall render as a full pill with a `1px` border, an uppercase label in the display family tracked `0.08em`, and no bottom-border underline.
The default button shall be transparent with `--ink` text and border;
the primary button shall fill with `--ink`, use `--surface` text, and carry `--shadow-soft`.

### DESIGN-19

When a default button is hovered, it shall shift its text and border to `--accent` and translate upward `2px`;
when a primary button is hovered, it shall fill with `--accent-dark`.
Button state changes shall alter real colors and shall not use opacity.

### DESIGN-20

When an interactive control receives `:focus-visible`, it shall show a bright focus ring `box-shadow: 0 0 0 3px rgba(164, 22, 239, 0.38)` and shall not rely on the browser default outline alone.

### DESIGN-21

Cards (`.card`) shall fill with `--surface`, carry a `1px` `--line` border and `--radius-lg`, pad `1.8rem`, and use the soft warm card shadow from [DESIGN-14](#design-14).
When hovered, a card shall either lift slightly (`translateY`) or darken its border, not both (see [DESIGN-15](#design-15)).

### DESIGN-22

Tags (`.tag`) shall be pills filled `--accent-soft` with `--accent-dark` text, uppercase and tracked `0.12em`.
Eyebrows (`.eyebrow`) shall be uppercase `--ink-muted` tracked `0.3em` in the machine-voice family.

### DESIGN-23

Inline links shall carry a `1px` bottom-border underline at rest and shift their text and underline to `--accent` on hover without an opacity change.
A link that wraps a card or block shall opt out of the underline.

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

Transitions shall use durations of `120ms`, `200ms`, or `320ms` with an ease-out curve.
The motion vocabulary shall be limited to color and border changes, fades, and translations of at most `4px`;
bounce, spring, scale-from-zero, and rotation shall not be used.

### DESIGN-30

Where the user agent reports `prefers-reduced-motion: reduce`, looping and decorative animations shall be disabled or collapsed to an instantaneous end state, and only essential, user-triggered motion shall remain.

## Responsive

### DESIGN-29

Where the viewport width is at most `900px`, `main` padding shall reduce to `3.5rem 1.5rem 5rem` and the hero top padding shall reduce.
Where the viewport width is at most `720px`, the base font size shall be `16px`, buttons shall span the full container width, hero actions shall stack vertically, and the header social links shall be hidden.

## References

[1]: https://lucide.dev "Lucide — open-source icon library"
[2]: https://www.w3.org/TR/WCAG21/#contrast-minimum "WCAG 2.1 — Contrast (Minimum)"
