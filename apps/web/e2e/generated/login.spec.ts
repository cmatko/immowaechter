import { test, expect, Page } from '@playwright/test';

test.describe('/login Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
  });

  test('should have all required inputs', async ({ page }) => {
    await page.goto('/login');
    
    // Check all inputs exist
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('/login');
    
    // Fill inputs
    await page.fill('input#email', 'test@example.com');
    await page.fill('input#password', 'TestPassword123');
    
    // Submit form
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    // TODO: Add assertions for success/error
  });

  test('should navigate to /register', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to /', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});
