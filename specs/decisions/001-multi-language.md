<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai> -->

# DR-001: Website Multi-Language Support

## Status

Proposed

## Context

The website (Astro) currently ships in English only.
Three kinds of surfaces need translation:

- **Content collections** (e.g., `ref/`) — Markdown/MDX posts.
- **Static pages** (e.g., `index.astro`, `engineering/index.astro`) — Astro pages with mixed prose and layout.
- **UI chrome** — header, footer, nav labels, layout strings shared across pages.

Goals:

- One coherent locale model across all three surfaces.
- Use Astro's built-in i18n primitives; no runtime translation libraries or server-side detection.
- Preserve existing English URLs to keep inbound links stable.
- Make translation linkage discoverable to readers and search engines.
- Adding a new locale should be config + authoring, with no per-locale routing rewrites.

Non-goals:

- Automatic machine translation.
- Per-paragraph translation memory or fuzzy fallback.
- Locale auto-detection or redirects based on `Accept-Language` (an explicit user-facing switcher is sufficient).

## Decision

### Locales

- Default locale: `en`.
- Initial additional locale: `zh` (Simplified Chinese).
- Locale tags follow BCP 47 lowercase short form (`en`, `zh`, `ja`, ...).
Regional variants (`zh-hans`, `pt-br`) are allowed when needed but not used by default.
- The locale set lives in a single module (`src/i18n/config.ts`) consumed by routing, links, and metadata.

### Routing

- Use Astro's built-in `i18n` config with `defaultLocale: 'en'`, `locales: ['en', 'zh']`, and `routing.prefixDefaultLocale: false`.
- Resulting URL shape:

  | Surface | Default (`en`) | Other (`zh`) |
  | --- | --- | --- |
  | Home | `/` | `/zh/` |
  | Static page | `/engineering/` | `/zh/engineering/` |
  | Collection post | `/ref/foo` | `/zh/ref/foo` |
  | Collection index | `/ref/` | `/zh/ref/` |
  | RSS | `/rss.xml` | `/zh/rss.xml` |

- All internal links shall be built with `getRelativeLocaleUrl(lang, path)` so the prefix is added or omitted per the routing rule.
- The current locale is read from `Astro.currentLocale` and falls back to `defaultLocale`.

### Content collections

- Translations of a post share a stable basename under per-locale subdirectories:
  `src/content/<collection>/<locale>/<slug>.{md,mdx}`.
- Two entries are translations of each other iff they share `<collection>` and `<slug>` and differ only in `<locale>`.
- The path is the translation key; no `translationKey` frontmatter field is introduced.
- Collection schemas are unchanged; locale is derived from the path segment.
- A post is allowed to exist in only a subset of locales; absence of a translation is normal.
- `pubDate` and `updatedDate` refer to the translated version's own publication and last update.
- Per-locale external cross-post links (`devtoUrl`, `mediumUrl`, ...) are set only when a corresponding-language external post exists; otherwise omitted for that translation.

### Static pages

- Localizable Astro pages live under `src/pages/[locale]/...`, with `getStaticPaths` enumerating every entry of `locales`.
- `prefixDefaultLocale: false` causes the default locale's URLs to be served without the `/en` prefix; existing English URLs are therefore preserved.
- Page-specific text not sourced from content collections is read from the i18n message modules (see below), keyed by page.
- Pages that are intentionally locale-agnostic (e.g., pure redirect endpoints, `rss.xml.js` of the default locale) may remain at `src/pages/` without a locale segment.

### UI chrome and shared strings

- Each locale has one message module: `src/i18n/messages/<locale>.ts`, exporting a typed object of namespaced keys (e.g., `nav.home`, `footer.rights`).
- A helper `useTranslations(lang)` returns a `t(key)` bound to the active locale, with the default locale serving as the fallback for any missing key.
- Components that render chrome (Header, Footer, BaseHead, ConsentBanner, BlogPost layout) accept `lang` as a prop or read it from `Astro.currentLocale`, then look up strings via `t`.
- The shape of the message object is identical across locales; missing keys in a non-default locale are a lint-level warning, not a build failure, with the default-locale value used at runtime.

### Language switcher

- A site-wide language switcher in the header lists every locale in `locales`.
- For each locale, the switcher links to the equivalent URL for the current page:
  - On a content-collection page, link to the same `<slug>` under the target locale, if that translation exists; otherwise link to the target locale's collection index.
  - On a static page or home, link to the same route under the target locale.
- The currently active locale is marked but remains a link (for accessibility and self-referential `hreflang`).

### Metadata and discovery

- Every page emits `<link rel="alternate" hreflang="<locale>" href="...">` for each locale in which an equivalent page exists, plus `hreflang="x-default"` pointing at the default-locale URL.
- `<html lang="...">` is set from `Astro.currentLocale`.
- One RSS feed per locale (`/rss.xml` for default, `/<locale>/rss.xml` for others); each feed contains only posts in that locale.
- The sitemap integration is configured with the same locale set so it emits alternate links between equivalent URLs.

### Authoring rules

- Adding a translation of an existing post = creating the same `<slug>` under a different locale subdirectory.
- Adding a translation of a static page = adding the corresponding locale entry; no new file is needed because pages live under `[locale]/`.
- Adding a translation of UI chrome = adding keys to the locale's message module.
- Adding a new locale = appending to `locales` in `src/i18n/config.ts`, adding `src/i18n/messages/<locale>.ts`, and creating per-locale content as desired.
No routing code changes are required.

### Migration

- `src/content/<collection>/*.{md,mdx}` move into `src/content/<collection>/en/` preserving their slugs.
- `src/pages/index.astro` and other localizable pages move into `src/pages/[locale]/...` with `getStaticPaths` returning every locale.
- Existing hard-coded strings in components are extracted into `src/i18n/messages/en.ts`.
- No URL of an existing English page or post changes.

## Consequences

- One locale model spans content, static pages, and UI chrome; readers see consistent language across the site.
- Path-as-key for content keeps translations diff-friendly and avoids drift between a frontmatter key and the file path.
Renaming a slug must be done across all locales together; this is the intended invariant.
- The default-locale URL space is unchanged, so existing inbound links and shares keep working.
- Translations are partial by design: a post or page may exist in only some locales without breaking the site.
- Adding a new locale is a config + authoring task with no routing rewrites.
- The cost is a one-time migration that touches most pages and components: moving pages under `[locale]/`, extracting strings into message modules, and threading `lang` through chrome components.

## References

[1]: https://docs.astro.build/en/guides/internationalization/ "Astro: Internationalization (i18n) Routing"
[2]: https://docs.astro.build/en/recipes/i18n/ "Astro Recipes: Internationalization"
[3]: https://developers.google.com/search/docs/specialty/international/localized-versions "Google Search: Localized versions of your pages"
