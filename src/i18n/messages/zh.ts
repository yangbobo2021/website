// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

// Use a flexible shape type: each locale's strings are independent literals,
// but the structure must match English. We can't reuse `Messages` directly
// because TypeScript infers string literal types from `as const` data.
type MessageShape = {
	nav: {
		home: string;
		product: string;
		productLabel: string;
		productMenuItems: Array<{ label: string; href: string }>;
		engineering: string;
		languageLabel: string;
		unavailableTitle: string;
		menuOpen: string;
		menuClose: string;
		mobileCtaDownload: string;
		socialGitHub: string;
		socialX: string;
		navPrimary: string;
		productMenuLabel: string;
		socialLinks: string;
	};
	home: {
		tag: string;
		headline: string;
		description: string;
		ctaPrimary: string;
		ctaPrimaryHref: string;
		ctaGitHub: string;
		ctaX: string;
		focusTitle: string;
		focus: Array<{ label: string; body: string }>;
		productsTitle: string;
		products: Array<{
			name: string;
			description: string;
			learnMoreHref: string;
			downloadHref: string;
		}>;
	};
	engineering: {
		eyebrow: string;
		title: string;
		pageTitle: string;
		pageDescription: string;
	};
	keysync: {
		pageTitle: string;
		pageDescription: string;
		hero: {
			tag: string;
			headline: string;
			sub: string;
			ctaDownload: string;
			ctaHow: string;
			mobileCta: { title: string; desc: string; copy: string; copied: string; failed: string };
			trust: string[];
			visual: {
				sourceLabel: string;
				sourceBadge: string;
				hubName: string;
				keys: { anthropic: string; openai: string; google: string; model: string; endpoint: string };
				tools: { claudeCode: string; openclaw: string; hermes: string; codexCli: string };
				synced: string;
			};
		};
		mobileSteps: {
			title: string;
			steps: Array<{ label: string; desc: string }>;
		};
		howItWorks: {
			eyebrow: string;
			title: string;
			steps: Array<{ title: string; body: string }>;
			guarantees: {
				eyebrow: string;
				intro: string;
				items: Array<{ title: string; body: string }>;
			};
		};
		security: {
			eyebrow: string;
			title: string;
			lead: string;
			items: Array<{ title: string; body: string }>;
		};
		problem: {
			eyebrow: string;
			title: string;
			items: string[];
			deviceNames: { workLaptop: string; homeDesktop: string; server: string };
			status: { updated: string; notSynced: string; connected: string; disconnected: string };
		};
		faq: {
			eyebrow: string;
			title: string;
			items: Array<{ q: string; a: string }>;
		};
		finalCta: {
			title: string;
			body: string;
			ctaDownload: string;
			ctaHow: string;
			mobileCopy: string;
			cliHint: string;
		};
		keysyncPaths: { anthropic: string; codex: string; openclaw: string; hermes: string };
		keysyncShortNames: { claudeCode: string; openclaw: string; hermes: string; codex: string };
	};
	keysyncDownload: {
		pageTitle: string;
		pageDescription: string;
		breadcrumb: string;
		title: string;
		platforms: {
			macOS: { title: string; description: string; primary: string };
			Windows: { title: string; description: string; primary: string; portable: string };
			Linux: { title: string; description: string; primary: string; appImageArm: string };
		};
		cli: { generic: (arch: string) => string; universal: string };
		empty: { text: string; fallback: string };
		manifest: { unavailable: string; released: (date: string) => string };
		kindLabels: { installer: string; appimage: string; deb: string; portable: string; tarball: string };
	};
	footer: {
		orgName: string;
		tagline: string;
		linkGitHub: string;
		linkX: string;
		linkEngineering: string;
		copyright: (year: number) => string;
	};
	consent: { text: string; accept: string; reject: string };
};

export const messages: MessageShape = {
	nav: {
		home: '首页',
		product: '产品',
		productLabel: 'KeySync',
		productMenuItems: [
			{ label: 'KeySync', href: '/keysync/' },
		],
		engineering: '工程',
		languageLabel: '语言',
		unavailableTitle: '当前页面暂无该语言版本',
		menuOpen: '打开菜单',
		menuClose: '关闭菜单',
		mobileCtaDownload: '下载',
		socialGitHub: '在 GitHub 上关注 SubLang',
		socialX: '在 X 上关注 SubLang',
		navPrimary: '主导航',
		productMenuLabel: '产品菜单',
		socialLinks: '社交链接',
	},
	home: {
		tag: '开源语言实验室',
		headline: '为可读、可运行的软件打造语言工具。',
		description:
			'SubLang 探索面向数据管理与编程的语言模型，以及人类可读系统的实践。我们发表参考文章和工程笔记，服务于构建表达性软件的团队。',
		ctaPrimary: '阅读工程',
		ctaPrimaryHref: '/engineering/',
		ctaGitHub: '在 GitHub 探索',
		ctaX: '在 X 关注',
		focusTitle: '当前关注',
		focus: [
			{
				label: '可读语法',
				body: '设计能够一致表达意图的规范层。',
			},
			{
				label: '统一模型',
				body: '把应用逻辑、数据与知识统一为一个计算模型。',
			},
			{
				label: '数据所有权',
				body: '把数据控制权交还用户，为智能体提供无孤岛访问。',
			},
		],
		productsTitle: '我们的产品',
		products: [
			{
				name: 'KeySync',
				description: '一个配置，同步到所有 AI 智能体。让提供商、密钥和模型在多台设备间保持一致。',
				learnMoreHref: '/keysync/',
				downloadHref: '/keysync/download/',
			},
		],
	},
	engineering: {
		eyebrow: '工程',
		title: '工具链与架构',
		pageTitle: '工程',
		pageDescription:
			'面向 AI 驱动软件开发的技术栈、架构与规范实践。',
	},
	keysync: {
		pageTitle: 'KeySync — 一个配置，同步到所有 AI 智能体',
		pageDescription:
			'KeySync 是你所有 AI 智能体的配置层。将提供商、密钥、模型和端点集中管理，同步到所有设备——加密传输，本地备份每次写入。',
		hero: {
			tag: 'AI 智能体配置同步',
			headline: '还在反复粘贴 AI 密钥？<br>KeySync 一处配置，处处同步',
			sub: '让 Claude Code、Codex、OpenClaw 和 Hermes 在所有笔记本和服务器上使用相同的 LLM 提供商（<b>API 密钥、端点和模型</b>）。',
			ctaDownload: '下载 KeySync',
			ctaHow: '了解工作原理',
			mobileCta: {
				title: '在电脑上获取 KeySync',
				desc: 'KeySync 运行在桌面端。复制此链接，在电脑上打开。',
				copy: '复制',
				copied: '已复制！',
				failed: '复制失败',
			},
			trust: ['每次写入前本地备份', '端到端加密', '写入各工具原生配置'],
			visual: {
				sourceLabel: '单一数据源',
				sourceBadge: '一处管理',
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
				synced: '已同步',
			},
		},
		mobileSteps: {
			title: '快速上手',
			steps: [
				{
					label: '下载 KeySync',
					desc: '获取 macOS、Windows 或 Linux 安装包',
				},
				{
					label: '安装并连接',
					desc: 'KeySync 自动检测你现有的工具和配置',
				},
				{
					label: '在任意浏览器中管理',
					desc: '更新密钥、模型和端点——全部自动同步',
				},
			],
		},
		howItWorks: {
			eyebrow: '工作原理',
			title: '三步完成。此后无需再碰配置文件。',
			steps: [
				{
					title: '创建（LLM）提供商配置',
					body: '将 API 密钥、默认模型和自定义端点打包成一个配置——支持 Anthropic、OpenAI、Google、OpenRouter，或你自己的本地网关。',
				},
				{
					title: '选择要绑定的工具',
					body: '选择 KeySync 要绑定的智能体和工具：<code>Claude Code</code>、<code>Codex</code>、<code>OpenClaw</code>、<code>Hermes</code> 等。',
				},
				{
					title: '应用到所有设备',
					body: 'KeySync 以各工具原生格式写入配置。一次更改密钥，所有工具、所有设备同步更新。',
				},
			],
			guarantees: {
				eyebrow: '始终保持',
				intro: '无论你使用哪个提供商或智能体，四项保证贯穿整个流程。',
				items: [
					{
						title: '单一数据源',
						body: '密钥、模型和端点集中管理，轮换一次即可。',
					},
					{
						title: '兼容所有智能体原生格式',
						body: 'KeySync 以各工具自己的格式和文件位置写入配置，无需学习任何新工具。',
					},
					{
						title: '加密无处不在',
						body: '密钥在设备上加密后再同步；云端只存储密文。',
					},
					{
						title: '默认安全',
						body: '每次写入前先本地备份，同步报告清晰显示各设备状态。',
					},
				],
			},
		},
		security: {
			eyebrow: '专为密钥安全设计',
			title: '同步密钥，不失控制权。',
			lead: '密钥在离开你的设备前已加密。每次写入前，本地配置先备份。',
			items: [
				{
					title: '离开设备前已加密',
					body: '密钥在客户端加密后再上传——云端只存储密文。',
				},
				{
					title: '每次写入前本地备份',
					body: 'KeySync 先在本地保存各工具的现有配置，再写入新配置——绝不会静默覆盖你的设置。',
				},
				{
					title: '状态可见，而非静默失败',
					body: '同步报告标注哪些设备成功同步，哪些还需关注——失败不是静默的。',
				},
				{
					title: '写入各工具已有的配置文件',
					body: '使用各工具自己格式的文件路径——不是模糊的兼容性声明。',
				},
			],
		},
		problem: {
			eyebrow: '多设备配置不同步',
			title: 'LLM 配置在多设备间总是对不齐。',
			items: [
				'在一台设备上配置好了 CC Switch，新<b>笔记本或服务器</b>又要从头开始。',
				'Mac、Windows、Linux，台式机、笔记本——API 密钥、端点和模型<b>逐渐失去同步</b>。',
				'团队配置变成<b>聊天里传来传去的密钥</b>，谁需要同一套密钥或端点就得找其他人要。',
				'当提供商限流时人在外面，切换模型还得靠<b>正确的设备</b>。',
			],
			deviceNames: {
				workLaptop: '工作笔记本',
				homeDesktop: '家用台式机',
				server: '服务器',
			},
			status: {
				updated: "'旧密钥' 已更新为 '新密钥'",
				notSynced: '未同步',
				connected: '已连接',
				disconnected: '未连接',
			},
		},
		faq: {
			eyebrow: '常见问题',
			title: '你需要知道的几件事',
			items: [
				{
					q: '支持哪些 AI 智能体和工具？',
					a: '你已经用开的那些——Claude Code、Codex、OpenClaw 和 Hermes，持续增加中。KeySync 写入各工具自己的配置文件，支持就是了解各工具的配置文件格式。',
				},
				{
					q: '我的 API 密钥如何存储？',
					a: '密钥在你的机器上加密后才上传。云端只存储密文，让你的配置可以跨设备同步——但密钥始终属于你。',
				},
				{
					q: '如果同步弄乱了配置怎么办？',
					a: '不会静默出错。KeySync 写入前先在本地备份各文件的现有配置，同步报告会标注哪些设备没有同步成功——失败是可见的，不是静默的。',
				},
				{
					q: '可以使用自定义端点或本地网关吗？',
					a: '可以。按提供商设置自定义基础 URL——代理、自托管网关或本地模型服务器，KeySync 会让所有工具指向它。',
				},
				{
					q: '我的智能体需要改动什么吗？',
					a: '不需要。KeySync 写入的就是各智能体已经在读取的配置文件。无需集成什么，也无需学习什么新工具——KeySync 位于它们底层的配置层，不是另一个智能体。',
				},
			],
		},
		finalCta: {
			title: '配置一次。<span>同步到所有设备。</span>',
			body: '下载桌面客户端，连接第一个提供商，一分钟内将配置推送到所有 AI 智能体。',
			ctaDownload: '下载 KeySync',
			ctaHow: '了解工作原理',
			mobileCopy: '获取下载链接',
			cliHint: '$ ./keysync · 需要 Node.js 24+',
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
		pageTitle: '下载 KeySync — 一个配置，同步到所有 AI 智能体',
		pageDescription:
			'下载 macOS、Windows 和 Linux 版 KeySync。将 AI 智能体的提供商、密钥、模型和端点集中管理，同步到所有设备。',
		breadcrumb: '下载',
		title: '下载 KeySync',
		platforms: {
			macOS: {
				title: 'macOS',
				description: 'Apple Silicon 原生，桌面端即用。',
				primary: 'macOS (Apple Silicon)',
			},
			Windows: {
				title: 'Windows',
				description: '安装包或便携版，x64 桌面端。',
				primary: '安装包 (x64)',
				portable: '便携版 (x64)',
			},
			Linux: {
				title: 'Linux',
				description: '桌面端用 AppImage，服务器用 CLI。',
				primary: 'AppImage (x64)',
				appImageArm: 'AppImage (arm64)',
			},
		},
		cli: {
			generic: (arch: string) => `CLI (${arch})`,
			universal: 'Universal',
		},
		empty: {
			text: '暂无可用下载。',
			fallback: '打开下载中心',
		},
		manifest: {
			unavailable: '清单不可用——使用下方备用链接。',
			released: (date: string) => `发布于 ${date}`,
		},
		kindLabels: {
			installer: '安装包',
			appimage: 'AppImage',
			deb: 'Deb 安装包',
			portable: '便携版 zip',
			tarball: 'tarball',
		},
	},
	footer: {
		orgName: 'SubLang International',
		tagline: '语言工具、参考文章与工程笔记。',
		linkGitHub: 'GitHub',
		linkX: 'X / Twitter',
		linkEngineering: '工程',
		copyright: (year: number) => `© ${year} SubLang International.`,
	},
	consent: {
		text: '帮助我们改善你的体验。允许匿名分析数据。',
		accept: '允许',
		reject: '拒绝',
	},
};
