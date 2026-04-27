import { expect, test } from '@playwright/test';
import { trackClientErrors } from './helpers';

test('settings: unauthenticated user is redirected to login', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/settings.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page).toHaveURL(/login(?:\.html)?/);
    assertNoErrors();
});

test('ticket list pages redirect unauthenticated users to login', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/my-tickets.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page).toHaveURL(/login(?:\.html)?\?returnTo=.*my-tickets\.html/);

    await page.goto('/admin-tickets.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page).toHaveURL(/login(?:\.html)?\?returnTo=.*admin-tickets\.html/);
    assertNoErrors();
});

test('ticket and auth-action pages render state containers', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/ticket.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#ticket-state')).toBeVisible();

    await page.goto('/auth-action.html', { waitUntil: 'domcontentloaded' });
    await expect(
        page.locator('#view-loading:not([hidden]), #view-error:not([hidden]), #view-reset-form:not([hidden]), #view-success:not([hidden])'),
    ).toBeVisible();
    assertNoErrors();
});
