// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

export const messages = {
	nav: {
		home: 'Home',
		product: 'Product',
		productLabel: 'KeySync',
		productMenuItems: [
			{ label: 'KeySync', href: '/keysync/' },
		],
		engineering: 'Engineering',
		blog: 'Blog',
		languageLabel: 'Language',
		unavailableTitle: 'Not available in this language',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		mobileCtaDownload: 'Download',
		socialGitHub: 'SubLang on GitHub',
		socialX: 'SubLang on X',
		navPrimary: 'Primary navigation',
		productMenuLabel: 'Product menu',
		socialLinks: 'Social links',
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
		productsTitle: 'Our Products',
		products: [
			{
				name: 'KeySync',
				description: 'One config for every AI agent. Keep providers, keys, and models in sync across machines.',
				learnMoreHref: '/keysync/',
				downloadHref: '/keysync/download/',
			},
		],
	},
	engineering: {
		eyebrow: 'Engineering',
		title: 'Tooling and architecture',
		pageTitle: 'Engineering',
		pageDescription:
			'Tooling, architecture, and specification practice for AI-powered software development.',
	},
	blog: {
		eyebrow: 'Blog',
		title: 'Notes and field reports',
		pageTitle: 'Blog',
		pageDescription:
			'Practical notes on specs, agents, and building software in the AI era.',
		empty: 'No posts yet. Check back soon.',
	},
	keysync: {
		pageTitle: 'KeySync — One config for every AI agent',
		pageDescription:
			'KeySync is the key and config layer your AI agents read from. Keep your providers, keys, models, and endpoints in one place and sync them to every AI agent you run — encrypted across machines, with a local backup before every write.',
		hero: {
			tag: 'Provider sync for AI agents',
			headline: 'Stop re-pasting API keys into <span>every</span> AI agent.',
			sub: 'Keep Claude Code, Codex, OpenClaw, and Hermes on the same provider (<b>API keys, endpoints, and models</b>) across laptops and servers.',
			ctaDownload: 'Download KeySync',
			ctaHow: 'See how it works',
			mobileCta: {
				title: 'Get KeySync on your computer',
				desc: 'KeySync runs on your desktop. Copy this link and open it on your computer.',
				copy: 'Copy',
				copied: 'Copied!',
				failed: 'Failed',
			},
			trust: ['Backup before every write', 'End-to-end encrypted', "Writes each tool's native config"],
			visual: {
				sourceLabel: 'Source of truth',
				sourceBadge: '1 place',
				hubName: 'KeySync',
				keys: {
					anthropic: 'anthropic',
					openai: 'openai',
					google: 'google',
					model: 'model',
					endpoint: 'endpoint',
				},
				tools: {
					claudeCode: 'Claude Code',
					openclaw: 'OpenClaw',
					hermes: 'Hermes',
					codexCli: 'Codex CLI',
				},
				synced: 'synced',
			},
		},
		mobileSteps: {
			title: 'How to get started',
			steps: [
				{
					label: 'Download KeySync',
					desc: 'Get the installer for macOS, Windows, or Linux',
				},
				{
					label: 'Install and connect',
					desc: 'KeySync auto-detects your existing tools and settings',
				},
				{
					label: 'Manage from any browser',
					desc: 'Update keys, models, and endpoints — all synced',
				},
			],
		},
		howItWorks: {
			eyebrow: 'How it works',
			title: 'Three steps. Then never touch a config file again.',
			steps: [
				{
					title: 'Build a provider profile',
					body: 'Bundle your API keys, default models, and custom endpoints into one profile — Anthropic, OpenAI, Google, OpenRouter, or your own local gateway.',
				},
				{
					title: 'Pick your tools',
					body: 'Choose which agents and tools KeySync manages: <code>Claude Code</code>, <code>Codex</code>, <code>OpenClaw</code>, <code>Hermes</code>, and more.',
				},
				{
					title: 'Sync everywhere',
					body: "KeySync writes each tool's native config for you. Change a key once and it lands in every tool, on every machine.",
				},
			],
			guarantees: {
				eyebrow: 'What stays true',
				intro: 'Four guarantees carry through the workflow, no matter which provider or agent you connect.',
				items: [
					{
						title: 'One source of truth',
						body: 'Keys, models, and endpoints live in one profile, so rotations happen once.',
					},
					{
						title: 'Native to every agent',
						body: "KeySync writes each agent's own format and file location, with no wrapper to learn.",
					},
					{
						title: 'Encrypted, everywhere',
						body: 'Keys are encrypted on device before sync; the cloud only stores ciphertext.',
					},
					{
						title: 'Safe by default',
						body: 'Every write starts with a local backup, and apply reports show what synced.',
					},
				],
			},
		},
		security: {
			eyebrow: 'Built for handling secrets',
			title: 'Sync keys without losing control.',
			lead: 'Secrets are encrypted before they leave your machine. Local configs are backed up before every write.',
			items: [
				{
					title: 'Encrypted before it leaves your machine',
					body: 'Your keys are encrypted client-side — the cloud only ever stores ciphertext.',
				},
				{
					title: 'Local backup before every write',
					body: "Each tool's existing config is saved locally first, so a sync can never silently overwrite your setup.",
				},
				{
					title: 'Visible status instead of silent failure',
					body: 'Apply reports flag which devices synced and which still need attention.',
				},
				{
					title: 'Writes the explicit config files your tools already read',
					body: 'Known files in their own formats — no vague compatibility claim.',
				},
			],
		},
		problem: {
			eyebrow: 'Provider drift',
			title: 'Provider configs drift across machines.',
			items: [
				'Your CC Switch setup works on one machine, then every <b>new laptop or server</b> starts from zero.',
				'Mac, Windows, Linux, desktop, notebook — API keys, endpoints, and models <b>fall out of sync</b>.',
				'Team setup turns into <b>copied secrets in chat</b> when someone needs the same key or endpoint.',
				"When a provider rate-limits while you're away, switching models still depends on <b>the right machine</b>.",
			],
			deviceNames: {
				workLaptop: 'Work Laptop',
				homeDesktop: 'Home Desktop',
				server: 'Server',
			},
			status: {
				updated: "'Key-old' updated to 'Key-new'",
				notSynced: 'Not Synced',
				connected: 'connected',
				disconnected: 'disconnected',
			},
		},
		faq: {
			eyebrow: 'Questions',
			title: 'Good things to know',
			items: [
				{
					q: 'Which AI agents and tools does it support?',
					a: 'The ones you already run — Claude Code, Codex, OpenClaw, and Hermes, with more added regularly. KeySync writes each one\'s native config file, so support is really just about knowing the format.',
				},
				{
					q: 'How are my API keys stored?',
					a: 'Keys are encrypted on your machine before they\'re ever uploaded. The cloud stores only encrypted data so your setup can follow you across devices — but your secrets stay yours.',
				},
				{
					q: 'What if a sync breaks my config?',
					a: "It won't silently. KeySync saves a local backup of each file before writing, and the apply report flags any device that didn't sync cleanly — so failures are visible rather than silent.",
				},
				{
					q: 'Can I use custom endpoints or a local gateway?',
					a: 'Yes. Set a custom base URL per provider — a proxy, a self-hosted gateway, or a local model server — and KeySync points every tool at it.',
				},
				{
					q: 'Do my agents need to change anything?',
					a: "No. KeySync writes the same config files your agents already read. There's nothing for them to integrate with and nothing new to learn — KeySync is the key and config layer beneath them, not another agent.",
				},
			],
		},
		contactQr: {
			eyebrow: 'Contact',
			title: 'Want KeySync for your team? Contact us',
			body: 'For trials, deployment, team purchasing, or configuration migration support, reach out to us.',
			caption: 'Scan to contact us',
			alt: 'QR code to contact KeySync support',
		},
		finalCta: {
			title: 'Set it once. <span>Sync it everywhere.</span>',
			body: 'Download the desktop client, connect your first provider, and push your config to every AI agent in under a minute.',
			ctaDownload: 'Download KeySync',
			ctaHow: 'See how it works',
			mobileCopy: 'Get download link',
			cliHint: '$ ./keysync · requires Node.js 24+',
		},
		keysyncPaths: {
			anthropic: '~/.claude/settings.json',
			codex: '~/.codex/config.toml',
			openclaw: '~/.openclaw/openclaw.json',
			hermes: '~/.hermes/config.yaml',
		},
		keysyncShortNames: {
			claudeCode: 'CC',
			openclaw: 'OC',
			hermes: 'He',
			codex: 'Cx',
		},
	},
	keysyncDownload: {
		pageTitle: 'Download KeySync — One config for every AI agent',
		pageDescription:
			'Download KeySync for macOS, Windows, and Linux. Keep your AI agent providers, keys, models, and endpoints in one place and sync them everywhere.',
		breadcrumb: 'Download',
		title: 'Download KeySync',
		platforms: {
			macOS: {
				title: 'macOS',
				description: 'Apple Silicon native, desktop-ready.',
				primary: 'macOS (Apple Silicon)',
			},
			Windows: {
				title: 'Windows',
				description: 'Installer or portable, x64 desktop.',
				primary: 'Installer (x64)',
				portable: 'Portable (x64)',
			},
			Linux: {
				title: 'Linux',
				description: 'AppImage for desktop, CLI for server.',
				primary: 'AppImage (x64)',
				appImageArm: 'AppImage (arm64)',
			},
		},
		cli: {
			generic: (arch: string) => `CLI (${arch})`,
			universal: 'Universal',
		},
		empty: {
			text: 'No downloads available.',
			fallback: 'Open download hub',
		},
		manifest: {
			unavailable: 'Manifest unavailable — use fallback link below.',
			released: (date: string) => `Released ${date}`,
		},
		kindLabels: {
			installer: 'installer',
			appimage: 'AppImage',
			deb: 'Deb package',
			portable: 'portable zip',
			tarball: 'tarball',
		},
	},
	footer: {
		orgName: 'SubLang International',
		tagline: 'Language tools, reference essays, and engineering notes.',
		linkGitHub: 'GitHub',
		linkX: 'X / Twitter',
		linkEngineering: 'Engineering',
		linkBlog: 'Blog',
		copyright: (year: number) => `© ${year} SubLang International.`,
	},
	consent: {
		text: 'Help us improve your experience. Allow anonymous analytics.',
		accept: 'Yes',
		reject: 'No',
	},
} as const;

export type Messages = typeof messages;
