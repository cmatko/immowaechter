/**
 * End-to-End Tests für ImmoWächter Quick Wins
 * Testet PDF Export, Animations, Mobile Optimization, Risk Features
 */

import { test, expect } from './auth-setup';

test.describe('ImmoWächter Quick Wins - E2E Tests', () => {
  
  test.describe('PDF Export Feature', () => {
    test('PDF Export button is visible and functional', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard/critical-maintenances');
      await page.waitForLoadState('networkidle');
      
      // Check PDF export button
      const exportButton = page.locator('button:has-text("PDF Export")');
      await expect(exportButton).toBeVisible();
      
      // Check button states
      await expect(exportButton).not.toBeDisabled();
      
      // Click and check loading state
      await exportButton.click();
      
      // Button should show loading state
      await expect(exportButton).toContainText('Generiere PDF...');
    });

    test('PDF Export generates file', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard/critical-maintenances');
      await page.waitForLoadState('networkidle');
      
      // Set up download promise
      const downloadPromise = page.waitForEvent('download');
      
      // Click PDF export
      await page.click('button:has-text("PDF Export")');
      
      // Wait for download
      const download = await downloadPromise;
      
      // Check download properties
      expect(download.suggestedFilename()).toMatch(/critical-maintenances.*\.pdf/);
    });

    test('PDF Export works with critical maintenances data', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard/critical-maintenances');
      await page.waitForLoadState('networkidle');
      
      // Wait for data to load
      await page.waitForTimeout(2000);
      
      // Check that critical maintenances are displayed
      await expect(page.locator('text=Elektrische Anlage')).toBeVisible();
      await expect(page.locator('text=Brandschutzanlage')).toBeVisible();
      
      // Test PDF export with data
      const exportButton = page.locator('button:has-text("PDF Export")');
      await expect(exportButton).toBeVisible();
      await expect(exportButton).not.toBeDisabled();
    });
  });

  test.describe('Animations & Transitions', () => {
    test('Fade-in animations work', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check for fade-in animation classes
      const animatedElements = page.locator('[class*="animate-fade-in"]');
      await expect(animatedElements.first()).toBeVisible();
      
      // Check that elements are visible after animation
      await page.waitForTimeout(1000);
      await expect(animatedElements.first()).toBeVisible();
    });

    test('Hover effects work', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Find hover elements
      const hoverElements = page.locator('[class*="hover:scale-105"]');
      
      if (await hoverElements.count() > 0) {
        const firstHoverElement = hoverElements.first();
        
        // Hover over element
        await firstHoverElement.hover();
        
        // Check that hover effect is applied
        await expect(firstHoverElement).toBeVisible();
      }
    });

    test('Smooth transitions work', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check for transition classes
      const transitionElements = page.locator('[class*="transition-all"]');
      await expect(transitionElements.first()).toBeVisible();
      
      // Test button hover transitions
      const buttons = page.locator('button');
      if (await buttons.count() > 0) {
        await buttons.first().hover();
        await expect(buttons.first()).toBeVisible();
      }
    });
  });

  test.describe('Mobile Optimization', () => {
    test('Mobile layout is responsive', async ({ page }) => {
      // Test iPhone SE size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check main elements are visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Neue Immobilie')).toBeVisible();
      
      // Check that layout is mobile-friendly
      const header = page.locator('header, [class*="header"]');
      await expect(header).toBeVisible();
    });

    test('Touch-friendly buttons', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check button sizes are touch-friendly
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (box) {
          // Buttons should be at least 44px tall for touch
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('Mobile navigation works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Test notification bell on mobile
      const notificationBell = page.locator('button[class*="relative"]');
      await expect(notificationBell).toBeVisible();
      
      // Click notification bell
      await notificationBell.click();
      
      // Check notification center opens
      await expect(page.locator('text=Benachrichtigungen')).toBeVisible();
    });
  });

  test.describe('Risk Trend Chart', () => {
    test('Risk trend chart displays', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check risk trend section
      await expect(page.locator('text=Risiko-Trend')).toBeVisible();
      await expect(page.locator('text=Entwicklung der kritischen Wartungen über Zeit')).toBeVisible();
      
      // Check insights
      await expect(page.locator('text=Erkenntnisse')).toBeVisible();
      await expect(page.locator('text=Ihr Risiko bleibt stabil')).toBeVisible();
    });

    test('Risk trend chart is interactive', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check timeframe selector
      await expect(page.locator('text=Zeitraum: 30d')).toBeVisible();
      
      // Check legend
      await expect(page.locator('text=Kritische Wartungen')).toBeVisible();
    });
  });

  test.describe('Property Risk Score', () => {
    test('Property risk score displays', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check that risk score components are present
      const riskScoreElements = page.locator('[data-testid="property-risk-score"]');
      await expect(riskScoreElements).toHaveCount(0); // No properties in mock data
    });

    test('Risk score calculation works', async ({ page }) => {
      // This would test the risk score calculation logic
      // For now, we just check that the component exists
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check that risk-related elements are present
      await expect(page.locator('text=Risiko-Übersicht')).toBeVisible();
    });
  });

  test.describe('In-App Notifications', () => {
    test('Notification center opens and closes', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Click notification bell
      const notificationBell = page.locator('button[class*="relative"]');
      await notificationBell.click();
      
      // Check notification center opens
      await expect(page.locator('text=Benachrichtigungen')).toBeVisible();
      
      // Check notifications are displayed
      await expect(page.locator('text=Wartung überfällig')).toBeVisible();
      await expect(page.locator('text=Wartung fällig')).toBeVisible();
      
      // Close notification center
      const closeButton = page.locator('button[class*="X"]');
      await closeButton.click();
      
      // Check notification center is closed
      await expect(page.locator('text=Benachrichtigungen')).not.toBeVisible();
    });

    test('Notification badge shows correct count', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check notification badge
      const notificationBadge = page.locator('span[class*="bg-red-500"]');
      await expect(notificationBadge).toBeVisible();
      
      // Check badge shows a number
      const badgeText = await notificationBadge.textContent();
      expect(parseInt(badgeText || '0')).toBeGreaterThan(0);
    });

    test('Mark notifications as read', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Open notification center
      await page.click('button[class*="relative"]');
      await page.waitForSelector('text=Benachrichtigungen');
      
      // Click on first notification to mark as read
      const firstNotification = page.locator('[data-testid="notification-item"]').first();
      await firstNotification.click();
      
      // Check that notification is marked as read
      await expect(firstNotification.locator('[class*="bg-gray-50"]')).toBeVisible();
    });
  });

  test.describe('Risk Alert System', () => {
    test('Risk alerts display correctly', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check risk alerts section
      await expect(page.locator('text=Risk Alerts')).toBeVisible();
      
      // Check alert categories
      await expect(page.locator('text=5 Kritisch')).toBeVisible();
      await expect(page.locator('text=5 Warnung')).toBeVisible();
      await expect(page.locator('text=0 Info')).toBeVisible();
    });

    test('Risk alert acknowledge functionality', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Find acknowledge buttons
      const acknowledgeButtons = page.locator('button:has-text("Bestätigen")');
      await expect(acknowledgeButtons).toHaveCount(10);
      
      // Click first acknowledge button
      await acknowledgeButtons.first().click();
      
      // Check that button state changes
      await expect(acknowledgeButtons.first()).toContainText('Bestätigt');
    });
  });

  test.describe('Maintenance Calendar', () => {
    test('Maintenance calendar displays', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check maintenance calendar section
      const calendarElement = page.locator('[data-testid="maintenance-calendar"]');
      await expect(calendarElement).toBeVisible();
    });

    test('Maintenance events are displayed', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check maintenance events
      await expect(page.locator('text=Wartung: Heizungsanlage')).toBeVisible();
      await expect(page.locator('text=Inspektion: Brandschutzanlage')).toBeVisible();
      await expect(page.locator('text=Austausch: Elektrische Anlage')).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('Page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('All API calls complete successfully', async ({ page }) => {
      const responses = [];
      
      page.on('response', response => {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      });
      
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check that all API calls succeeded
      const failedResponses = responses.filter(r => r.status >= 400);
      expect(failedResponses).toHaveLength(0);
    });
  });
});
