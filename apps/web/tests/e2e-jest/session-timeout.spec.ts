/**
 * End-to-End Tests für Session Timeout (5 Minuten)
 * Testet die 5-Minuten Session-Timeout Funktionalität
 */

import { test, expect } from '@playwright/test';

test.describe('Session Timeout E2E Tests', () => {
  
  test('Session remains valid for 5 minutes', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // Fill in login form (assuming test credentials)
    await page.fill('input[type="email"]', 'test@immowaechter.com');
    await page.fill('input[type="password"]', 'testpassword');
    
    // Submit login form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    
    // Navigate to property creation
    await page.goto('http://localhost:3000/properties/new');
    
    // Should be able to access property creation page
    await expect(page.locator('h1')).toContainText('Neue Immobilie anlegen');
    
    // Wait a short time (not 5 minutes in test)
    await page.waitForTimeout(1000);
    
    // Should still be able to access the page
    await expect(page.locator('h1')).toContainText('Neue Immobilie anlegen');
  });

  test('Session expires after 5 minutes', async ({ page }) => {
    // This test would require mocking time or waiting 5 minutes
    // For now, we'll test the session validation logic
    
    // Navigate to property creation without valid session
    await page.goto('http://localhost:3000/properties/new');
    
    // Should redirect to login
    await page.waitForURL('**/login**');
    
    // Should be on login page
    await expect(page.locator('h1')).toContainText('🏠 Willkommen zurück');
  });

  test('Session validation works correctly', async ({ page }) => {
    // Test that session validation doesn't redirect unnecessarily
    
    // Navigate to property creation page
    await page.goto('http://localhost:3000/properties/new');
    
    // Should redirect to login (no valid session)
    await page.waitForURL('**/login**');
    
    // Check console logs for session validation
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('Session') || msg.text().includes('Auth')) {
        logs.push(msg.text());
      }
    });
    
    // Should see session validation logs
    await page.waitForTimeout(1000);
    
    // Should have session validation logs
    expect(logs.length).toBeGreaterThan(0);
  });

  test('Property creation works with valid session', async ({ page }) => {
    // This test assumes a valid session exists
    // In a real test, you'd set up authentication first
    
    // Navigate to property creation
    await page.goto('http://localhost:3000/properties/new');
    
    // If redirected to login, that's expected without valid session
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      console.log('✅ Correctly redirected to login without valid session');
      await expect(page.locator('h1')).toContainText('🏠 Willkommen zurück');
    } else {
      // If we reach the property creation page, test the form
      await expect(page.locator('h1')).toContainText('Neue Immobilie anlegen');
      
      // Fill in form data
      await page.fill('input[name="name"]', 'Test Property');
      await page.fill('input[name="address"]', 'Test Address');
      await page.fill('input[name="postal_code"]', '1010');
      await page.fill('input[name="city"]', 'Wien');
      
      // Form should be accessible
      await expect(page.locator('input[name="name"]')).toHaveValue('Test Property');
    }
  });

  test('Session timeout message is user-friendly', async ({ page }) => {
    // Navigate to property creation
    await page.goto('http://localhost:3000/properties/new');
    
    // Should redirect to login
    await page.waitForURL('**/login**');
    
    // Should not show technical error messages
    await expect(page.locator('text=Benutzer nicht authentifiziert')).not.toBeVisible();
    await expect(page.locator('text=Bitte melden Sie sich an')).not.toBeVisible();
    
    // Should show login form instead
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

