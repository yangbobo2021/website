// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

export const messages = {
	nav: {
		home: 'Home',
		engineering: 'Engineering',
		languageLabel: 'Language',
		unavailableTitle: 'Not available in this language',
	},
	home: {
		tag: 'Open Language Lab',
		headline: 'Language tools for software that reads as well as it runs.',
		description:
			'SubLang explores linguistic models for data management and programming, and the craft of human-readable systems. We publish reference essays and engineering notes for teams building expressive software.',
		ctaPrimary: 'Read engineering',
		ctaPrimaryHref: '/engineering/',
		ctaGitHub: 'Explore on GitHub',
		ctaX: 'Follow on X',
		focusTitle: 'Current focus',
		focus: [
			{
				label: 'Readable syntax',
				body: 'Designing specification layers that communicate intent consistently.',
			},
			{
				label: 'Unified model',
				body: 'Unifying application logic, data, and knowledge into one computational model.',
			},
			{
				label: 'Data ownership',
				body: 'Returning data control to users and enabling no-silo access for agents.',
			},
		],
	},
	footer: {
		orgName: 'SubLang International',
		tagline: 'Language tools, reference essays, and engineering notes.',
		linkGitHub: 'GitHub',
		linkX: 'X / Twitter',
		linkEngineering: 'Engineering',
		copyright: (year: number) => `© ${year} SubLang International.`,
	},
	consent: {
		text: 'Help us improve your experience. Allow anonymous analytics.',
		accept: 'Yes',
		reject: 'No',
	},
} as const;

export type Messages = typeof messages;
