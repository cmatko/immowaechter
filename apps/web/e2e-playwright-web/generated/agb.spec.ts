import { test, expect, Page } from '@playwright/test';

test.describe('/agb Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/agb');
    await expect(page).toHaveURL('/agb');
  });

  test('should navigate to /datenschutz', async ({ page }) => {
    await page.goto('/agb');
    
    await page.click('a[href="/datenschutz"]');
    await expect(page).toHaveURL('/datenschutz');
  });
});
