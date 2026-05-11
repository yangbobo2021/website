// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>

import { DEFAULT_LOCALE, type Locale } from '../config';
import { messages as en, type Messages } from './en';
import { messages as zh } from './zh';

const REGISTRY: Record<Locale, Messages> = {
	en,
	zh,
};

export function useTranslations(lang: Locale): Messages {
	return REGISTRY[lang] ?? REGISTRY[DEFAULT_LOCALE];
}
