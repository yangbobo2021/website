// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';
import { NON_DEFAULT_LOCALES, stripLocaleFromId } from '../../i18n/config';

export async function getStaticPaths() {
	return NON_DEFAULT_LOCALES.map((locale) => ({ params: { locale } }));
}

export async function GET(context) {
	const locale = context.params.locale;
	const posts = (await getCollection('ref'))
		.map((post) => {
			const parsed = stripLocaleFromId(post.id);
			if (!parsed || parsed.locale !== locale) return null;
			return { post, slug: parsed.slug };
		})
		.filter((value) => value !== null);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map(({ post, slug }) => ({
			...post.data,
			link: `/${locale}/ref/${slug}/`,
		})),
	});
}
