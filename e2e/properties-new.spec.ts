import { test, expect } from '@playwright/test';

test.describe('/properties/new', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('/properties/new');
    
    // Warte auf Netzwerk-Idle
    await page.waitForLoadState('networkidle');
    
    // Prüfe dass Seite geladen wurde
    await expect(page).not.toHaveTitle(/Error|404/i);
  });

  test('should have valid HTML structure', async ({ page }) => {
    await page.goto('/properties/new');
    
    // Prüfe grundlegende HTML-Elemente
    const html = await page.locator('html').first();
    await expect(html).toBeVisible();
  });
});
