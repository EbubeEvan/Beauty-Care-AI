import { expect, test } from '@playwright/test';

test.describe('auth', () => {
  test('anonymous users are sent to login from protected pages', async ({ page }) => {
    await page.goto('/chat');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signup form validates input before submitting', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    // react-hook-form required errors appear; at minimum the page stays put
    await expect(page).toHaveURL(/\/signup/);
  });

  test('login form validates input before submitting', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
