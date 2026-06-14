// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import type { Messages } from './en';

export const messages: Messages = {
	nav: {
		home: '首页',
		product: '产品',
		productLabel: 'KeySync',
		productMenuItems: [
			{ label: 'KeySync', href: '/keysync/' },
		],
		engineering: '工程笔记',
		languageLabel: '语言',
		unavailableTitle: '当前页面暂无该语言版本',
		menuOpen: '打开菜单',
	},
	home: {
		tag: '开源语言实验室',
		headline: '为可读、可运行的软件打造语言工具。',
		description:
			'SubLang 探索面向数据管理与编程的语言模型，以及人类可读系统的工艺。我们发表参考文章和工程笔记，服务于构建表达性软件的团队。',
		ctaPrimary: '阅读 GEARS 中文版',
		ctaPrimaryHref: '/zh/ref/gears-ai-ready-spec-syntax/',
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
	},
	footer: {
		orgName: 'SubLang International',
		tagline: '语言工具、参考文章与工程笔记。',
		linkGitHub: 'GitHub',
		linkX: 'X / Twitter',
		linkEngineering: '工程笔记',
		copyright: (year: number) => `© ${year} SubLang International.`,
	},
	consent: {
		text: '帮助我们改善你的体验。允许匿名分析数据。',
		accept: '允许',
		reject: '拒绝',
	},
};
