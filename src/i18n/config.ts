// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

export const DEFAULT_LOCALE = 'en' as const;
export const LOCALES = ['en', 'zh'] as const;

export type Locale = (typeof LOCALES)[number];

export const NON_DEFAULT_LOCALES = LOCALES.filter(
	(locale): locale is Exclude<Locale, typeof DEFAULT_LOCALE> => locale !== DEFAULT_LOCALE,
);

export const LOCALE_LABELS: Record<Locale, string> = {
	en: 'EN',
	zh: '中文',
};

export const HTML_LANG: Record<Locale, string> = {
	en: 'en',
	zh: 'zh-Hans',
};

export const OG_LOCALE: Record<Locale, string> = {
	en: 'en_US',
	zh: 'zh_CN',
};

export function stripLocaleFromId(id: string): { locale: Locale; slug: string } | null {
	const [head, ...rest] = id.split('/');
	if (!head || rest.length === 0) return null;
	if (!(LOCALES as readonly string[]).includes(head)) return null;
	return { locale: head as Locale, slug: rest.join('/') };
}

export function localeHref(locale: Locale, path: string): string {
	const normalized = path.startsWith('/') ? path : `/${path}`;
	if (locale === DEFAULT_LOCALE) return normalized;
	return `/${locale}${normalized}`;
}
