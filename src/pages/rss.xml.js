// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { DEFAULT_LOCALE, stripLocaleFromId } from '../i18n/config';

async function collect(collection, base) {
	return (await getCollection(collection))
		.map((post) => {
			const parsed = stripLocaleFromId(post.id);
			if (!parsed || parsed.locale !== DEFAULT_LOCALE) return null;
			return { post, link: `${base}/${parsed.slug}/` };
		})
		.filter((value) => value !== null);
}

export async function GET(context) {
	const items = [...(await collect('ref', '/ref')), ...(await collect('blog', '/blog'))].sort(
		(a, b) => b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
	);

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
