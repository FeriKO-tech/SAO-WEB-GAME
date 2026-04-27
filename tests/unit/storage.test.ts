import { test, expect } from '@playwright/test';
import {
    STORAGE_KEYS,
    addSupportTicket,
    getSupportTickets,
    readJSON,
    readString,
    remove,
    writeJSON,
    writeString,
} from '../../src/lib/storage';

test.describe('storage helpers', () => {
    const store = new Map<string, string>();
    let originalLocalStorage: any;

    test.beforeEach(() => {
        store.clear();
        originalLocalStorage = (globalThis as any).localStorage;
        (globalThis as any).localStorage = {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => {
                store.set(key, value);
            },
            removeItem: (key: string) => {
                store.delete(key);
            },
        };
    });

    test.afterEach(() => {
        (globalThis as any).localStorage = originalLocalStorage;
    });

    test('reads and writes plain strings', () => {
        writeString('sample', 'value');
        expect(readString('sample')).toBe('value');

        remove('sample');
        expect(readString('sample')).toBeNull();
    });

    test('reads JSON with a fallback for missing or broken values', () => {
        expect(readJSON('missing', { ok: false })).toEqual({ ok: false });

        store.set('broken', '{bad json');
        expect(readJSON('broken', ['fallback'])).toEqual(['fallback']);

        writeJSON('object', { ok: true, count: 2 });
        expect(readJSON('object', { ok: false, count: 0 })).toEqual({ ok: true, count: 2 });
    });

    test('appends support tickets to typed storage', () => {
        addSupportTicket({
            id: 'ticket-1',
            name: 'Tester',
            email: 'tester@example.com',
            category: 'other',
            subject: 'Need help',
            message: 'This is a support test message with enough characters.',
            attachments: [],
            createdAt: '2026-04-24T00:00:00.000Z',
            lang: 'EN',
        });

        const saved = getSupportTickets();
        expect(saved).toHaveLength(1);
        expect(saved[0]?.id).toBe('ticket-1');
        expect(store.get(STORAGE_KEYS.SUPPORT_TICKETS)).toContain('ticket-1');
    });
});
