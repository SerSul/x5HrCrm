import { test, expect } from '@playwright/test';

test.describe('Candidate Authentication', () => {
  test('candidate can login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Email').fill('user@example.com');
    await page.getByPlaceholder(/пароль/i).fill('password');
    await page.getByRole('button', { name: /вход/i }).click();

    // Should redirect to candidate home
    await expect(page).toHaveURL(/\/candidate/);
    await expect(page.getByText(/направления/i)).toBeVisible();
  });

  test('new user can register as candidate', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto('/register');

    // Fill registration form
    await page.getByPlaceholder('Email').fill(uniqueEmail);
    await page.getByPlaceholder('Имя', { exact: false }).fill('Test User');
    await page.getByPlaceholder('Телефон', { exact: false }).fill('+79991234567');
    await page.getByPlaceholder(/^пароль$/i).fill('password123');
    await page.getByPlaceholder(/подтвердите пароль/i).fill('password123');

    await page.getByRole('button', { name: /регистрация/i }).click();

    // Should redirect to candidate home after successful registration
    await expect(page).toHaveURL(/\/candidate/, { timeout: 10000 });
  });

  test('candidate can logout', async ({ page }) => {
    await page.goto('/candidate');

    // Wait for page to fully load and user session to be restored
    await page.waitForTimeout(2000);

    // Find and click logout button
    await page.getByRole('button', { name: /выход|выйти/i }).click();

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });
});
