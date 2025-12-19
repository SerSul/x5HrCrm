import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/recruiter.json';

setup('authenticate as recruiter', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:5174/login');

  // Fill login form with HR user from seed data
  await page.getByPlaceholder('Email').fill('hr@example.com');
  await page.getByPlaceholder(/пароль/i).fill('password');

  // Click login button
  await page.getByRole('button', { name: /вход/i }).click();

  // Wait for redirect to recruiter home
  await page.waitForURL('http://localhost:5174/recruiter');

  // Verify successful login
  await expect(page.getByText(/заявки|кандидат/i)).toBeVisible();

  // Save signed-in state to file
  await page.context().storageState({ path: authFile });
});
