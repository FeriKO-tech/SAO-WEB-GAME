import { expect, test } from '@playwright/test';

test('forum category counters are never negative', async ({ page }) => {
    await page.goto('/forum.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#forum-categories')).toBeVisible();

    const content = (await page.locator('#forum-categories').innerText()).toLowerCase();

    // Covers EN/RU words used in UI for these counters.
    expect(content).not.toMatch(/-\d+\s*(posts|threads|сообщений|тем)/);
});
