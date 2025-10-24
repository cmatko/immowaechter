import { test, expect } from '@playwright/test';

test.describe('/admin', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('/admin');
    
    // Warte auf Netzwerk-Idle
    await page.waitForLoadState('networkidle');
    
    // Prüfe dass Seite geladen wurde
    await expect(page).not.toHaveTitle(/Error|404/i);
  });

  test('should have valid HTML structure', async ({ page }) => {
    await page.goto('/admin');
    
    // Prüfe grundlegende HTML-Elemente
    const html = await page.locator('html').first();
    await expect(html).toBeVisible();
  });
});
