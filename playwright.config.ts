import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html']] : [['list']],
  use: {
    // Dedicated E2E port: never 3000, which often hosts an unrelated dev
    // server that Playwright would otherwise silently reuse and test.
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run start -- --port 3100',
        url: 'http://localhost:3100',
        // Never reuse: a foreign server on this port would make every
        // test hit the wrong app instead of failing fast.
        reuseExistingServer: false,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
        // Auth.js builds redirect hosts from AUTH_URL; point it at the
        // E2E server so /login redirects stay same-origin.
        env: { AUTH_URL: 'http://localhost:3100' },
      },
});
