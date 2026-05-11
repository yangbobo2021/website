// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { DEFAULT_LOCALE, type Locale } from './config';

/**
 * Static availability registry: which locales each navigable route is
 * actually translated into. Header and any other component that builds
 * cross-route links consult this so unavailable routes can render as
 * inert (no fake equivalents).
 *
 * Keys are default-locale paths (the canonical route shape). Adding a
 * translation = appending the locale here AND authoring the page.
 */
export const ROUTE_AVAILABILITY: Record<string, readonly Locale[]> = {
	'/': ['en', 'zh'],
	'/engineering/': ['en'],
};

export function isRouteAvailable(path: string, locale: Locale): boolean {
	const locales = ROUTE_AVAILABILITY[path];
	if (!locales) return locale === DEFAULT_LOCALE;
	return locales.includes(locale);
}
