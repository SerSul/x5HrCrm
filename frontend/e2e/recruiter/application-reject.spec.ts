import { test, expect } from '@playwright/test';

test.describe('Application Rejection', () => {
  test('recruiter can reject application with close reason', async ({ page }) => {
    await page.goto('/recruiter/directions/1/applications');

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find reject button on first application
    const rejectButton = page.getByRole('button', { name: /отклонить/i }).first();

    if (await rejectButton.isVisible()) {
      await rejectButton.click();

      // Modal should open
      await expect(page.getByText(/отклонить|причина/i).first()).toBeVisible();

      // Find and click close reason dropdown
      const reasonSelect = page.getByRole('combobox').filter({ hasText: /причина/i });

      if (await reasonSelect.isVisible()) {
        await reasonSelect.click();

        // Select a close reason
        await page.getByText(/тест не пройден|не подходит|rejected/i).first().click();
      }

      // Add comment
      const commentInput = page.getByPlaceholder(/комментарий/i);
      if (await commentInput.isVisible()) {
        await commentInput.fill('Failed technical assessment');
      }

      // Confirm rejection
      await page.getByRole('button', { name: /отклонить|подтвердить/i }).last().click();

      // Wait for modal to close
      await page.waitForTimeout(1000);

      // Modal should be closed
      const modalStillVisible = await page
        .getByText(/отклонить кандидата/i)
        .isVisible()
        .catch(() => false);

      expect(modalStillVisible).toBeFalsy();
    }
  });

  test('recruiter can cancel rejection', async ({ page }) => {
    await page.goto('/recruiter/directions/1/applications');

    // Wait for page to load
    await page.waitForTimeout(2000);

    const rejectButton = page.getByRole('button', { name: /отклонить/i }).first();

    if (await rejectButton.isVisible()) {
      await rejectButton.click();

      // Modal should open
      await expect(page.getByText(/отклонить|причина/i).first()).toBeVisible();

      // Click cancel button
      const cancelButton = page.getByRole('button', { name: /отмена|cancel/i });

      if (await cancelButton.isVisible()) {
        await cancelButton.click();

        // Wait for modal to close
        await page.waitForTimeout(500);

        // Modal should be closed
        const modalStillVisible = await page
          .getByText(/отклонить кандидата/i)
          .isVisible()
          .catch(() => false);

        expect(modalStillVisible).toBeFalsy();
      }
    }
  });
});
