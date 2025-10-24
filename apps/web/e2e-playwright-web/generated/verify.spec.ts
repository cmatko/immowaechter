import { test, expect, Page } from '@playwright/test';

test.describe('/verify Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/verify');
    await expect(page).toHaveURL('/verify');
  });

  test('should navigate to /', async ({ page }) => {
    await page.goto('/verify');
    
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});
