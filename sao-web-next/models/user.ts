/**
 * Shared user-related type definitions.
 */

export interface User {
    /** Unique login/username, 3–20 chars */
    name: string;

    /** Email address */
    email: string;

    /** First name */
    firstName?: string;

    /** Last name */
    lastName?: string;

    /** Password hash (current localStorage demo stores plain text for demo only) */
    password?: string;

    /** Authentication provider */
    provider?: 'local' | 'google';

    /** ISO timestamp of account creation */
    createdAt?: string;

    /** ISO timestamp of last login */
    lastLoginAt?: string;

    /** Optional profile avatar URL (Google provider only for now) */
    avatar?: string;
}

export interface UserPrefs {
    /** Preferred UI language code */
    lang?: Language;

    /** Whether UI animations are enabled (default: true) */
    anim?: boolean;

    /** Whether in-game sound / background music is enabled (default: false) */
    sound?: boolean;

    /** Preferred theme (reserved for future) */
    theme?: 'dark' | 'light';

    /** When true, the home page entry overlay is skipped on subsequent visits. */
    skipIntro?: boolean;
}

/**
 * Support ticket structure (stored in localStorage under `sao_support_tickets`).
 */
export interface SupportTicket {
    id: string;
    name: string;
    email: string;
    category: 'account' | 'bug' | 'payment' | 'tech' | 'other';
    subject: string;
    message: string;
    attachments: SupportAttachment[];
    createdAt: string;
    lang: Language;
}

export interface SupportAttachment {
    name: string;
    size: number;
    type: string;
}

/**
 * Supported UI languages. Add new codes here when expanding.
 */
export type Language = 'ru' | 'en' | 'de' | 'fr' | 'pl' | 'es' | 'cz' | 'it' | 'ua';

export const SUPPORTED_LANGUAGES: readonly Language[] = [
    'ru', 'en', 'de', 'fr', 'pl', 'es', 'cz', 'it', 'ua',
] as const;

export const DEFAULT_LANGUAGE: Language = 'ru';
