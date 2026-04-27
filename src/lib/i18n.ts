/**
 * Internationalisation (i18n) core.
 *
 * Translations themselves live in `src/translations/` — this module only
 * provides the runtime machinery: current language detection, DOM sweeping
 * over `data-i18n` elements, and the helper `t()` for programmatic lookups.
 *
 * Fallback chain: requested lang → RU → key name.
 */

import type { Language } from '@models/user';
import type { TranslationDict, TranslationMap, TranslationValue } from '@models/i18n';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@models/user';
import { getLanguage, setLanguage } from './storage';

let registry: TranslationMap | null = null;
let currentLang: Language = DEFAULT_LANGUAGE;
const changeListeners = new Set<(lang: Language) => void>();

/**
 * Register the translation dictionary for all supported languages.
 * Call once at page startup before `initI18n()`.
 */
export function registerTranslations(map: TranslationMap): void {
    registry = map;
}

/**
 * Current active language.
 */
export function getCurrentLanguage(): Language {
    return currentLang;
}

/**
 * Check whether a code is one of the supported languages.
 */
export function isSupportedLanguage(code: string): code is Language {
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

/**
 * Resolve initial language from storage → browser → default.
 */
export function resolveInitialLanguage(): Language {
    const stored = getLanguage();
    if (stored && isSupportedLanguage(stored)) return stored;

    const browser = (navigator.language || '').slice(0, 2).toUpperCase();
    if (isSupportedLanguage(browser)) return browser;

    return DEFAULT_LANGUAGE;
}

/**
 * Look up a translation key in the active dictionary.
 * Returns the key itself if not found (makes missing keys visible).
 */
export function t(key: string): string {
    const value = lookup(key);
    return typeof value === 'string' ? value : key;
}

/**
 * Look up a parameterised translation.
 * The dictionary entry must be a function accepting `string` args.
 */
export function tFn(key: string, ...args: string[]): string {
    const value = lookup(key);
    if (typeof value === 'function') return value(...args);
    if (typeof value === 'string') return value;
    return key;
}

/**
 * Look up an array-valued translation (e.g. `nav: ['Discord', 'Forum', ...]`).
 */
export function tArray(key: string): string[] {
    const value = lookup(key);
    return Array.isArray(value) ? value : [];
}

function lookup(key: string): TranslationValue | undefined {
    if (!registry) return undefined;
    const dict = registry[currentLang] ?? registry[DEFAULT_LANGUAGE];
    return resolveNestedKey(dict, key);
}

function resolveNestedKey(
    dict: TranslationDict,
    key: string,
): TranslationValue | undefined {
    // Supports "nav.0" array access and "foo.bar" nested records
    const parts = key.split('.');
    let current: unknown = dict;

    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (Array.isArray(current)) {
            const idx = Number(part);
            if (Number.isNaN(idx)) return undefined;
            current = current[idx];
            continue;
        }
        if (typeof current === 'object') {
            current = (current as Record<string, unknown>)[part];
            continue;
        }
        return undefined;
    }

    return current as TranslationValue;
}

/**
 * Apply `data-i18n` attributes across the DOM to the currently active language.
 *
 * Supports three modes, based on the attribute value:
 *   - `data-i18n="key"` — replace element's text
 *   - `data-i18n="key" data-i18n-attr="placeholder"` — write to an attribute
 *   - `data-i18n-html="true"` — use innerHTML instead of textContent (unsafe; use sparingly)
 */
export function applyDom(root: ParentNode = document): void {
    const elements = root.querySelectorAll<HTMLElement>('[data-i18n]');
    elements.forEach((el) => {
        const key = el.dataset.i18n;
        if (!key) return;
        const value = lookup(key);
        if (typeof value !== 'string') return;

        const attr = el.dataset.i18nAttr;
        if (attr) {
            el.setAttribute(attr, value);
            return;
        }

        if (el.dataset.i18nHtml === 'true') {
            el.innerHTML = value;
            return;
        }

        // Preserve leading child node if it's a child element (e.g. span inside a label)
        const firstChild = el.firstChild;
        if (firstChild && firstChild.nodeType === Node.TEXT_NODE && el.children.length > 0) {
            firstChild.nodeValue = value;
            return;
        }

        el.textContent = value;
    });
}

/**
 * Switch the active language, persist the choice, update DOM, and notify listeners.
 */
export function setActiveLanguage(lang: Language): void {
    if (!isSupportedLanguage(lang)) return;
    currentLang = lang;
    setLanguage(lang);
    document.documentElement.lang = lang.toLowerCase();
    applyDom();
    changeListeners.forEach((fn) => fn(lang));
}

/**
 * Subscribe to language-change events (useful for components that re-render
 * themselves, e.g. FAQ accordions with localised content).
 */
export function onLanguageChange(fn: (lang: Language) => void): () => void {
    changeListeners.add(fn);
    return () => changeListeners.delete(fn);
}

/**
 * One-shot initialisation. Call after `registerTranslations()`.
 */
export function initI18n(): Language {
    currentLang = resolveInitialLanguage();
    document.documentElement.lang = currentLang.toLowerCase();
    applyDom();
    return currentLang;
}
