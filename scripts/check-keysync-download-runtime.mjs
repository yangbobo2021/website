// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
	buildDownloadView,
	initKeySyncDownloadPage,
	renderDownloadCardsHtml,
} from '../public/scripts/keysync-download-runtime.js';

const manifestUrl = 'https://keysync.sublang.ai/keysync-updates/latest.json';
const fallbackUrl = 'https://keysync.sublang.ai/keysync/download';

const copy = {
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
		generic: 'CLI ({arch})',
		universal: 'Universal',
	},
	empty: {
		text: 'No downloads available.',
		fallback: 'Open download hub',
	},
	manifest: {
		loading: 'Loading latest release...',
		unavailable: 'Manifest unavailable - use fallback link below.',
		releasedPattern: 'Released {date}',
	},
	logos: {
		macOS: { src: '/assets/apple.svg', alt: 'macOS' },
		Windows: { src: '/assets/windows.svg', alt: 'Windows' },
		Linux: { src: '/assets/linux.svg', alt: 'Linux' },
	},
};

function makeManifest(version) {
	const base = `https://keysync.sublang.ai/keysync-updates/${version}`;
	return {
		version,
		releaseDate: '2026-06-23T00:00:00.000Z',
		artifacts: [
			{
				platform: 'macOS',
				kind: 'dmg',
				arch: 'arm64',
				fileName: `KeySync-${version}-arm64.dmg`,
				url: `${base}/KeySync-${version}-arm64.dmg`,
				size: 120_000_000,
			},
			{
				platform: 'Windows',
				kind: 'installer',
				arch: 'x64',
				fileName: `KeySync Setup ${version}.exe`,
				url: `${base}/KeySync%20Setup%20${version}.exe`,
				size: 130_000_000,
			},
			{
				platform: 'Windows',
				kind: 'portable',
				arch: 'x64',
				fileName: `KeySync-${version}-portable.zip`,
				url: `${base}/KeySync-${version}-portable.zip`,
				size: 125_000_000,
			},
			{
				platform: 'Linux',
				kind: 'appimage',
				arch: 'x64',
				fileName: `KeySync-${version}-x86_64.AppImage`,
				url: `${base}/KeySync-${version}-x86_64.AppImage`,
				size: 135_000_000,
			},
			{
				platform: 'Linux',
				kind: 'appimage',
				arch: 'arm64',
				fileName: `KeySync-${version}-arm64.AppImage`,
				url: `${base}/KeySync-${version}-arm64.AppImage`,
				size: 134_000_000,
			},
			{
				platform: 'Linux CLI',
				kind: 'tar.gz',
				arch: 'x64',
				fileName: `keysync-cli-${version}-linux-x64.tar.gz`,
				url: `${base}/keysync-cli-${version}-linux-x64.tar.gz`,
				size: 20_000_000,
			},
			{
				platform: 'Linux CLI',
				kind: 'tar.gz',
				arch: 'arm64',
				fileName: `keysync-cli-${version}-linux-arm64.tar.gz`,
				url: `${base}/keysync-cli-${version}-linux-arm64.tar.gz`,
				size: 20_000_000,
			},
		],
	};
}

class FakeNode {
	constructor() {
		this.innerHTML = '';
		this.textContent = '';
		this.hidden = false;
		this.dataset = {};
	}

	querySelector() {
		return null;
	}
}

class FakeRoot extends FakeNode {
	constructor() {
		super();
		this.grid = new FakeNode();
		this.empty = new FakeNode();
		this.version = new FakeNode();
	}

	querySelector(selector) {
		if (selector === '[data-keysync-download-grid]') return this.grid;
		if (selector === '[data-keysync-download-empty]') return this.empty;
		if (selector === '[data-keysync-download-version]') return this.version;
		return null;
	}
}

function makeFakeDocument(root) {
	return {
		querySelectorAll(selector) {
			return selector === '[data-keysync-download-root]' ? [root] : [];
		},
	};
}

function walkFiles(root) {
	if (!existsSync(root)) return [];
	return readdirSync(root).flatMap((name) => {
		const file = join(root, name);
		if (statSync(file).isDirectory()) {
			return walkFiles(file);
		}
		return [file];
	});
}

function readIfExists(path) {
	return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

const firstView = buildDownloadView(makeManifest('0.1.10'), copy);
assert.equal(firstView.versionText, 'v0.1.10 · Released 2026-06-23');
assert.equal(firstView.cards.length, 3);
assert.match(renderDownloadCardsHtml(firstView.cards), /KeySync-0\.1\.10-arm64\.dmg/);
assert.match(renderDownloadCardsHtml(firstView.cards), /keysync-cli-0\.1\.10-linux-arm64\.tar\.gz/);

const root = new FakeRoot();
const document = makeFakeDocument(root);
await initKeySyncDownloadPage({
	document,
	fetchImpl: async (url, options) => {
		assert.match(url, /^https:\/\/keysync\.sublang\.ai\/keysync-updates\/latest\.json\?t=\d+$/);
		assert.equal(options.cache, 'no-store');
		return { ok: true, json: async () => makeManifest('0.1.10') };
	},
	manifestUrl,
	fallbackUrl,
	copy,
});
assert.equal(root.dataset.manifestState, 'ready');
assert.equal(root.dataset.releaseVersion, 'v0.1.10');
assert.match(root.grid.innerHTML, /KeySync-0\.1\.10-arm64\.dmg/);
assert.equal(root.empty.hidden, true);

await initKeySyncDownloadPage({
	document,
	fetchImpl: async () => ({ ok: true, json: async () => makeManifest('0.1.11') }),
	manifestUrl,
	fallbackUrl,
	copy,
});
assert.equal(root.dataset.releaseVersion, 'v0.1.11');
assert.doesNotMatch(root.grid.innerHTML, /KeySync-0\.1\.10-arm64\.dmg/);
assert.match(root.grid.innerHTML, /KeySync-0\.1\.11-arm64\.dmg/);

await initKeySyncDownloadPage({
	document,
	fetchImpl: async () => ({ ok: false, status: 503 }),
	manifestUrl,
	fallbackUrl,
	copy,
});
assert.equal(root.dataset.manifestState, 'error');
assert.equal(root.grid.innerHTML, '');
assert.equal(root.empty.hidden, false);
assert.match(root.empty.innerHTML, /https:\/\/keysync\.sublang\.ai\/keysync\/download/);
assert.equal(root.version.textContent, copy.manifest.unavailable);

for (const file of walkFiles('src').concat(walkFiles('specs'))) {
	const text = readFileSync(file, 'utf8');
	assert.doesNotMatch(text, /demo\.signoff\.bio/, `${file} still references demo download host`);
}

for (const sourcePath of [
	'src/pages/keysync/download.astro',
	'src/pages/[locale]/keysync/download.astro',
	'src/pages/keysync/index.astro',
	'src/pages/[locale]/keysync/index.astro',
]) {
	assert.doesNotMatch(
		readFileSync(sourcePath, 'utf8'),
		/fetch\(KEYSYNC_LATEST_MANIFEST_URL/,
		`${sourcePath} still fetches KeySync manifest during Astro build`,
	);
}

if (existsSync('dist')) {
	for (const file of walkFiles('dist')) {
		const text = readFileSync(file, 'utf8');
		assert.doesNotMatch(text, /demo\.signoff\.bio/, `${file} still references demo download host`);
	}

	for (const outputPath of ['dist/keysync/download/index.html', 'dist/zh/keysync/download/index.html']) {
		const html = readIfExists(outputPath);
		assert.match(html, /\/scripts\/keysync-download-runtime\.js/, `${outputPath} is missing runtime script`);
		assert.match(html, /keysync-updates\/latest\.json/, `${outputPath} is missing manifest URL`);
		assert.doesNotMatch(
			html,
			/KeySync(?:%20Setup)?[^"'<>]*(?:\d+\.\d+\.\d+)/,
			`${outputPath} contains static versioned installer links`,
		);
	}
}
