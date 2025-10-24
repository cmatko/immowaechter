import { test, expect, Page } from '@playwright/test';

test.describe('/register Page', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL('/register');
  });

  test('should have all required inputs', async ({ page }) => {
    await page.goto('/register');
    
    // Check all inputs exist
    await expect(page.locator('input#firstName')).toBeVisible();
    await expect(page.locator('input#lastName')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('/register');
    
    // Fill inputs
    await page.fill('input#firstName', 'test value');
    await page.fill('input#lastName', 'test value');
    await page.fill('input#email', 'test@example.com');
    await page.fill('input#password', 'TestPassword123');
    await page.fill('input#confirmPassword', 'test value');
    await page.fill('input[name="firstName"]', 'test value');
    await page.fill('input[name="lastName"]', 'test value');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123');
    await page.fill('input[name="confirmPassword"]', 'test value');
    
    // Submit form
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    // TODO: Add assertions for success/error
  });

  test('should navigate to /login', async ({ page }) => {
    await page.goto('/register');
    
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
  });

  test('should navigate to /agb', async ({ page }) => {
    await page.goto('/register');
    
    await page.click('a[href="/agb"]');
    await expect(page).toHaveURL('/agb');
  });

  test('should navigate to /datenschutz', async ({ page }) => {
    await page.goto('/register');
    
    await page.click('a[href="/datenschutz"]');
    await expect(page).toHaveURL('/datenschutz');
  });
});
