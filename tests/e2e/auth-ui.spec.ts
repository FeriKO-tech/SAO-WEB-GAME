import { expect, test } from '@playwright/test';
import { switchLanguageTo, trackClientErrors } from './helpers';

test('login: required validation and forgot modal toggles', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/login.html', { waitUntil: 'domcontentloaded' });

    await page.locator('#submit-btn').click();
    await expect(page.locator('.form-error[data-for="email"]')).toBeVisible();
    await expect(page.locator('.form-error[data-for="password"]')).toBeVisible();

    await page.getByRole('button', { name: /забыли пароль|forgot/i }).click();
    await expect(page.locator('#forgot-modal')).toBeVisible();
    await page.fill('#forgot-email', 'bad-email');
    await page.locator('#forgot-submit').click();
    await expect(page.locator('#forgot-msg')).toHaveClass(/show/);
    await page.locator('#forgot-cancel').click();
    await expect(page.locator('#forgot-modal')).toBeHidden();

    await switchLanguageTo(page, 'EN');
    assertNoErrors();
});

test('register: password strength block and terms checkbox present', async ({ page }) => {
    const { assertNoErrors } = trackClientErrors(page);
    await page.goto('/register.html', { waitUntil: 'domcontentloaded' });

    await page.fill('#password', 'abc');
    await expect(page.locator('#password-strength')).toBeVisible();
    await page.fill('#password-confirm', 'xyz');
    await expect(page.locator('#match-indicator')).toHaveClass(/show/);
    await expect(page.locator('#match-indicator')).toHaveClass(/fail/);
    await expect(page.locator('#agree')).toBeVisible();

    await page.locator('#submit-btn').click();
    await expect(page.locator('.form-error[data-for="username"]')).toBeVisible();
    await expect(page.locator('.form-error[data-for="email"]')).toBeVisible();
    await expect(page.locator('.form-error[data-for="password-confirm"]')).toBeVisible();

    assertNoErrors();
});
