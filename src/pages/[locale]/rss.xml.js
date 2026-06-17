// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';
import { NON_DEFAULT_LOCALES, stripLocaleFromId } from '../../i18n/config';

export async function getStaticPaths() {
	return NON_DEFAULT_LOCALES.map((locale) => ({ params: { locale } }));
}

async function collect(collection, locale, base) {
	return (await getCollection(collection))
		.map((post) => {
			const parsed = stripLocaleFromId(post.id);
			if (!parsed || parsed.locale !== locale) return null;
			return { post, link: `/${locale}${base}/${parsed.slug}/` };
		})
		.filter((value) => value !== null);
}

export async function GET(context) {
	const locale = context.params.locale;
	const items = [
		...(await collect('ref', locale, '/ref')),
		...(await collect('blog', locale, '/blog')),
	].sort((a, b) => b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: items.map(({ post, link }) => ({
			...post.data,
			link,
		})),
	});
}
