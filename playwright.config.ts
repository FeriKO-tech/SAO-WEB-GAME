import { defineConfig, devices } from '@playwright/test';

const explicitBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();
const baseURL = explicitBaseUrl || 'http://127.0.0.1:4173';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 45_000,
    workers: process.env.CI ? 4 : 2,
    expect: {
        timeout: 10_000,
    },
    webServer: explicitBaseUrl ? undefined : {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    reporter: [['list'], ['html', { open: 'never' }]],
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
