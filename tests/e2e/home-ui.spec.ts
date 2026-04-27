import { expect, test } from '@playwright/test';
import { dismissEntryOverlay, switchLanguageTo, trackClientErrors } from './helpers';

test('home: entry overlay and waitlist modal interactions', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await dismissEntryOverlay(page);

    await expect(page.locator('#main-nav')).toBeVisible();
    await expect(page.locator('#nav-login-btn')).toBeVisible();
    await expect(page.locator('#play-now-cta')).toBeVisible();
    await expect(page.locator('a[href="forum.html"]').first()).toBeVisible();
    await expect(page.locator('a[href="support.html"]').first()).toBeVisible();

    await page.locator('#play-now-cta').click();
    await expect(page.locator('#waitlist-modal')).toBeVisible();
    await page.locator('#waitlist-cancel').click();
    await expect(page.locator('#waitlist-modal')).toBeHidden();

    assertNoErrors();
});

test('home: language switch works', async ({ page }) => {
    await dismissEntryOverlay(page);
    await switchLanguageTo(page, 'EN');
    await expect(page.locator('#current-lang')).toHaveText('EN');
    await expect(page.locator('#play-now-cta')).toBeVisible();
});
