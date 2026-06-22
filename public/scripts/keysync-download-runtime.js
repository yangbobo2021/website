// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

const ARCH_PRIORITY = ['arm64', 'x64', 'x86_64', 'amd64'];
const LINUX_DOWNLOAD_ARCH_ORDER = ['x64', 'x86_64', 'amd64', 'arm64'];

function toNumber(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}
	return 0;
}

function formatBytes(bytes) {
	const sizeNumber = toNumber(bytes);
	if (!sizeNumber || sizeNumber <= 0) return 'Unknown size';
	const units = ['B', 'KB', 'MB', 'GB'];
	let size = sizeNumber;
	let unit = 0;
	while (size >= 1024 && unit < units.length - 1) {
		size /= 1024;
		unit += 1;
	}
	return `${size.toFixed(1)} ${units[unit]}`;
}

function escapeHtml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeAttr(value) {
	return escapeHtml(value);
}

function normalizeArtifacts(manifest) {
	const rawArtifacts = Array.isArray(manifest?.artifacts) ? manifest.artifacts : [];
	return rawArtifacts.filter((item) => {
		return (
			item &&
			typeof item === 'object' &&
			typeof item.platform === 'string' &&
			typeof item.fileName === 'string' &&
			typeof item.url === 'string'
		);
	});
}

function archIndex(arch, order = ARCH_PRIORITY) {
	const index = order.indexOf(String(arch ?? '').toLowerCase());
	return index === -1 ? order.length : index;
}

function platformIndex(platform) {
	const order = ['macOS', 'Windows', 'Linux', 'Linux CLI'];
	const index = order.indexOf(platform);
	return index === -1 ? order.length : index;
}

function pickArtifact(artifacts, platform, kind, preferredArch) {
	const matches = artifacts.filter(
		(item) => item.platform === platform && String(item.kind ?? '').toLowerCase() === kind.toLowerCase(),
	);
	if (matches.length === 0) {
		return null;
	}
	const preferred = matches.find((artifact) => String(artifact.arch ?? '').toLowerCase() === preferredArch);
	if (preferred) {
		return preferred;
	}
	return [...matches].sort((a, b) => {
		const archDelta = archIndex(a.arch) - archIndex(b.arch);
		return archDelta || a.fileName.localeCompare(b.fileName);
	})[0];
}

function findArtifacts(artifacts, platform, kind) {
	return artifacts.filter(
		(item) => item.platform === platform && String(item.kind ?? '').toLowerCase() === kind.toLowerCase(),
	);
}

function actionFromArtifact(artifact, label) {
	if (!artifact) return undefined;
	return {
		label,
		url: artifact.url,
		meta: `${artifact.arch ? artifact.arch : 'Universal'} · ${formatBytes(artifact.size)}`,
	};
}

function releasedText(pattern, date) {
	return String(pattern || 'Released {date}').replace('{date}', date);
}

function cacheBustedUrl(url) {
	const separator = String(url).includes('?') ? '&' : '?';
	return `${url}${separator}t=${Date.now()}`;
}

export function buildDownloadView(manifest, copy) {
	const artifacts = normalizeArtifacts(manifest)
		.filter((artifact) => artifact.url && artifact.fileName)
		.sort((a, b) => {
			const platformDelta = platformIndex(a.platform) - platformIndex(b.platform);
			return platformDelta || archIndex(a.arch) - archIndex(b.arch) || a.fileName.localeCompare(b.fileName);
		});
	const version = manifest?.version
		? String(manifest.version).startsWith('v')
			? String(manifest.version)
			: `v${manifest.version}`
		: 'Latest';
	const releaseDate = manifest?.releaseDate ? new Date(manifest.releaseDate).toISOString().slice(0, 10) : '';
	const macInstaller = pickArtifact(artifacts, 'macOS', 'dmg', 'arm64');
	const windowsInstaller = pickArtifact(artifacts, 'Windows', 'installer', 'x64');
	const windowsPortable = pickArtifact(artifacts, 'Windows', 'portable', 'x64');
	const linuxAppImage = pickArtifact(artifacts, 'Linux', 'appimage', 'x64');
	const linuxAppImageArm = pickArtifact(artifacts, 'Linux', 'appimage', 'arm64');
	const linuxCliDownloads = [...findArtifacts(artifacts, 'Linux CLI', 'tar.gz')].sort(
		(a, b) => archIndex(a.arch, LINUX_DOWNLOAD_ARCH_ORDER) - archIndex(b.arch, LINUX_DOWNLOAD_ARCH_ORDER),
	);
	const linuxSecondary = [
		linuxAppImageArm?.url !== linuxAppImage?.url
			? actionFromArtifact(linuxAppImageArm, copy.platforms.Linux.appImageArm)
			: undefined,
		...linuxCliDownloads.map((artifact) =>
			actionFromArtifact(artifact, copy.cli.generic.replace('{arch}', artifact.arch ?? copy.cli.universal)),
		),
	].filter(Boolean);
	const cards = [
		{
			platformKey: 'macOS',
			title: copy.platforms.macOS.title,
			description: copy.platforms.macOS.description,
			logo: copy.logos.macOS,
			primary: actionFromArtifact(macInstaller, copy.platforms.macOS.primary),
			secondary: [],
		},
		{
			platformKey: 'Windows',
			title: copy.platforms.Windows.title,
			description: copy.platforms.Windows.description,
			logo: copy.logos.Windows,
			primary: actionFromArtifact(windowsInstaller, copy.platforms.Windows.primary),
			secondary: [actionFromArtifact(windowsPortable, copy.platforms.Windows.portable)].filter(Boolean),
		},
		{
			platformKey: 'Linux',
			title: copy.platforms.Linux.title,
			description: copy.platforms.Linux.description,
			logo: copy.logos.Linux,
			primary: actionFromArtifact(linuxAppImage, copy.platforms.Linux.primary),
			secondary: linuxSecondary,
		},
	].filter((card) => card.primary || card.secondary.length > 0);

	return {
		version,
		releaseDate,
		versionText: releaseDate ? `${version} · ${releasedText(copy.manifest.releasedPattern, releaseDate)}` : version,
		cards,
	};
}

function downloadIcon() {
	return '<svg class="ks-download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
}

function renderAction(action, platformKey) {
	return `<a href="${escapeAttr(action.url)}" class="ks-download-entry" data-platform="${escapeAttr(platformKey)}"><span>${escapeHtml(action.label)}</span>${downloadIcon()}</a>`;
}

export function renderDownloadCardsHtml(cards) {
	return cards
		.map((card) => {
			const logo = card.logo
				? `<img src="${escapeAttr(card.logo.src)}" alt="${escapeAttr(card.logo.alt)}" class="ks-platform-logo" />`
				: '';
			const primary = card.primary ? renderAction(card.primary, card.platformKey) : '';
			const secondary =
				card.secondary.length > 0
					? `<div class="ks-download-secondary">${card.secondary
							.map((action) => renderAction(action, card.platformKey))
							.join('')}</div>`
					: '';
			return `<article class="ks-download-choice"><div class="ks-download-platform-header">${logo}<h2 class="ks-download-platform">${escapeHtml(card.title)}</h2></div><p class="ks-download-desc">${escapeHtml(card.description)}</p><div class="ks-download-actions">${primary}${secondary}</div></article>`;
		})
		.join('');
}

function setFallback(root, fallbackUrl, copy) {
	const grid = root.querySelector('[data-keysync-download-grid]');
	const empty = root.querySelector('[data-keysync-download-empty]');
	const version = root.querySelector('[data-keysync-download-version]');
	if (grid) grid.innerHTML = '';
	if (empty) {
		empty.hidden = false;
		empty.innerHTML = `${escapeHtml(copy.empty.text)} <a href="${escapeAttr(fallbackUrl)}">${escapeHtml(
			copy.empty.fallback,
		)}</a>.`;
	}
	if (version) version.textContent = copy.manifest.unavailable;
	root.dataset.manifestState = 'error';
}

export async function initKeySyncDownloadPage({ document, fetchImpl, manifestUrl, fallbackUrl, copy }) {
	const roots = Array.from(document.querySelectorAll('[data-keysync-download-root]'));
	if (roots.length === 0) return;
	let manifest;
	try {
		const response = await fetchImpl(cacheBustedUrl(manifestUrl), {
			headers: { accept: 'application/json' },
			cache: 'no-store',
		});
		if (!response.ok) {
			throw new Error(`manifest fetch failed: ${response.status}`);
		}
		manifest = await response.json();
		const view = buildDownloadView(manifest, copy);
		if (view.cards.length === 0) {
			throw new Error('manifest has no downloadable artifacts');
		}
		for (const root of roots) {
			const grid = root.querySelector('[data-keysync-download-grid]');
			const empty = root.querySelector('[data-keysync-download-empty]');
			const version = root.querySelector('[data-keysync-download-version]');
			if (grid) grid.innerHTML = renderDownloadCardsHtml(view.cards);
			if (empty) empty.hidden = true;
			if (version) version.textContent = view.versionText;
			root.dataset.manifestState = 'ready';
			root.dataset.releaseVersion = view.version;
		}
	} catch {
		for (const root of roots) {
			setFallback(root, fallbackUrl, copy);
		}
	}
}

export function setupKeySyncDownloadTracking({ document, gadsId, conversionId }) {
	document.addEventListener('click', (event) => {
		const link = event.target?.closest?.('.ks-download-entry');
		if (!link) return;
		const platform = link.dataset.platform || 'unknown';
		const label = link.querySelector('span')?.textContent || 'unknown';
		if (typeof window.gtag === 'function') {
			window.gtag('event', 'download_keysync', {
				platform,
				tool: 'KeySync',
				download_label: label,
			});
			window.gtag('event', 'conversion', {
				send_to: `${gadsId}/${conversionId}`,
				value: 1.0,
				currency: 'USD',
			});
		}
	});
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	const boot = () => {
		const config = window.__KEYSYNC_DOWNLOAD_CONFIG__;
		if (!config) return;
		initKeySyncDownloadPage({
			document,
			fetchImpl: window.fetch.bind(window),
			manifestUrl: config.manifestUrl,
			fallbackUrl: config.fallbackUrl,
			copy: config.copy,
		});
		setupKeySyncDownloadTracking({
			document,
			gadsId: config.gadsId,
			conversionId: config.conversionId,
		});
	};
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot, { once: true });
	} else {
		boot();
	}
}
