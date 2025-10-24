import { test, expect, Page } from '@playwright/test';

test.describe('/dashboard Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to /properties/new', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.click('a[href="/properties/new"]');
    await expect(page).toHaveURL('/properties/new');
  });
});
