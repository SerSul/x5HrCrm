import { test, expect } from '@playwright/test';

test.describe('Application Flow', () => {
  test('candidate can apply to direction with resume URL', async ({ page }) => {
    await page.goto('/candidate/directions/1');

    // Check if already applied
    const alreadyApplied = await page
      .getByText(/вы уже откликнулись/i)
      .isVisible()
      .catch(() => false);

    if (!alreadyApplied) {
      // Fill resume URL
      await page.getByPlaceholder(/ссылка на резюме/i).fill('https://example.com/resume.pdf');

      // Add comment
      await page.getByPlaceholder(/комментарий/i).fill('Interested in this position');

      // Click apply button
      await page.getByRole('button', { name: /откликнуться/i }).click();

      // Wait for application to process
      await page.waitForTimeout(2000);
    }

    // Verify final state - should show "already applied" message
    await expect(page.getByText(/вы уже откликнулись/i)).toBeVisible();

    // Timeline should appear - look for the header specifically
    await expect(page.getByText(/статус заявки/i)).toBeVisible();
  });

  test('apply button is disabled without resume URL', async ({ page }) => {
    await page.goto('/candidate/directions/2');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check if not already applied
    const alreadyApplied = await page
      .getByText(/вы уже откликнулись/i)
      .isVisible()
      .catch(() => false);

    if (!alreadyApplied) {
      const applyButton = page.getByRole('button', { name: /откликнуться/i });

      // Button should be disabled without resume
      await expect(applyButton).toBeDisabled();

      // Fill resume, button should enable
      await page.getByPlaceholder(/ссылка на резюме/i).fill('https://example.com/resume.pdf');
      await expect(applyButton).toBeEnabled();
    }
  });
});
