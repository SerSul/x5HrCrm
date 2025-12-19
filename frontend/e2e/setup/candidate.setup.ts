import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/candidate.json';

setup('authenticate as candidate', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:5173/login');

  // Fill login form with seed data user
  await page.getByPlaceholder('Email').fill('user@example.com');
  await page.getByPlaceholder(/пароль/i).fill('password');

  // Click login button
  await page.getByRole('button', { name: /вход/i }).click();

  // Wait for redirect to candidate home
  await page.waitForURL('http://localhost:5173/candidate');

  // Verify successful login - check for directions heading
  await expect(page.getByText(/направления/i)).toBeVisible();

  // Save signed-in state to file
  await page.context().storageState({ path: authFile });
});
