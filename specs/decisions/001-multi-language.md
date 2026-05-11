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

- Use Astro's built-in `i18n` config [[1]] with `defaultLocale: 'en'`, `locales: ['en', 'zh']`, and `routing.prefixDefaultLocale: false`.
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
- Default-locale URLs carry no locale segment: their routes live at the root of `src/pages/`.
- Non-default-locale URLs carry a literal locale segment, served from a single shared `src/pages/[locale]/...` arm per surface; `getStaticPaths` for that arm enumerates `locales` minus `defaultLocale`.
The default locale shall never appear as a value of the `[locale]` parameter, because `prefixDefaultLocale: false` does not strip a literal `[locale]` segment from generated URLs (it would produce `/en/...`).

### Content collections

- Translations of a post share a stable basename under per-locale subdirectories:
  `src/content/<collection>/<locale>/<slug>.{md,mdx}`.
- Two entries are translations of each other iff they share `<collection>` and `<slug>` and differ only in `<locale>`.
- The path is the translation key; no `translationKey` frontmatter field is introduced.
- Collection schemas are unchanged; locale is derived from the leading path segment of the entry's id.
- The URL slug of a post is the entry id with the leading `<locale>/` segment removed.
Astro content collection ids include the path under the collection root [[2]], so the route handlers shall strip that segment when forming params and shall filter `getCollection` by the leading segment that matches the current locale.
Concretely, for `src/content/ref/en/foo.md` (`id = "en/foo"`), the default-locale route emits `params.slug = "foo"` and the URL is `/ref/foo`.
- A post is allowed to exist in only a subset of locales; absence of a translation is normal.
- `pubDate` and `updatedDate` refer to the translated version's own publication and last update.
- Per-locale external cross-post links (`devtoUrl`, `mediumUrl`, ...) are set only when a corresponding-language external post exists; otherwise omitted for that translation.

### Static pages

- Default-locale pages remain at `src/pages/...` (no locale segment), as required by Astro's `prefixDefaultLocale: false` mode [[1]].
- A single `[locale]` arm covers every non-default locale: for each default-locale page at `src/pages/<path>.astro`, a sibling at `src/pages/[locale]/<path>.astro` handles all non-default locales, with `getStaticPaths` returning one entry per non-default locale.
For example, `src/pages/[locale]/engineering/index.astro` produces `/zh/engineering/`, `/ja/engineering/`, etc., driven by the `locales` config.
- Both the default and `[locale]` versions of a page are thin wrappers that render a shared `<PageBody>` component in `src/components/pages/`, passing `lang` (from `Astro.currentLocale`) and any data; the wrapper exists only to anchor the URL.
- Page-specific text not sourced from content collections is read from the i18n message modules (see below), keyed by page.
- Pages that are intentionally locale-agnostic (e.g., pure redirect endpoints, the default-locale `rss.xml.js`) remain at `src/pages/` without a locale segment.

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

- Every page emits `<link rel="alternate" hreflang="<locale>" href="...">` for each locale in which an equivalent page exists, plus `hreflang="x-default"` pointing at the default-locale URL, per Google's localized-page guidance [[3]].
- `<html lang="...">` is set from `Astro.currentLocale`.
- One RSS feed per locale (`/rss.xml` for default, `/<locale>/rss.xml` for others); each feed contains only posts in that locale.
- The sitemap integration is configured with the same locale set so it emits alternate links between equivalent URLs.

### Authoring rules

- Adding a translation of an existing post = creating the same `<slug>` under a different locale subdirectory of the collection.
- Adding a translation of a static page = adding the page's namespaced keys to the target locale's message module; no new page file is needed because the shared `[locale]` route arm picks up every non-default locale from `locales`.
- Adding a translation of UI chrome = adding keys to the locale's message module.
- Adding a new locale = appending to `locales` in `src/i18n/config.ts`, adding `src/i18n/messages/<locale>.ts`, and authoring per-locale content/messages as desired.
No routing code changes are required: the existing `src/pages/[locale]/...` route arms enumerate `locales` minus `defaultLocale` and pick up the new locale automatically.

### Migration

- `src/content/<collection>/*.{md,mdx}` move into `src/content/<collection>/en/`.
The on-disk slug under that locale subdirectory is preserved; the route handlers strip the leading `en/` segment so URLs remain `/<collection>/<slug>`.
- The `src/pages/ref/[...slug].astro` route is updated to filter `getCollection('ref')` by leading id segment `en/` and to emit `params.slug` with that segment removed.
- A new `src/pages/[locale]/ref/[...slug].astro` route is added.
Its `getStaticPaths` enumerates `(locale, slug)` pairs across all non-default locales: for each non-default locale `L`, take every collection entry whose id starts with `L/` and emit `params = { locale: L, slug: <id with leading "L/" stripped> }`.
This single file covers every current and future non-default locale.
- `src/pages/index.astro`, `src/pages/engineering/index.astro`, and other localizable pages stay at their current paths for the default locale.
A sibling `src/pages/[locale]/<path>.astro` is added for each such page, with `getStaticPaths` enumerating non-default locales; both default and `[locale]` wrappers render a shared `<PageBody>` component.
- `src/pages/rss.xml.js` is updated to filter `getCollection('ref')` to entries whose id starts with `en/` and to emit links with that segment stripped (so the feed serves the default-locale URLs and content).
- A new `src/pages/[locale]/rss.xml.js` endpoint is added.
Its `getStaticPaths` enumerates non-default locales; for each locale `L` it serves a feed filtered to entries whose id starts with `L/`, with that segment stripped from emitted links.
This single endpoint file covers every current and future non-default locale, matching the `[locale]` arm pattern used for collection and static-page routes.
- Existing hard-coded strings in components are extracted into `src/i18n/messages/en.ts`.
- No URL of an existing English page or post changes.

## Consequences

- One locale model spans content, static pages, and UI chrome; readers see consistent language across the site.
- Path-as-key for content keeps translations diff-friendly and avoids drift between a frontmatter key and the file path.
Renaming a slug must be done across all locales together; this is the intended invariant.
- The default-locale URL space is unchanged, so existing inbound links and shares keep working.
- Translations are partial by design: a post or page may exist in only some locales without breaking the site.
- Adding a new locale is a true config + authoring task: append to `locales`, add a message module, author content.
The shared `[locale]` route arms enumerate non-default locales from config, so no new route files are needed.
- The one-time migration cost touches the `ref` route handler, the RSS endpoint, and the chrome components: moving content into `en/`, adding the `[locale]` siblings (one per collection route, one per static page, one for RSS), extracting strings into message modules, and threading `lang` through chrome components.
- Per-surface routing cost is fixed at two files (default + `[locale]` sibling) regardless of locale count; this applies uniformly to collection routes, static pages, and RSS endpoints.

## References

[1]: https://docs.astro.build/en/guides/internationalization/ "Astro: Internationalization (i18n) Routing"
[2]: https://docs.astro.build/en/guides/content-collections/ "Astro: Content Collections"
[3]: https://developers.google.com/search/docs/specialty/international/localized-versions "Google Search: Localized versions of your pages"
