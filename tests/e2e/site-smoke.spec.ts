import { expect, test } from '@playwright/test';
import { trackClientErrors } from './helpers';

const PAGES = [
    '/',
    '/login.html',
    '/register.html',
    '/news.html',
    '/forum.html',
    '/support.html',
    '/settings.html',
    '/my-tickets.html',
    '/admin-tickets.html',
    '/ticket.html',
    '/auth-action.html',
    '/privacy.html',
    '/terms.html',
    '/404.html',
];

for (const pagePath of PAGES) {
    test(`smoke: ${pagePath} opens without runtime crash`, async ({ page }) => {
        const { assertNoErrors } = trackClientErrors(page);

        const response = await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), `bad status for ${pagePath}`).toBeLessThan(400);
        await expect(page.locator('body')).toBeVisible();
        await expect(page).toHaveTitle(/Sword Art Online/i);

        assertNoErrors();
    });
}
