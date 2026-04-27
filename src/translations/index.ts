/**
 * Translation registry.
 *
 * Every page calls `buildDict('pageName')` at startup and feeds the result
 * into `registerTranslations()` from `@lib`. The builder merges the shared
 * `common` keys with the page-specific dictionary, so each page only pays
 * for the strings it actually uses.
 *
 * Adding a new page:
 *   1. Create `src/translations/{page}.ts` with `LanguageMap<YourDict>`.
 *   2. Import it below and register it in `PAGE_DICTS`.
 *   3. Call `buildDict('{page}')` in the page entry point.
 */

import type { Language } from '@models/user';
import type { LanguageMap, TranslationMap } from '@models/i18n';
import { SUPPORTED_LANGUAGES } from '@models/user';

import { common } from './common';
import { loginTranslations } from './login';
import { registerTranslations as registerDict } from './register';
import { settingsTranslations } from './settings';
import { supportTranslations } from './support';
import { homeTranslations } from './home';
import { privacyTranslations } from './privacy';
import { termsTranslations } from './terms';
import { newsTranslations } from './news';
import { forumTranslations } from './forum';
import { notFoundTranslations } from './notfound';
import { authActionTranslations } from './auth-action';
import { ticketsTranslations } from './tickets';

/** Runtime shape that all page dictionaries satisfy (each locale → object). */
type AnyLanguageMap = LanguageMap<object>;

/**
 * Registered page-specific dictionaries. Each entry provides **all** supported
 * languages (enforced by each dict's own `LanguageMap<...>` typing), so a
 * missing locale surfaces as a compile-time error at the dict definition.
 *
 * Values are typed generically (`LanguageMap<object>`) to accommodate the
 * varying concrete shapes across pages — merging into the runtime
 * `TranslationMap` happens in `buildDict()` below.
 */
const PAGE_DICTS = {
    login: loginTranslations,
    register: registerDict,
    settings: settingsTranslations,
    support: supportTranslations,
    home: homeTranslations,
    privacy: privacyTranslations,
    terms: termsTranslations,
    news: newsTranslations,
    forum: forumTranslations,
    notfound: notFoundTranslations,
    authAction: authActionTranslations,
    myTickets: ticketsTranslations,
    ticket: ticketsTranslations,
    adminTickets: ticketsTranslations,
} satisfies Record<string, AnyLanguageMap>;

export type PageName = keyof typeof PAGE_DICTS;

/**
 * Merge common keys with a specific page dictionary and return a
 * `TranslationMap` ready for `registerTranslations()`.
 */
export function buildDict(page: PageName): TranslationMap {
    const pageDict = PAGE_DICTS[page] as AnyLanguageMap;
    const result = {} as TranslationMap;

    for (const lang of SUPPORTED_LANGUAGES) {
        result[lang] = {
            ...common[lang],
            ...(pageDict[lang] as Record<string, never>),
        };
    }

    return result;
}

/**
 * Build a common-only dictionary for pages that have no page-specific keys
 * (e.g. simple legal pages).
 */
export function buildCommonDict(): TranslationMap {
    const result = {} as TranslationMap;
    for (const lang of SUPPORTED_LANGUAGES as readonly Language[]) {
        result[lang] = { ...common[lang] };
    }
    return result;
}

export { common } from './common';
export { loginTranslations } from './login';
export { registerTranslations } from './register';
export { settingsTranslations } from './settings';
export { supportTranslations } from './support';
export { homeTranslations } from './home';
export { privacyTranslations } from './privacy';
export { termsTranslations } from './terms';
export { newsTranslations } from './news';
export { forumTranslations } from './forum';
export { notFoundTranslations } from './notfound';
export { authActionTranslations } from './auth-action';
export { ticketsTranslations } from './tickets';
export type { CommonDict } from './common';
export type { LoginDict } from './login';
export type { RegisterDict } from './register';
export type { SettingsDict } from './settings';
export type { SupportDict, FaqItem } from './support';
export type { HomeDict } from './home';
export type { PrivacyDict } from './privacy';
export type { TermsDict } from './terms';
export type { NewsDict } from './news';
export type { ForumDict } from './forum';
export type { NotFoundDict } from './notfound';
export type { AuthActionDict } from './auth-action';
export type { TicketsDict } from './tickets';
