// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
	DOWNLOAD_TARGETS,
	buildDownloadView,
	initKeySyncDownloadPage,
} from '../public/scripts/keysync-download-runtime.js';

const manifestUrl = 'https://keysync.sublang.ai/keysync-updates/latest.json';
const fallbackUrl = 'https://keysync.sublang.ai/keysync/download';
const expectedTargetIds = DOWNLOAD_TARGETS.map((target) => target.id);

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

class FakeTextNode {
	constructor(textContent = '') {
		this.nodeType = 3;
		this.textContent = textContent;
	}
}

class FakeNode {
	constructor() {
		this.textContent = '';
		this.hidden = false;
		this.dataset = {};
		this.childNodes = [];
	}

	querySelector() {
		return null;
	}
}

class FakeAnchor extends FakeNode {
	constructor({ targetId, platform = 'unknown', label = targetId }) {
		super();
		this.href = '#';
		this.dataset = {
			downloadTarget: targetId,
			platform,
			downloadStatus: 'pending',
		};
		this.attributes = new Map([['aria-disabled', 'true']]);
		this.labelNode = { textContent: label };
	}

	setAttribute(name, value) {
		this.attributes.set(name, String(value));
	}

	getAttribute(name) {
		return this.attributes.get(name) ?? null;
	}

	querySelector(selector) {
		return selector === 'span' ? this.labelNode : null;
	}
}

class FakeEmpty extends FakeNode {
	constructor() {
		super();
		this.childNodes = [new FakeTextNode('No downloads available. ')];
		this.fallbackLink = new FakeAnchor({ targetId: 'fallback', label: 'Open download hub' });
	}

	querySelector(selector) {
		return selector === 'a' ? this.fallbackLink : null;
	}
}

class FakeRoot extends FakeNode {
	constructor() {
		super();
		this.grid = new FakeNode();
		this.grid.innerHTML = 'static download grid must stay intact';
		this.empty = new FakeEmpty();
		this.version = new FakeNode();
		this.links = DOWNLOAD_TARGETS.map((target) => new FakeAnchor({ targetId: target.id, platform: target.platform }));
	}

	querySelector(selector) {
		if (selector === '[data-keysync-download-grid]') return this.grid;
		if (selector === '[data-keysync-download-empty]') return this.empty;
		if (selector === '[data-keysync-download-version]') return this.version;
		return null;
	}

	querySelectorAll(selector) {
		if (selector === '[data-download-target]') return this.links;
		return [];
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

function assertReadyLinks(root, version) {
	assert.equal(root.links.length, 7);
	for (const link of root.links) {
		assert.equal(link.getAttribute('aria-disabled'), 'false', `${link.dataset.downloadTarget} should be enabled`);
		assert.equal(link.dataset.downloadStatus, 'ready', `${link.dataset.downloadTarget} should be ready`);
		assert.equal(link.dataset.downloadVersion, `v${version}`, `${link.dataset.downloadTarget} version mismatch`);
		assert.match(link.href, new RegExp(`/${version}/`), `${link.dataset.downloadTarget} URL should include version`);
		assert.ok(link.dataset.downloadFileName, `${link.dataset.downloadTarget} should expose a file name`);
		assert.ok(link.dataset.downloadMeta, `${link.dataset.downloadTarget} should expose file metadata`);
	}
	assert.match(root.links.find((link) => link.dataset.downloadTarget === 'macos-dmg').href, /KeySync-0\.1\.\d+-arm64\.dmg$/);
	assert.match(
		root.links.find((link) => link.dataset.downloadTarget === 'windows-installer').href,
		/KeySync%20Setup%200\.1\.\d+\.exe$/,
	);
	assert.match(
		root.links.find((link) => link.dataset.downloadTarget === 'windows-portable').href,
		/KeySync-0\.1\.\d+-portable\.zip$/,
	);
	assert.match(
		root.links.find((link) => link.dataset.downloadTarget === 'linux-appimage-x64').href,
		/KeySync-0\.1\.\d+-x86_64\.AppImage$/,
	);
	assert.match(
		root.links.find((link) => link.dataset.downloadTarget === 'linux-appimage-arm64').href,
		/KeySync-0\.1\.\d+-arm64\.AppImage$/,
	);
	assert.match(
		root.links.find((link) => link.dataset.downloadTarget === 'linux-cli-x64').href,
		/keysync-cli-0\.1\.\d+-linux-x64\.tar\.gz$/,
	);
	assert.match(
		root.links.find((link) => link.dataset.downloadTarget === 'linux-cli-arm64').href,
		/keysync-cli-0\.1\.\d+-linux-arm64\.tar\.gz$/,
	);
}

const firstView = buildDownloadView(makeManifest('0.1.10'), copy);
assert.equal(firstView.versionText, 'v0.1.10 · Released 2026-06-23');
assert.deepEqual(Object.keys(firstView.actions).sort(), [...expectedTargetIds].sort());
assert.deepEqual(firstView.missingTargets, []);
assert.match(firstView.actions['macos-dmg'].url, /KeySync-0\.1\.10-arm64\.dmg$/);
assert.match(firstView.actions['linux-cli-arm64'].url, /keysync-cli-0\.1\.10-linux-arm64\.tar\.gz$/);

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
assert.equal(root.grid.innerHTML, 'static download grid must stay intact');
assert.equal(root.empty.hidden, true);
assertReadyLinks(root, '0.1.10');

await initKeySyncDownloadPage({
	document,
	fetchImpl: async () => ({ ok: true, json: async () => makeManifest('0.1.11') }),
	manifestUrl,
	fallbackUrl,
	copy,
});
assert.equal(root.dataset.releaseVersion, 'v0.1.11');
assert.equal(root.grid.innerHTML, 'static download grid must stay intact');
assertReadyLinks(root, '0.1.11');
assert.doesNotMatch(root.links.find((link) => link.dataset.downloadTarget === 'macos-dmg').href, /0\.1\.10/);

await initKeySyncDownloadPage({
	document,
	fetchImpl: async () => ({ ok: false, status: 503 }),
	manifestUrl,
	fallbackUrl,
	copy,
});
assert.equal(root.dataset.manifestState, 'error');
assert.equal(root.grid.innerHTML, 'static download grid must stay intact');
assert.equal(root.empty.hidden, false);
assert.equal(root.empty.fallbackLink.href, fallbackUrl);
assert.equal(root.version.textContent, copy.manifest.unavailable);
for (const link of root.links) {
	assert.equal(link.href, '#');
	assert.equal(link.getAttribute('aria-disabled'), 'true');
	assert.equal(link.dataset.downloadStatus, 'error');
}

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
		const targets = [...html.matchAll(/data-download-target="([^"]+)"/g)].map((match) => match[1]);
		assert.deepEqual(targets.sort(), [...expectedTargetIds].sort(), `${outputPath} must contain exactly 7 fixed links`);
		assert.equal((html.match(/href="#"/g) || []).length, 7, `${outputPath} fixed links must start disabled`);
		assert.match(html, /class="ks-platform-logo" data-astro-cid-/, `${outputPath} platform logos must be statically scoped`);
	}

	const builtRuntime = readIfExists('dist/scripts/keysync-download-runtime.js');
	assert.doesNotMatch(builtRuntime, /renderDownloadCardsHtml/, 'runtime must not render download cards dynamically');
	assert.doesNotMatch(builtRuntime, /ks-download-choice/, 'runtime must not contain static card markup');
	assert.doesNotMatch(builtRuntime, /innerHTML\s*=/, 'runtime must not replace fixed download card markup');

	const builtCss = walkFiles('dist/_astro')
		.filter((file) => file.endsWith('.css'))
		.map((file) => readFileSync(file, 'utf8'))
		.join('\n');
	assert.match(
		builtCss,
		/\.ks-platform-logo\[data-astro-cid-[^\]]+\]\{width:28px;height:28px;flex-shrink:0\}/,
		'static platform logos should keep Astro-scoped sizing',
	);
}
