import { test, expect, Page } from '@playwright/test';

test.describe('/impressum Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/impressum');
    await expect(page).toHaveURL('/impressum');
  });
});
