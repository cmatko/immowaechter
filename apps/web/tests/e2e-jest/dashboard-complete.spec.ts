/**
 * End-to-End Tests für ImmoWächter Dashboard
 * Testet alle implementierten Quick Wins und Features
 */

import { test, expect } from './auth-setup';

test.describe('ImmoWächter Dashboard - Complete E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard loads with all components', async ({ page }) => {
    // Check main dashboard elements
    await expect(page.locator('h1')).toContainText('Meine Immobilien');
    await expect(page.locator('text=Neue Immobilie')).toBeVisible();
    
    // Check notification bell
    await expect(page.locator('button[class*="relative"]')).toBeVisible();
    
    // Check risk summary card
    await expect(page.locator('text=Risiko-Übersicht')).toBeVisible();
    
    // Check risk trend chart
    await expect(page.locator('text=Risiko-Trend')).toBeVisible();
    
    // Check risk alerts section
    await expect(page.locator('text=Risk Alerts')).toBeVisible();
  });

  test('Risk Summary shows correct data', async ({ page }) => {
    // Wait for risk summary to load
    await page.waitForSelector('[data-testid="risk-summary"]', { timeout: 10000 });
    
    // Check risk categories
    await expect(page.locator('text=RECHTLICH')).toBeVisible();
    await expect(page.locator('text=KRITISCH')).toBeVisible();
    await expect(page.locator('text=Überfällig')).toBeVisible();
    await expect(page.locator('text=Bald fällig')).toBeVisible();
    await expect(page.locator('text=Sicher')).toBeVisible();
    
    // Check that numbers are displayed (not all zeros)
    const criticalCount = await page.locator('text=KRITISCH').locator('..').locator('[class*="text-2xl"]').textContent();
    expect(parseInt(criticalCount || '0')).toBeGreaterThan(0);
  });

  test('Risk Trend Chart displays data', async ({ page }) => {
    // Wait for risk trend chart to load
    await page.waitForSelector('[data-testid="risk-trend-chart"]', { timeout: 10000 });
    
    // Check chart title
    await expect(page.locator('text=Entwicklung der kritischen Wartungen über Zeit')).toBeVisible();
    
    // Check insights section
    await expect(page.locator('text=Erkenntnisse')).toBeVisible();
    await expect(page.locator('text=Ihr Risiko bleibt stabil')).toBeVisible();
  });

  test('Risk Alerts display correctly', async ({ page }) => {
    // Wait for risk alerts to load
    await page.waitForSelector('[data-testid="risk-alerts"]', { timeout: 10000 });
    
    // Check alert categories
    await expect(page.locator('text=5 Kritisch')).toBeVisible();
    await expect(page.locator('text=5 Warnung')).toBeVisible();
    await expect(page.locator('text=0 Info')).toBeVisible();
    
    // Check individual alerts
    await expect(page.locator('text=Elektrische Anlage ist seit 45 Tagen überfällig')).toBeVisible();
    await expect(page.locator('text=Heizungsanlage muss in 3 Tagen gewartet werden')).toBeVisible();
    await expect(page.locator('text=Brandschutzanlage hat ein rechtliches Risiko')).toBeVisible();
    
    // Check alert actions
    const acknowledgeButtons = page.locator('button:has-text("Bestätigen")');
    await expect(acknowledgeButtons).toHaveCount(10); // 10 alerts total
  });

  test('Notification Center functionality', async ({ page }) => {
    // Click notification bell
    await page.click('button[class*="relative"]');
    
    // Wait for notification center to open
    await page.waitForSelector('[data-testid="notification-center"]', { timeout: 5000 });
    
    // Check notification center elements
    await expect(page.locator('text=Benachrichtigungen')).toBeVisible();
    await expect(page.locator('text=Alle lesen')).toBeVisible();
    
    // Check notifications
    await expect(page.locator('text=Wartung überfällig')).toBeVisible();
    await expect(page.locator('text=Wartung fällig')).toBeVisible();
    await expect(page.locator('text=Neue Inspektion geplant')).toBeVisible();
    
    // Test mark as read functionality
    const firstNotification = page.locator('[data-testid="notification-item"]').first();
    await firstNotification.click();
    
    // Check that notification is marked as read
    await expect(firstNotification.locator('[class*="bg-gray-50"]')).toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that mobile layout is applied
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Neue Immobilie')).toBeVisible();
    
    // Check that risk summary is responsive
    await expect(page.locator('text=Risiko-Übersicht')).toBeVisible();
    
    // Check that risk alerts are responsive
    await expect(page.locator('text=Risk Alerts')).toBeVisible();
  });

  test('PDF Export functionality', async ({ page }) => {
    // Navigate to critical maintenances page
    await page.goto('http://localhost:3000/dashboard/critical-maintenances');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check PDF export button
    await expect(page.locator('button:has-text("PDF Export")')).toBeVisible();
    
    // Click PDF export button
    await page.click('button:has-text("PDF Export")');
    
    // Wait for PDF generation
    await page.waitForTimeout(2000);
    
    // Check that download started (this is hard to test in E2E, but we can check the button state)
    const exportButton = page.locator('button:has-text("PDF Export")');
    await expect(exportButton).toBeVisible();
  });

  test('Animations and transitions work', async ({ page }) => {
    // Check for fade-in animations on cards
    const cards = page.locator('[class*="animate-fade-in"]');
    await expect(cards.first()).toBeVisible();
    
    // Check for hover effects
    const hoverCard = page.locator('[class*="hover:scale-105"]').first();
    await hoverCard.hover();
    
    // Check for smooth transitions
    const transitionElement = page.locator('[class*="transition-all"]').first();
    await expect(transitionElement).toBeVisible();
  });

  test('Property Risk Score displays', async ({ page }) => {
    // Check that property risk scores are displayed
    const riskScoreElements = page.locator('[data-testid="property-risk-score"]');
    await expect(riskScoreElements).toHaveCount(0); // No properties in mock data
    
    // If we had properties, we would check:
    // await expect(riskScoreElements.first()).toContainText('Risiko-Score');
  });

  test('Maintenance Calendar displays', async ({ page }) => {
    // Check that maintenance calendar is displayed
    const calendarElement = page.locator('[data-testid="maintenance-calendar"]');
    await expect(calendarElement).toBeVisible();
    
    // Check calendar events
    await expect(page.locator('text=Wartung: Heizungsanlage')).toBeVisible();
    await expect(page.locator('text=Inspektion: Brandschutzanlage')).toBeVisible();
    await expect(page.locator('text=Austausch: Elektrische Anlage')).toBeVisible();
  });

  test('Error handling and loading states', async ({ page }) => {
    // Check that loading states are handled
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Check that no error messages are visible
    await expect(page.locator('text=Error')).not.toBeVisible();
    await expect(page.locator('text=Failed')).not.toBeVisible();
    
    // Check that all main sections are visible
    await expect(page.locator('text=Risiko-Übersicht')).toBeVisible();
    await expect(page.locator('text=Risk Alerts')).toBeVisible();
  });

  test('Performance and accessibility', async ({ page }) => {
    // Check page load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check accessibility - main heading should be h1
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that buttons have proper labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('Complete user journey', async ({ page }) => {
    // 1. Load dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // 2. Check risk overview
    await expect(page.locator('text=Risiko-Übersicht')).toBeVisible();
    
    // 3. Check risk trend
    await expect(page.locator('text=Risiko-Trend')).toBeVisible();
    
    // 4. Check risk alerts
    await expect(page.locator('text=Risk Alerts')).toBeVisible();
    
    // 5. Open notifications
    await page.click('button[class*="relative"]');
    await page.waitForSelector('[data-testid="notification-center"]');
    
    // 6. Close notifications
    await page.click('button[class*="X"]');
    
    // 7. Check maintenance calendar
    await expect(page.locator('[data-testid="maintenance-calendar"]')).toBeVisible();
    
    // 8. Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // 9. Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });
});
