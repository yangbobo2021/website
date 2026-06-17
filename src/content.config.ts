// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { defineCollection, z, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared article schema for the `ref` (engineering reference essays) and `blog`
// collections. Both render through the same BlogPost layout, so they keep an
// identical front-matter contract.
const articleSchema = ({ image }: SchemaContext) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		heroImageAlt: z.string().optional(),
		categories: z.array(z.string()).optional(),
		xUrl: z.string().url().optional(),
		twitterUrl: z.string().url().optional(),
		devtoUrl: z.string().url().optional(),
		mediumUrl: z.string().url().optional(),
		author: z
			.object({
				name: z.string(),
				email: z.string().email().optional(),
			})
			.optional(),
	});

const ref = defineCollection({
	// Load Markdown and MDX files in the `src/content/ref/` directory.
	loader: glob({ base: './src/content/ref', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: articleSchema,
});

export const collections = { ref, blog };
