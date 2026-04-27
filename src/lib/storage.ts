/**
 * Typed wrapper around localStorage with JSON serialisation and graceful fallbacks.
 *
 * Every existing key used across the project is centralised here to avoid
 * typo-style bugs and to document the shape of the data.
 */

import type { User, UserPrefs, SupportTicket, Language } from '@models/user';

export const STORAGE_KEYS = {
    USER: 'sao_user',
    PREFS: 'sao_prefs',
    LANG: 'sao_lang',
    SUPPORT_TICKETS: 'sao_support_tickets',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Read and parse JSON value from localStorage.
 * Returns `fallback` if the key is missing or the stored value is not valid JSON.
 */
export function readJSON<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

/**
 * Serialise and write value to localStorage.
 * Silently ignores quota/availability errors (e.g. private mode).
 */
export function writeJSON(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* ignore: private mode / quota exceeded */
    }
}

/**
 * Read a plain string value.
 */
export function readString(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

/**
 * Write a plain string value.
 */
export function writeString(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* ignore */
    }
}

/**
 * Remove a key entirely.
 */
export function remove(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        /* ignore */
    }
}

// ===== Typed accessors for known keys =====

export const getCurrentUser = (): User | null =>
    readJSON<User | null>(STORAGE_KEYS.USER, null);

export const setCurrentUser = (user: User): void =>
    writeJSON(STORAGE_KEYS.USER, user);

export const clearCurrentUser = (): void =>
    remove(STORAGE_KEYS.USER);

export const getPrefs = (): UserPrefs =>
    readJSON<UserPrefs>(STORAGE_KEYS.PREFS, {});

export const setPrefs = (prefs: UserPrefs): void =>
    writeJSON(STORAGE_KEYS.PREFS, prefs);

export const getLanguage = (): Language | null =>
    readString(STORAGE_KEYS.LANG) as Language | null;

export const setLanguage = (lang: Language): void =>
    writeString(STORAGE_KEYS.LANG, lang);

export const getSupportTickets = (): SupportTicket[] =>
    readJSON<SupportTicket[]>(STORAGE_KEYS.SUPPORT_TICKETS, []);

export const addSupportTicket = (ticket: SupportTicket): void => {
    const tickets = getSupportTickets();
    tickets.push(ticket);
    writeJSON(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
};
