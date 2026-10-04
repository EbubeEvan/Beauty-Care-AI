import { expect, test } from '@playwright/test';

test.describe('credits', () => {
  test('buy-credits requires login', async ({ page }) => {
    await page.goto('/buy-credits');
    await expect(page).toHaveURL(/\/login/);
  });

  test('credits API requires an email', async ({ request }) => {
    const res = await request.get('/api/credits');
    expect(res.status()).toBe(400);
  });
});
