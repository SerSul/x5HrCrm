import { test, expect } from '@playwright/test';

test.describe('Recruiter Authentication', () => {
  test('recruiter can login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Email').fill('hr@example.com');
    await page.getByPlaceholder(/пароль/i).fill('password');
    await page.getByRole('button', { name: /вход/i }).click();

    // Should redirect to recruiter home
    await expect(page).toHaveURL(/\/recruiter/);
    await expect(page.getByText(/заявки|кандидат|направлен/i).first()).toBeVisible();
  });
});
