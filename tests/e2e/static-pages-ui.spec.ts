import { expect, test } from '@playwright/test';
import { switchLanguageTo, trackClientErrors } from './helpers';

test('privacy page: legal content and language switch render', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/privacy.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.legal-title')).toBeVisible();
    await expect(page.locator('.legal-content section')).toHaveCount(10);

    await switchLanguageTo(page, 'EN');
    await expect(page.locator('#current-lang')).toHaveText('EN');

    assertNoErrors();
});

test('terms page: legal content renders all sections', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/terms.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.legal-title')).toBeVisible();
    await expect(page.locator('.legal-content section')).toHaveCount(9);

    assertNoErrors();
});

test('404 page: fallback actions render', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/404.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.notfound-title')).toBeVisible();
    await expect(page.locator('.notfound-actions a')).toHaveCount(2);
    await expect(page.locator('.notfound-btn--primary')).toBeVisible();
    await expect(page.locator('.notfound-btn--ghost')).toBeVisible();

    assertNoErrors();
});
