import { expect, type Page } from '@playwright/test';

export function trackClientErrors(page: Page): { assertNoErrors: () => void } {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(`console.error: ${msg.text()}`);
        }
    });
    return {
        assertNoErrors: () => expect(errors, errors.join('\n')).toEqual([]),
    };
}

export async function switchLanguageTo(page: Page, lang: string): Promise<void> {
    await page.locator('#lang-btn').click();
    await page.locator(`#lang-dropdown [data-lang="${lang}"]`).click();
    await expect(page.locator('#current-lang')).toHaveText(lang);
}

export async function dismissEntryOverlay(page: Page): Promise<void> {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#entry-btn').click();
    await expect(page.locator('#entry-overlay')).toHaveClass(/hidden/);
}

export async function waitForAnyVisible(page: Page, selectors: string[], timeout = 10_000): Promise<string> {
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
        for (const selector of selectors) {
            const locator = page.locator(selector).first();
            if (await locator.isVisible().catch(() => false)) {
                return selector;
            }
        }

        await page.waitForTimeout(100);
    }

    throw new Error(`None of the selectors became visible: ${selectors.join(', ')}`);
}
