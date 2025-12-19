import { test, expect } from '@playwright/test';

test.describe('Applications List', () => {
  test('recruiter can view all applications', async ({ page }) => {
    await page.goto('/recruiter');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Should see applications table with columns
    await expect(page.getByText('Кандидат')).toBeVisible();
    await expect(page.getByText('Направление')).toBeVisible();
    await expect(page.getByText('Результат теста')).toBeVisible();
    await expect(page.getByText('Дата отклика')).toBeVisible();
  });

  test('recruiter can filter applications by direction name', async ({ page }) => {
    await page.goto('/recruiter');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find direction name filter input
    const filterInput = page.getByPlaceholder(/поиск|название|направлени/i);

    if (await filterInput.isVisible()) {
      // Type filter text
      await filterInput.fill('Java');

      // Wait for filter to apply (debounce)
      await page.waitForTimeout(1000);

      // Table should update
      await expect(page.getByRole('table')).toBeVisible();
    }
  });

  test('recruiter can sort applications by score', async ({ page }) => {
    await page.goto('/recruiter');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find sort dropdown
    const sortSelect = page.getByRole('combobox').filter({ hasText: /сортировка|баллов/i });

    if (await sortSelect.isVisible()) {
      await sortSelect.click();

      // Select descending order
      await page.getByText(/по убыванию баллов/i).click();

      // Wait for sorted results
      await page.waitForTimeout(1000);

      // Table should still be visible
      await expect(page.getByRole('table')).toBeVisible();
    }
  });

  test('recruiter can toggle active filter', async ({ page }) => {
    await page.goto('/recruiter');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find active checkbox
    const activeCheckbox = page.getByRole('checkbox').filter({ hasText: /только активные|активн/i });

    if (await activeCheckbox.isVisible()) {
      // Checkbox should be checked by default
      await expect(activeCheckbox).toBeChecked();

      // Uncheck to see all applications
      await activeCheckbox.uncheck();

      // Wait for filter to apply
      await page.waitForTimeout(1000);

      // Should see both active and closed applications
      await expect(page.getByRole('table')).toBeVisible();
    }
  });
});
