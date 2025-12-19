import { test, expect } from '@playwright/test';

test.describe('Direction Browsing', () => {
  test('candidate can view all directions', async ({ page }) => {
    await page.goto('/candidate');

    // Wait for API to load directions
    await page.waitForTimeout(2000);

    // Wait for directions to load
    await expect(page.getByText('Junior Java Developer')).toBeVisible();
    await expect(page.getByText('Middle Java Developer')).toBeVisible();
    await expect(page.getByText('DevOps Engineer')).toBeVisible();
    await expect(page.getByText('QA Automation Engineer')).toBeVisible();
  });

  test('candidate can filter to see only applied directions', async ({ page }) => {
    await page.goto('/candidate');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find and toggle filter checkbox
    const filterCheckbox = page.getByRole('checkbox').filter({ hasText: /только|мои|отклики/i });

    if (await filterCheckbox.isVisible()) {
      await filterCheckbox.check();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Should show filtered results or empty state
      const hasContent = await page.getByText(/направления|нет откликов/i).isVisible();
      expect(hasContent).toBeTruthy();
    }
  });

  test('candidate can view direction details', async ({ page }) => {
    await page.goto('/candidate');

    // Wait for API to load directions
    await page.waitForTimeout(2000);

    // Wait for directions to load
    await expect(page.getByText('Junior Java Developer')).toBeVisible();

    // Click on a direction card
    await page.getByText('Junior Java Developer').click();

    // Should navigate to direction detail page
    await expect(page).toHaveURL(/\/candidate\/directions\/1/);

    // Should see direction details
    await expect(page.getByText('80000')).toBeVisible(); // Salary
    await expect(page.getByText(/полная занятость|full.time/i)).toBeVisible();
  });
});
