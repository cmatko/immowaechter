import { test, expect, Page } from '@playwright/test';

test.describe('/datenschutz Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/datenschutz');
    await expect(page).toHaveURL('/datenschutz');
  });
});
