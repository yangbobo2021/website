// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>
// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES } from './src/i18n/config.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://sublang.ai',
	i18n: {
		defaultLocale: DEFAULT_LOCALE,
		locales: [...LOCALES],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: DEFAULT_LOCALE,
				locales: Object.fromEntries(LOCALES.map((locale) => [locale, HTML_LANG[locale]])),
			},
		}),
	],
});
