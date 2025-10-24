/**
 * End-to-End Tests für Critical Maintenances Seite
 * Testet die kritischen Wartungen Seite mit PDF Export und Filtern
 */

import { test, expect } from './auth-setup';

test.describe('Critical Maintenances Page - E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to critical maintenances page
    await page.goto('http://localhost:3000/dashboard/critical-maintenances');
    await page.waitForLoadState('networkidle');
    
    // Wait for page to load completely
    await page.waitForTimeout(2000);
    
    // Check if we're on the right page
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/dashboard/critical-maintenances')) {
      console.log('✅ On critical maintenances page');
    } else {
      console.log('❌ Redirected to:', currentUrl);
    }
  });

  test('Critical Maintenances page loads correctly', async ({ page }) => {
    // Check page title and header - use more specific selector
    await expect(page.locator('h1').last()).toContainText('Kritische Wartungen');
    await expect(page.locator('text=Wartungen mit hohem Risiko - sofortiges Handeln erforderlich')).toBeVisible();
    
    // Check back to dashboard link
    await expect(page.locator('text=Zurück zum Dashboard')).toBeVisible();
    
    // Check PDF export button
    await expect(page.locator('button:has-text("PDF Export")')).toBeVisible();
    
    // Check filter section
    await expect(page.locator('text=Risk Level')).toBeVisible();
    await expect(page.locator('text=Immobilie')).toBeVisible();
    await expect(page.locator('text=Komponente')).toBeVisible();
    await expect(page.locator('text=Sortierung')).toBeVisible();
  });

  test('Critical maintenances data displays correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check that critical maintenances are displayed
    await expect(page.locator('text=Elektrische Anlage')).toBeVisible();
    await expect(page.locator('text=Brandschutzanlage')).toBeVisible();
    await expect(page.locator('text=Aufzug')).toBeVisible();
    await expect(page.locator('text=Gasleitung')).toBeVisible();
    await expect(page.locator('text=Solaranlage')).toBeVisible();
    
    // Check property names
    await expect(page.locator('text=Wohnung Wien-Innere Stadt')).toBeVisible();
    await expect(page.locator('text=Bürogebäude Graz')).toBeVisible();
    await expect(page.locator('text=Loft Wien-Leopoldstadt')).toBeVisible();
    await expect(page.locator('text=Villa Vorarlberg')).toBeVisible();
    
    // Check risk levels
    await expect(page.locator('text=KRITISCH')).toBeVisible();
    
    // Check days overdue
    await expect(page.locator('text=45 Tage überfällig')).toBeVisible();
    await expect(page.locator('text=15 Tage überfällig')).toBeVisible();
    await expect(page.locator('text=30 Tage überfällig')).toBeVisible();
  });

  test('Filter functionality works', async ({ page }) => {
    // Test Risk Level filter
    const riskLevelFilter = page.locator('select').first();
    await expect(riskLevelFilter).toBeVisible();
    await riskLevelFilter.selectOption({ label: 'Alle anzeigen' });
    
    // Test Property filter
    const propertyFilter = page.locator('select').nth(1);
    await expect(propertyFilter).toBeVisible();
    await propertyFilter.selectOption({ label: 'Alle Immobilien' });
    
    // Test Component filter
    const componentFilter = page.locator('select').nth(2);
    await expect(componentFilter).toBeVisible();
    await componentFilter.selectOption({ label: 'Alle Komponenten' });
    
    // Test Sort filter
    const sortFilter = page.locator('select').nth(3);
    await expect(sortFilter).toBeVisible();
    await sortFilter.selectOption({ label: 'Tage überfällig' });
    
    // Test sort direction button
    const sortButton = page.locator('button:has-text("Absteigend")');
    await expect(sortButton).toBeVisible();
    await sortButton.click();
  });

  test('PDF Export functionality', async ({ page }) => {
    // Check PDF export button is visible
    const exportButton = page.locator('button:has-text("PDF Export")');
    await expect(exportButton).toBeVisible();
    await expect(exportButton).not.toBeDisabled();
    
    // Set up download promise
    const downloadPromise = page.waitForEvent('download');
    
    // Click PDF export button
    await exportButton.click();
    
    // Wait for download
    const download = await downloadPromise;
    
    // Check download properties
    expect(download.suggestedFilename()).toMatch(/critical-maintenances.*\.pdf/);
  });

  test('Back to Dashboard navigation', async ({ page }) => {
    // Click back to dashboard link
    await page.click('text=Zurück zum Dashboard');
    
    // Check that we're on the dashboard
    await page.waitForURL('http://localhost:3000/dashboard');
    await expect(page.locator('h1').last()).toContainText('Meine Immobilien');
  });

  test('Critical maintenance cards display correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(3000);
    
    // Check that maintenance cards are displayed - look for actual HTML structure
    const maintenanceCards = page.locator('.bg-white.rounded-lg.shadow-md');
    await expect(maintenanceCards).toHaveCount(5); // 5 critical maintenances
    
    // Check first card content
    const firstCard = maintenanceCards.first();
    await expect(firstCard.locator('text=Elektrische Anlage')).toBeVisible();
    await expect(firstCard.locator('text=Wohnung Wien-Innere Stadt')).toBeVisible();
    await expect(firstCard.locator('text=45 Tage überfällig')).toBeVisible();
    await expect(firstCard.locator('text=KRITISCH')).toBeVisible();
  });

  test('Risk level indicators work', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check that risk level indicators are displayed
    const riskIndicators = page.locator('[class*="bg-red-"]');
    await expect(riskIndicators).toHaveCount(5); // 5 critical items
    
    // Check that critical badges are displayed
    const criticalBadges = page.locator('text=KRITISCH');
    await expect(criticalBadges).toHaveCount(5);
  });

  test('Days overdue calculation is correct', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check specific overdue days
    await expect(page.locator('text=45 Tage überfällig')).toBeVisible();
    await expect(page.locator('text=15 Tage überfällig')).toBeVisible();
    await expect(page.locator('text=30 Tage überfällig')).toBeVisible();
    
    // Check that some items are not overdue (0 days)
    await expect(page.locator('text=0 Tage überfällig')).toBeVisible();
  });

  test('Component types are displayed correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check component types
    await expect(page.locator('text=Elektrische Anlage')).toBeVisible();
    await expect(page.locator('text=Brandschutzanlage')).toBeVisible();
    await expect(page.locator('text=Aufzug')).toBeVisible();
    await expect(page.locator('text=Gasleitung')).toBeVisible();
    await expect(page.locator('text=Solaranlage')).toBeVisible();
  });

  test('Property addresses are displayed', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check property addresses
    await expect(page.locator('text=Stephansplatz 1, 1010 Wien')).toBeVisible();
    await expect(page.locator('text=Hauptplatz 12, 8010 Graz')).toBeVisible();
    await expect(page.locator('text=Praterstraße 45, 1020 Wien')).toBeVisible();
    await expect(page.locator('text=Bergstraße 22, 6900 Bregenz')).toBeVisible();
  });

  test('Sorting functionality works', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Test sorting by days overdue
    const sortFilter = page.locator('select').nth(3);
    await sortFilter.selectOption({ label: 'Tage überfällig' });
    
    // Test sort direction
    const sortButton = page.locator('button:has-text("Absteigend")');
    await sortButton.click();
    
    // Check that items are sorted (highest overdue first)
    const maintenanceCards = page.locator('[data-testid="maintenance-card"]');
    const firstCard = maintenanceCards.first();
    await expect(firstCard.locator('text=45 Tage überfällig')).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that page is responsive
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("PDF Export")')).toBeVisible();
    
    // Check that filters are still accessible
    await expect(page.locator('text=Risk Level')).toBeVisible();
    await expect(page.locator('text=Immobilie')).toBeVisible();
    
    // Check that maintenance cards are responsive
    await page.waitForTimeout(2000);
    const maintenanceCards = page.locator('[data-testid="maintenance-card"]');
    await expect(maintenanceCards.first()).toBeVisible();
  });

  test('Loading states work correctly', async ({ page }) => {
    // Check that loading indicators are shown initially
    await expect(page.locator('text=0 von 0 Wartungen')).toBeVisible();
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check that data is loaded
    await expect(page.locator('text=Elektrische Anlage')).toBeVisible();
  });

  test('Error handling works', async ({ page }) => {
    // Check that no error messages are displayed
    await expect(page.locator('text=Error')).not.toBeVisible();
    await expect(page.locator('text=Failed')).not.toBeVisible();
    
    // Check that page loads without errors
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Accessibility features work', async ({ page }) => {
    // Check that main heading is h1
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that buttons have proper labels
    const exportButton = page.locator('button:has-text("PDF Export")');
    await expect(exportButton).toBeVisible();
    
    // Check that form elements are accessible
    const filters = page.locator('select');
    await expect(filters).toHaveCount(4); // 4 filter dropdowns
  });

  test('Performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000/dashboard/critical-maintenances');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Complete user journey', async ({ page }) => {
    // 1. Load critical maintenances page
    await page.goto('http://localhost:3000/dashboard/critical-maintenances');
    await page.waitForLoadState('networkidle');
    
    // 2. Check page loads correctly
    await expect(page.locator('h1')).toContainText('Kritische Wartungen');
    
    // 3. Wait for data to load
    await page.waitForTimeout(2000);
    
    // 4. Check data is displayed
    await expect(page.locator('text=Elektrische Anlage')).toBeVisible();
    
    // 5. Test filters
    const riskLevelFilter = page.locator('select').first();
    await riskLevelFilter.selectOption({ label: 'Alle anzeigen' });
    
    // 6. Test PDF export
    const exportButton = page.locator('button:has-text("PDF Export")');
    await expect(exportButton).toBeVisible();
    
    // 7. Navigate back to dashboard
    await page.click('text=Zurück zum Dashboard');
    await page.waitForURL('http://localhost:3000/dashboard');
    
    // 8. Check we're on dashboard
    await expect(page.locator('h1')).toContainText('Meine Immobilien');
  });
});
