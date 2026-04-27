import { expect, test } from '@playwright/test';
import { trackClientErrors } from './helpers';

test('support: FAQ, validation, and attachment UI render', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/support.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#faq-list')).toBeVisible();
    await expect(page.locator('#support-form')).toBeVisible();
    await expect(page.locator('#sup-submit')).toBeVisible();
    await expect(page.locator('#sup-message')).toBeVisible();

    await page.locator('#sup-submit').click();
    await expect(page.locator('#sup-name-msg')).toHaveClass(/show/);
    await expect(page.locator('#sup-email-msg')).toHaveClass(/show/);
    await expect(page.locator('#sup-subject-msg')).toHaveClass(/show/);
    await expect(page.locator('#sup-message-msg')).toHaveClass(/show/);

    await page.locator('#file-input').setInputFiles('tests/fixtures/sample.log');
    await expect(page.locator('#file-list .sao-file-item')).toBeVisible();
    await expect(page.locator('#file-list')).toContainText('sample.log');

    assertNoErrors();
});

test('news: filters switch states render', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/news.html', { waitUntil: 'domcontentloaded' });

    const updates = page.locator('.news-filter[data-filter="catUpdates"]');
    await updates.click();
    await expect(updates).toHaveClass(/active/);
    await expect(updates).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#news-grid')).toBeVisible();

    const all = page.locator('.news-filter[data-filter="all"]');
    await all.click();
    await expect(all).toHaveClass(/active/);
    await expect(all).toHaveAttribute('aria-selected', 'true');

    assertNoErrors();
});

test('forum: category, thread, and posting entry flows render safely', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/forum.html', { waitUntil: 'domcontentloaded' });

    const hiddenState = page.locator('#forum-hidden-state:not([hidden])');
    if (await hiddenState.count()) {
        await expect(hiddenState).toBeVisible();
        assertNoErrors();
        return;
    }

    await expect(page.locator('#forum-main-view')).toBeVisible();

    const categoryCard = page.locator('.forum-cat-card').first();
    await expect(categoryCard).toBeVisible();
    await categoryCard.click();
    await expect(page.locator('#forum-category-view')).toBeVisible();

    const newThreadBtn = page.locator('#forum-new-thread-btn');
    if (await newThreadBtn.isVisible()) {
        await newThreadBtn.click();
        await expect(page).toHaveURL(/login\.html|forum\.html/);
        if (/login\.html/.test(page.url())) {
            await expect(page.locator('#login-form')).toBeVisible();
            assertNoErrors();
            return;
        }

        const threadModal = page.locator('#forum-thread-modal');
        if (await threadModal.isVisible()) {
            await page.locator('#forum-thread-cancel').click();
            await expect(threadModal).toBeHidden();
        }
    }

    const threadCards = page.locator('.forum-thread[data-thread-id]');
    if (await threadCards.count()) {
        const threadCard = threadCards.first();
        await threadCard.click();
        await expect(page.locator('#forum-thread-screen')).toBeVisible();
        const threadBreadHome = page.locator('#forum-thread-ready .forum-home-link').first();
        await expect(threadBreadHome).toBeVisible();
        await threadBreadHome.click();
        await expect(page.locator('#forum-main-view')).toBeVisible();
    }

    const catBreadHome = page.locator('#forum-category-view .forum-home-link').first();
    if (await catBreadHome.isVisible()) {
        await catBreadHome.click();
        await expect(page.locator('#forum-main-view')).toBeVisible();
    }

    assertNoErrors();
});
