import { test, expect } from '@playwright/test';
import { applyToDirection } from '../utils/helpers';

test.describe('View Applications', () => {
  test('candidate can view all their applications', async ({ page }) => {
    // Ensure we have at least one application
    await applyToDirection(page, 1);

    // Navigate to applications page
    await page.goto('/candidate/applications');

    // Wait for API to load applications
    await page.waitForTimeout(2000);

    // Should see page title
    await expect(page.getByText(/мои отклики|заявки/i).first()).toBeVisible();

    // Should see at least one application card
    await expect(page.getByText(/Junior Java Developer|Middle Java Developer|DevOps|QA/i).first()).toBeVisible();

    // Should see status badge
    await expect(page.getByText(/новый отклик|тестирование|собеседование/i).first()).toBeVisible();

    // Find and click "Подробнее" button if it exists
    const detailButton = page.getByRole('button', { name: /подробнее|детали/i }).first();

    if (await detailButton.isVisible()) {
      await detailButton.click();

      // Should navigate to direction detail
      await expect(page).toHaveURL(/\/candidate\/directions\/\d+/);
      await expect(page.getByText(/вы уже откликнулись/i)).toBeVisible();
    } else {
      // Or click on the card itself
      await page.getByText(/Junior Java Developer/i).first().click();

      // Should navigate to direction detail
      await expect(page).toHaveURL(/\/candidate\/directions\/\d+/);
    }
  });
});
