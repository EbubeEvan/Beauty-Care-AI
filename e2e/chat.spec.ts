import { expect, test } from '@playwright/test';

test.describe('chat', () => {
  test.beforeEach(async ({ page }) => {
    // Never hit Gemini in E2E: stub the streaming endpoint.
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'mocked-stream',
      });
    });
  });

  test('protected chat page redirects without a session', async ({ page }) => {
    await page.goto('/chat');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unknown chat id stays reachable (loading or redirect)', async ({ page }) => {
    await page.goto('/chat/does-not-exist');
    await expect(page).toHaveURL(/\/chat|login/);
  });
});
