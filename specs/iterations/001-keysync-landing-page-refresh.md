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

## Tasks

1. **Clarify KeySync positioning**
   - Update hero tag and subcopy to explain provider config as API keys, endpoints, and models.
   - Keep the hero H1 focused on avoiding repeated API-key setup.
   - Change the primary CTA to `Download KeySync` and point it to the download page.
   - Remove `free for a month` language because the client is not a time-limited trial.

2. **Replace abstract proof with product evidence**
   - Add `src/assets/provider-drift.png` for the provider drift proof.
   - Add `src/assets/keysync-screenshot.png` for the security/product proof.
   - Render both via Astro `Image` so generated image optimization still applies.
   - Use rounded screenshot containers without placeholder copy.

3. **Restructure repeated feature content**
   - Keep the three-step How it works sequence.
   - Move the four guarantees under How it works as a lighter supporting block.
   - Avoid turning each step into a one-to-one proof card.

4. **Polish `/keysync/` visual density**
   - Reduce hero and section-title weight from heavy display to lighter semibold hierarchy.
   - Narrow eyebrow tracking so labels feel sharper without looking fragmented.
   - Lighten `/keysync/` page background, internal lines, and local header override.
   - Reduce soft-shadow and card density.
   - Replace the solid purple KeySync sync hub with a lighter tinted node.
   - Remove the `backup saved` badge from the hero hub.

5. **Repair shared responsive polish touched by the iteration**
   - Keep desktop footer content centered without spreading brand copy and links too far apart.
   - Make mobile footer end with enough bottom spacing for browser chrome.
   - Keep consent actions horizontal on desktop and stacked on mobile.
   - Compact consent buttons without losing full-width mobile targets.

6. **Add anchor navigation polish**
   - Add global smooth scrolling for in-page anchors.
   - Add top scroll padding for the sticky header.
   - Disable smooth scrolling when `prefers-reduced-motion: reduce` is active.

7. **Verify the static build**
   - Run `npm run build`.
   - Confirm Astro builds `/keysync/` and optimized images without errors.

## Acceptance criteria

- The `/keysync/` hero primary CTA opens the configured KeySync download URL.
- The `/keysync/` page contains no `free for a month` CTA copy.
- The provider drift section uses the real provider drift screenshot instead of a code placeholder.
- The security section uses the real KeySync screenshot and direct key-control copy.
- The How it works section contains three workflow steps plus the four supporting guarantees.
- The hero sync hub uses a light tinted node, not a solid purple app-icon block, and it has no `backup saved` badge.
- The `/keysync/` header/nav background and divider appear lighter and cleaner than the shared warm-paper default while preserving the shared header structure.
- In-page anchor links scroll smoothly by default and revert to instant scrolling under reduced-motion preference.
- Desktop footer layout remains two-column and centered, while mobile footer content remains fully reachable with bottom breathing room.
- Consent buttons remain compact on desktop and full-width stacked on mobile.
- `npm run build` exits successfully.
