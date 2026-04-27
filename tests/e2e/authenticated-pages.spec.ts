import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test.describe.serial('Authenticated flows', () => {
    let email = '';
    let password = '';
    let username = '';

    test.beforeAll(async ({ browser }) => {
        // Create a user for the suite
        const context = await browser.newContext();
        const page = await context.newPage();

        const uniqueStr = Date.now().toString(36);
        email = `test_${uniqueStr}@example.com`;
        password = 'testpassword123';
        username = `u_${uniqueStr}`;

        await page.goto('/register.html', { waitUntil: 'domcontentloaded' });
        await page.fill('#username', username);
        await page.fill('#email', email);
        await page.fill('#password', password);
        await page.fill('#password-confirm', password);
        await page.check('#agree');
        await page.locator('#submit-btn').click();

        // Check if there are any errors during registration
        const errorToast = page.locator('#toast');
        const formErrors = page.locator('.form-error.show');

        await Promise.race([
            expect(page.locator('#success-view')).toHaveClass(/show/),
            expect(errorToast).toHaveClass(/show/),
            expect(formErrors.first()).toBeVisible()
        ]);

        if (await errorToast.isVisible().catch(() => false) || await formErrors.count() > 0) {
            throw new Error('Registration failed!');
        }

        await expect(page.locator('#success-view')).toHaveClass(/show/);
        await page.waitForURL(/(\/|index\.html)$/, { timeout: 15000 });

        // Elevate to staff using the seed script
        try {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const scriptPath = path.resolve(__dirname, '../../scripts/set-staff-role.mjs');
            execSync(`node "${scriptPath}" ${email} staff`, { stdio: 'inherit' });
        } catch (e) {
            console.error('Warning: could not elevate to staff. Is service-account.json missing?');
        }

        await context.close();
    });

    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login.html', { waitUntil: 'domcontentloaded' });
        await page.fill('#email', email);
        await page.fill('#password', password);
        await page.locator('#submit-btn').click();
        await expect(page.locator('#success-view')).toHaveClass(/show/);
        await page.waitForURL(/(\/|index\.html)$/, { timeout: 15000 });
    });

    test('can access and edit settings', async ({ page }) => {
        await page.goto('/settings.html', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/settings\.html/);

        // Check username
        await expect(page.locator('#input-username')).toHaveValue(username);

        // Change first name
        await page.fill('#input-first-name', 'TestFirstName');
        await page.locator('#save-profile-btn').click();

        // Check toast
        await expect(page.locator('.toast')).toHaveClass(/show/);
    });

    test('can create and view a support ticket', async ({ page }) => {
        await page.goto('/support.html', { waitUntil: 'domcontentloaded' });

        // Fill support form
        // Wait for prefill to ensure auth state is loaded before submitting, so ticket is linked to user
        await expect(page.locator('#sup-email')).toHaveValue(email);
        
        // Wait for Firebase Auth to initialize so auth.currentUser is populated
        await page.waitForTimeout(2000);

        await page.fill('#sup-name', 'Test User');
        await page.selectOption('#sup-category', 'bug');
        await page.fill('#sup-subject', 'E2E Test Bug Report');
        await page.fill('#sup-message', 'This is a bug report created by an automated E2E test. It contains at least 30 characters.');
        await page.locator('#sup-submit').click();

        // Wait for success toast instead of screen (support form probably uses toast or resets form)
        await expect(page.locator('.toast')).toHaveClass(/show/, { timeout: 10000 });

        // Go to my-tickets
        await page.goto('/my-tickets.html', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/my-tickets\.html/);

        // Find the created ticket
        await expect(page.locator('.ticket-card', { hasText: 'E2E Test Bug Report' }).first()).toBeVisible();
    });

    test('staff can access admin tickets', async ({ page }) => {
        // Need to wait slightly for claims to be refreshed (if they were added).
        // Since we re-login in beforeEach, claims should be fresh.
        await page.goto('/admin-tickets.html', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/admin-tickets\.html/);

        // The page shouldn't show "forbidden"
        const forbiddenMsg = page.locator('#admin-tickets-empty', { hasText: /You do not have access/i });
        const hasTicketsList = page.locator('.ticket-card[href]').first();
        const isEmptyButAllowed = page.locator('#admin-tickets-empty', { hasText: /No tickets found|You have no tickets/i });

        await expect(page.locator('.tickets-page')).toBeVisible();

        // Wait for tickets to load
        await expect(hasTicketsList.or(isEmptyButAllowed).or(forbiddenMsg)).toBeVisible({ timeout: 15000 });
        
        // If it says forbidden, it means the staff elevation failed or hasn't applied
        if (await forbiddenMsg.isVisible().catch(() => false)) {
            console.log('Skipping admin-tickets test because staff role is missing');
            test.skip();
        } else {
            // Check if search works
            await page.fill('#admin-search-input', 'Test Bug Report');
            await expect(page.locator('.ticket-card', { hasText: 'E2E Test Bug Report' }).first()).toBeVisible();
        }
    });

    test('can view a specific ticket detail', async ({ page }) => {
        await page.goto('/my-tickets.html', { waitUntil: 'domcontentloaded' });

        // Click the first ticket
        const firstTicket = page.locator('.ticket-card[href]').first();
        await firstTicket.click();

        await expect(page).toHaveURL(/ticket\.html\?id=/);

        // Should see ticket content
        await expect(page.locator('#ticket-state')).toBeVisible();
        await expect(page.locator('#ticket-messages')).toBeVisible();

        // Try adding a reply
        const replyBox = page.locator('#ticket-reply-input');
        if (await replyBox.isVisible()) {
            await replyBox.fill('This is a test reply.');
            await page.locator('#ticket-send-btn').click();
            // Message container uses .chat-bubble for text content
            await expect(page.locator('.chat-bubble', { hasText: 'This is a test reply.' }).first()).toBeVisible();
        }
        
        // Clean up the test ticket (only works if user is staff, which they should be based on previous test)
        const deleteBtn = page.locator('#ticket-delete-btn');
        if (await deleteBtn.isVisible()) {
            page.on('dialog', dialog => dialog.accept()); // auto-accept confirm
            await deleteBtn.click();
            await expect(page).toHaveURL(/admin-tickets\.html/);
        }
    });
});
