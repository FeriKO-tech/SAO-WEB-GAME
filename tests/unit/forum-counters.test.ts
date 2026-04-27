import { test, expect } from '@playwright/test';
import { clampCounter } from '../../src/lib/forum-counters';

test('clampCounter returns 0 for negative values', () => {
    expect(clampCounter(-2)).toBe(0);
});

test('clampCounter returns integer non-negative values as-is', () => {
    expect(clampCounter(7)).toBe(7);
});

test('clampCounter normalizes invalid numbers to 0', () => {
    expect(clampCounter(Number.NaN)).toBe(0);
    expect(clampCounter(Number.POSITIVE_INFINITY)).toBe(0);
});
