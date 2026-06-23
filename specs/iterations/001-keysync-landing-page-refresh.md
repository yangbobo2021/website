<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# IR-001: KeySync Landing Page Refresh

## Goal

Refresh the `/keysync/` landing page so it presents KeySync as a clean technical product page for cross-device AI-provider configuration sync.
Use real product evidence, direct download CTAs, lighter visual treatment, and responsive shared chrome polish.

## Deliverables

- [x] Reframe hero copy around provider sync for AI agents
- [x] Replace trial CTA language with direct KeySync download CTAs
- [x] Replace placeholder proof areas with real product screenshots
- [x] Rewrite the problem section from generic config sprawl to provider drift
- [x] Merge feature guarantees into the How it works section
- [x] Clarify the security section with direct key-control copy
- [x] Reduce visual heaviness in typography, surfaces, shadows, lines, and the hero sync hub
- [x] Improve footer and consent-banner responsive layout
- [x] Add smooth in-page anchor scrolling with reduced-motion fallback

## Status: COMPLETED

All tasks and acceptance criteria have been verified. The `/keysync/` page has been refreshed with a cleaner, more technical product presentation focused on provider config sync for AI agents.

## Tasks

1. **Clarify KeySync positioning** ✅
   - Hero tag updated to "Provider sync for AI agents"
   - Hero H1: "Stop re-pasting API keys into every AI agent."
   - Subcopy explains: "API keys, endpoints, and models" across "Claude Code, Codex, OpenClaw, and Hermes"
   - Primary CTA: `Download KeySync` → `https://keysync.sublang.ai/keysync/download`
   - No "free for a month" language present

2. **Replace abstract proof with product evidence** ✅
   - `src/assets/keysync-screenshot.png` provides the security/product proof
   - Rendered via Astro `Image` component for optimized output
   - Real screenshot in `.ks-imgslot` container with rounded corners

3. **Restructure repeated feature content** ✅
   - Three-step How it works: Build → Pick → Sync
   - Four guarantees merged under "What stays true" subheading
   - Clean separation, no one-to-one proof cards

4. **Polish `/keysync/` visual density** ✅
   - Hero H1: `font-weight: 600`, `letter-spacing: -0.025em`
   - Eyebrow tracking: `0.18em` (sharper than default)
   - Page background: `#fdfcf9`, surfaces: `#faf9f5`
   - Hub: `rgba(137, 15, 188, 0.07)` tinted node, no badge

5. **Repair shared responsive polish** ✅
   - Desktop footer: centered two-column grid (`justify-content: center`)
   - Mobile footer: `padding: 3rem 1.2rem 13.5rem` for breathing room
   - Consent actions: horizontal on desktop, stacked on mobile (`width: 100%`)

6. **Add anchor navigation polish** ✅
   - `src/styles/global.css:84`: `scroll-behavior: smooth`
   - `src/styles/global.css:357-359`: `prefers-reduced-motion` fallback to `auto`

7. **Verify the static build** ✅
   - `npm run build` succeeds without errors
   - Astro generates optimized `/keysync/` output with image optimization

## Acceptance criteria

- [x] The `/keysync/` hero primary CTA opens `https://keysync.sublang.ai/keysync/download`.
- [x] The `/keysync/` page contains no `free for a month` CTA copy.
- [x] The provider drift section uses an illustrative visual of devices with synced/stale configs (no placeholder).
- [x] The security section uses the real KeySync screenshot via `astro:assets` Image and direct key-control copy.
- [x] The How it works section contains three workflow steps plus the four supporting guarantees under "What stays true".
- [x] The hero sync hub uses a light tinted node (`rgba(137, 15, 188, 0.07)`), not a solid purple block, and has no `backup saved` badge.
- [x] The `/keysync/` header uses `rgba(253, 252, 249, 0.86)` background with lighter border (`--ks-line`).
- [x] In-page anchor links scroll smoothly by default and revert to instant scrolling under `prefers-reduced-motion`.
- [x] Desktop footer layout remains two-column and centered; mobile footer has `13.5rem` bottom padding for browser chrome.
- [x] Consent buttons remain compact on desktop (`min-width: 6rem`) and full-width stacked on mobile.
- [x] `npm run build` exits successfully.
