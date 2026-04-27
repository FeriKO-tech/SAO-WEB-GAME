/**
 * i18n type definitions.
 *
 * A translation dictionary maps string keys to either plain strings
 * or parameterised functions (for interpolation of user-supplied values).
 */

import type { Language } from './user';

/**
 * Value for a single translation entry.
 * - `string` — static text
 * - `(...) => string` — parameterised message (e.g. `"File \"${n}\" is too large"`)
 * - `string[]` — ordered arrays (e.g. nav labels)
 */
export type TranslationValue =
    | string
    | string[]
    | ((...args: string[]) => string)
    | Record<string, unknown>;

export type TranslationDict = Record<string, TranslationValue>;

export type TranslationMap = Record<Language, TranslationDict>;

/**
 * Utility that guarantees a translation source provides **every** supported
 * language. Used by per-page translation modules so a missing locale is a
 * compile-time error rather than a runtime fallback.
 *
 * The generic is intentionally **unconstrained**: concrete page dictionaries
 * declare their own shape (including nested objects like `emailMsg`) without
 * needing to inherit from `TranslationDict`. The runtime contract (string
 * keys → `TranslationValue` values) is upheld by convention, and the `t()`
 * helper is strict enough on its own to catch missing keys.
 *
 * @example
 * const loginTranslations: LanguageMap<LoginDict> = {
 *   RU: { ... }, EN: { ... }, DE: { ... }, ...  // TS complains if any locale is missing
 * };
 */
export type LanguageMap<T> = Record<Language, T>;
