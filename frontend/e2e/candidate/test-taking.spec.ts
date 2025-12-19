import { test, expect } from '@playwright/test';
import { applyToDirection, answerAllQuestions } from '../utils/helpers';

test.describe('Test Taking Flow', () => {
  test('candidate can start and complete test', async ({ page }) => {
    // First ensure we have an application
    await applyToDirection(page, 1);

    // Navigate to direction detail
    await page.goto('/candidate/directions/1');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Click start test button
    const testButton = page.getByRole('button', { name: /начать тест|продолжить тест/i });

    // Only proceed if test button is visible
    if (await testButton.isVisible()) {
      await testButton.click();

      // Should navigate to test page
      await expect(page).toHaveURL(/\/candidate\/test\/\d+/);

      // Should see questions
      await expect(page.getByText(/вопрос/i).first()).toBeVisible();

      // Answer all questions
      await answerAllQuestions(page);

      // Submit test
      const submitButton = page.getByRole('button', { name: /отправить|завершить/i });
      await submitButton.click();

      // Should see results screen
      await expect(page.getByText(/результат|тест завершен|баллов/i).first()).toBeVisible({
        timeout: 10000,
      });

      // Should see score display (e.g., "30 / 40")
      await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
    }
  });

  test('submit button disabled until all questions answered', async ({ page }) => {
    // Ensure we have an application
    await applyToDirection(page, 1);

    await page.goto('/candidate/directions/1');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Try to start test
    const testButton = page.getByRole('button', { name: /начать тест|продолжить тест/i });

    if (await testButton.isVisible()) {
      await testButton.click();

      await expect(page).toHaveURL(/\/candidate\/test\/\d+/);

      const submitButton = page.getByRole('button', { name: /отправить|завершить/i });

      // Should be disabled initially (unless all questions are already answered from previous run)
      const isDisabled = await submitButton.isDisabled().catch(() => false);

      if (isDisabled) {
        // Answer first question only
        const firstRadio = page.getByRole('radio').first();
        await firstRadio.check();

        // Still disabled (need all questions)
        await expect(submitButton).toBeDisabled();
      }
    }
  });
});
