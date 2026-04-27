import { test, expect } from '@playwright/test';
import { buildCommonDict, buildDict } from '../../src/translations';

test.describe('translation builders', () => {
    test('merges common and page-specific keys for a page dictionary', () => {
        const dict = buildDict('forum');

        expect(dict.RU.back).toBeTruthy();
        expect(dict.EN.cancel).toBeTruthy();
        expect(dict.RU.title).toBe('Форум');
        expect(dict.EN.threadReplySubmit).toBe('Reply');
    });

    test('returns only shared keys for the common dictionary builder', () => {
        const dict = buildCommonDict();

        expect(dict.RU.back).toBeTruthy();
        expect(dict.EN.cancel).toBeTruthy();
        expect('title' in dict.RU).toBe(false);
    });
});
