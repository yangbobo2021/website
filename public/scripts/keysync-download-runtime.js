// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

const ARCH_PRIORITY = ['arm64', 'x64', 'x86_64', 'amd64'];
const ARCH_ALIASES = {
	x64: ['x64', 'x86_64', 'amd64'],
	arm64: ['arm64', 'aarch64'],
};

export const DOWNLOAD_TARGETS = [
	{ id: 'macos-dmg', platform: 'macOS', kind: 'dmg', arch: 'arm64' },
	{ id: 'windows-installer', platform: 'Windows', kind: 'installer', arch: 'x64' },
	{ id: 'windows-portable', platform: 'Windows', kind: 'portable', arch: 'x64' },
	{ id: 'linux-appimage-x64', platform: 'Linux', kind: 'appimage', arch: 'x64' },
	{ id: 'linux-appimage-arm64', platform: 'Linux', kind: 'appimage', arch: 'arm64' },
	{ id: 'linux-cli-x64', platform: 'Linux CLI', kind: 'tar.gz', arch: 'x64' },
	{ id: 'linux-cli-arm64', platform: 'Linux CLI', kind: 'tar.gz', arch: 'arm64' },
];

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

function archIndex(arch) {
	const index = ARCH_PRIORITY.indexOf(String(arch ?? '').toLowerCase());
	return index === -1 ? ARCH_PRIORITY.length : index;
}

function platformIndex(platform) {
	const order = ['macOS', 'Windows', 'Linux', 'Linux CLI'];
	const index = order.indexOf(platform);
	return index === -1 ? order.length : index;
}

function normalizeKind(kind) {
	return String(kind ?? '').toLowerCase();
}

function archMatches(actual, expected) {
	const normalizedActual = String(actual ?? '').toLowerCase();
	const accepted = ARCH_ALIASES[expected] || [expected];
	return accepted.includes(normalizedActual);
}

function pickArtifact(artifacts, target) {
	const matches = artifacts.filter((item) => {
		return (
			item.platform === target.platform &&
			normalizeKind(item.kind) === normalizeKind(target.kind) &&
			archMatches(item.arch, target.arch)
		);
	});
	if (matches.length === 0) {
		return null;
	}
	return [...matches].sort((a, b) => archIndex(a.arch) - archIndex(b.arch) || a.fileName.localeCompare(b.fileName))[0];
}

function releasedText(pattern, date) {
	return String(pattern || 'Released {date}').replace('{date}', date);
}

function cacheBustedUrl(url) {
	const separator = String(url).includes('?') ? '&' : '?';
	return `${url}${separator}t=${Date.now()}`;
}

function actionFromArtifact(artifact, version) {
	if (!artifact) return undefined;
	return {
		url: artifact.url,
		fileName: artifact.fileName,
		version,
		meta: `${artifact.arch ? artifact.arch : 'Universal'} · ${formatBytes(artifact.size)}`,
	};
}

export function buildDownloadView(manifest, copy) {
	const artifacts = normalizeArtifacts(manifest).sort((a, b) => {
		const platformDelta = platformIndex(a.platform) - platformIndex(b.platform);
		return platformDelta || archIndex(a.arch) - archIndex(b.arch) || a.fileName.localeCompare(b.fileName);
	});
	const version = manifest?.version
		? String(manifest.version).startsWith('v')
			? String(manifest.version)
			: `v${manifest.version}`
		: 'Latest';
	const releaseDate = manifest?.releaseDate ? new Date(manifest.releaseDate).toISOString().slice(0, 10) : '';
	const actions = {};
	const missingTargets = [];

	for (const target of DOWNLOAD_TARGETS) {
		const artifact = pickArtifact(artifacts, target);
		const action = actionFromArtifact(artifact, version);
		if (action) {
			actions[target.id] = action;
		} else {
			missingTargets.push(target.id);
		}
	}

	return {
		version,
		releaseDate,
		versionText: releaseDate ? `${version} · ${releasedText(copy.manifest.releasedPattern, releaseDate)}` : version,
		actions,
		missingTargets,
	};
}

function getDownloadLinks(root) {
	return Array.from(root.querySelectorAll('[data-download-target]'));
}

function setLinkDisabled(link, status) {
	link.href = '#';
	link.setAttribute('aria-disabled', 'true');
	link.dataset.downloadStatus = status;
	delete link.dataset.downloadFileName;
	delete link.dataset.downloadVersion;
	delete link.dataset.downloadMeta;
}

function updateDownloadLinks(root, actions) {
	const links = getDownloadLinks(root);
	const expectedIds = new Set(DOWNLOAD_TARGETS.map((target) => target.id));
	const presentIds = new Set(links.map((link) => link.dataset.downloadTarget).filter(Boolean));
	const missingDomTargets = [...expectedIds].filter((id) => !presentIds.has(id));
	const extraDomTargets = [...presentIds].filter((id) => !expectedIds.has(id));
	if (missingDomTargets.length > 0 || extraDomTargets.length > 0) {
		throw new Error(
			`download page targets mismatch: missing=${missingDomTargets.join(',') || 'none'} extra=${
				extraDomTargets.join(',') || 'none'
			}`,
		);
	}

	for (const link of links) {
		const action = actions[link.dataset.downloadTarget];
		if (!action) {
			setLinkDisabled(link, 'missing');
			continue;
		}
		link.href = action.url;
		link.setAttribute('aria-disabled', 'false');
		link.dataset.downloadStatus = 'ready';
		link.dataset.downloadFileName = action.fileName;
		link.dataset.downloadVersion = action.version;
		link.dataset.downloadMeta = action.meta;
	}
}

function setFallback(root, fallbackUrl, copy) {
	const empty = root.querySelector('[data-keysync-download-empty]');
	const version = root.querySelector('[data-keysync-download-version]');
	for (const link of getDownloadLinks(root)) {
		setLinkDisabled(link, 'error');
	}
	if (empty) {
		empty.hidden = false;
		const fallbackLink = empty.querySelector('a');
		if (fallbackLink) {
			fallbackLink.href = fallbackUrl;
			fallbackLink.textContent = copy.empty.fallback;
		}
		const textNode = Array.from(empty.childNodes || []).find((node) => node.nodeType === 3);
		if (textNode) {
			textNode.textContent = `${copy.empty.text} `;
		}
	}
	if (version) version.textContent = copy.manifest.unavailable;
	root.dataset.manifestState = 'error';
}

export async function initKeySyncDownloadPage({ document, fetchImpl, manifestUrl, fallbackUrl, copy }) {
	const roots = Array.from(document.querySelectorAll('[data-keysync-download-root]'));
	if (roots.length === 0) return;
	try {
		const response = await fetchImpl(cacheBustedUrl(manifestUrl), {
			headers: { accept: 'application/json' },
			cache: 'no-store',
		});
		if (!response.ok) {
			throw new Error(`manifest fetch failed: ${response.status}`);
		}
		const manifest = await response.json();
		const view = buildDownloadView(manifest, copy);
		if (view.missingTargets.length > 0) {
			throw new Error(`manifest is missing download targets: ${view.missingTargets.join(',')}`);
		}
		for (const root of roots) {
			const empty = root.querySelector('[data-keysync-download-empty]');
			const version = root.querySelector('[data-keysync-download-version]');
			updateDownloadLinks(root, view.actions);
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
		if (link.getAttribute('aria-disabled') === 'true') {
			event.preventDefault();
			return;
		}
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
