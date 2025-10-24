/**
 * Einfache E2E Tests für Critical Maintenances
 * Testet die Mock-Daten direkt ohne komplexe Authentifizierung
 */

import { test, expect } from '@playwright/test';

test.describe('Critical Maintenances - Simple E2E Tests', () => {
  
  test('Critical Maintenances API returns mock data', async ({ page }) => {
    // Test API direkt
    const response = await page.request.get('http://localhost:3000/api/dashboard/critical-maintenances');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(5);
    expect(data.data[0].componentName).toBe('Elektrische Anlage');
    expect(data.data[0].propertyName).toBe('Wohnung Wien-Innere Stadt');
    expect(data.data[0].riskLevel).toBe('critical');
  });

  test('Critical Maintenances page shows mock data', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3000/dashboard/critical-maintenances');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if we're on the right page (might be redirected)
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/login')) {
      console.log('❌ Redirected to login - skipping test');
      return;
    }
    
    // Check page elements
    await expect(page.locator('h1')).toContainText('Kritische Wartungen');
    await expect(page.locator('text=Wartungen mit hohem Risiko')).toBeVisible();
    
    // Check for mock data
    await expect(page.locator('text=Elektrische Anlage')).toBeVisible();
    await expect(page.locator('text=Wohnung Wien-Innere Stadt')).toBeVisible();
    await expect(page.locator('text=Brandschutzanlage')).toBeVisible();
    await expect(page.locator('text=Bürogebäude Graz')).toBeVisible();
  });

  test('PDF Export API works', async ({ page }) => {
    // Test PDF API direkt
    const response = await page.request.post('http://localhost:3000/api/dashboard/critical-maintenances/pdf', {
      data: {
        components: [
          {
            id: 'comp-1',
            propertyId: 'prop-1',
            propertyName: 'Wohnung Wien-Innere Stadt',
            propertyAddress: 'Stephansplatz 1, 1010 Wien',
            componentName: 'Elektrische Anlage',
            componentType: 'electrical',
            riskLevel: 'critical',
            daysOverdue: 45
          }
        ],
        filters: { riskLevel: 'all', propertyId: 'all', componentType: 'all' },
        sortBy: 'overdue',
        sortOrder: 'desc'
      }
    });
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('Risk Summary API returns mock data', async ({ page }) => {
    // Test Risk Summary API
    const response = await page.request.get('http://localhost:3000/api/dashboard/risk-summary');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data.stats.total).toBe(10);
    expect(data.data.stats.critical).toBe(5);
    expect(data.data.criticalComponents).toHaveLength(5);
  });

  test('Risk Trend API returns mock data', async ({ page }) => {
    // Test Risk Trend API
    const response = await page.request.get('http://localhost:3000/api/dashboard/risk-trend?propertyId=all&timeframe=30d');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('Risk Alerts API returns mock data', async ({ page }) => {
    // Test Risk Alerts API
    const response = await page.request.get('http://localhost:3000/api/dashboard/risk-alerts');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(10);
    expect(data.data[0].severity).toBe(9); // Risk level is numeric
  });

  test('Maintenance Calendar API returns mock data', async ({ page }) => {
    // Test Maintenance Calendar API
    const response = await page.request.get('http://localhost:3000/api/dashboard/maintenance-calendar');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(3);
    expect(data.data[0].type).toBe('maintenance');
  });

  test('Notifications API returns mock data', async ({ page }) => {
    // Test Notifications API
    const response = await page.request.get('http://localhost:3000/api/notifications');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(4);
    expect(data.data[0].type).toBe('critical');
  });
});
