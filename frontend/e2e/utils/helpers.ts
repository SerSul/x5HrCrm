import type { Page } from '@playwright/test';

/**
 * Login helper for quick authentication in tests
 */
export async function login(
  page: Page,
  email: string,
  password: string,
  baseUrl: string
) {
  await page.goto(`${baseUrl}/login`);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder(/пароль/i).fill(password);
  await page.getByRole('button', { name: /вход/i }).click();
  await page.waitForURL(new RegExp(`${baseUrl}/(candidate|recruiter)`));
}

/**
 * Apply to direction helper with idempotency check
 */
export async function applyToDirection(
  page: Page,
  directionId: number,
  resumeUrl: string = 'https://example.com/resume.pdf',
  comment?: string
) {
  await page.goto(`/candidate/directions/${directionId}`);

  // Check if already applied
  const alreadyApplied = await page
    .getByText(/вы уже откликнулись/i)
    .isVisible()
    .catch(() => false);

  if (!alreadyApplied) {
    // Fill resume URL
    await page.getByPlaceholder(/ссылка на резюме/i).fill(resumeUrl);

    // Fill comment if provided
    if (comment) {
      await page.getByPlaceholder(/комментарий/i).fill(comment);
    }

    // Click apply button
    await page.getByRole('button', { name: /откликнуться/i }).click();

    // Wait for application to process
    await page.waitForTimeout(1000);
  }
}

/**
 * Start test helper
 */
export async function startTest(page: Page, directionId: number) {
  await page.goto(`/candidate/directions/${directionId}`);
  await page.getByRole('button', { name: /начать тест|продолжить тест/i }).click();
  await page.waitForURL(/\/candidate\/test\/\d+/);
}

/**
 * Answer all test questions helper
 * Selects the first radio option for each question
 */
export async function answerAllQuestions(page: Page) {
  // Get all radio groups (one per question)
  const radioGroups = page.getByRole('group');
  const count = await radioGroups.count();

  for (let i = 0; i < count; i++) {
    const radioGroup = radioGroups.nth(i);
    const firstOption = radioGroup.getByRole('radio').first();
    await firstOption.check();
  }
}

/**
 * Wait for API response helper
 */
export async function waitForApiResponse(page: Page, urlPattern: string) {
  return await page.waitForResponse(
    (resp) => resp.url().includes(urlPattern) && resp.status() === 200
  );
}

/**
 * Format date for comparison
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
