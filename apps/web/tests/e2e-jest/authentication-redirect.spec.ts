/**
 * End-to-End Tests für Authentifizierung und automatische Weiterleitung
 * Testet die automatische Weiterleitung zur Login-Seite bei fehlender Authentifizierung
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Redirect E2E Tests', () => {
  
  test('Property creation page redirects to login when not authenticated', async ({ page }) => {
    // Navigate to property creation page without authentication
    await page.goto('http://localhost:3000/properties/new');
    
    // Should redirect to login page
    await page.waitForURL('**/login**');
    
    // Check that we're on the login page
    await expect(page.locator('h1')).toContainText('Anmelden');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    // Navigate to dashboard without authentication
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login page
    await page.waitForURL('**/login**');
    
    // Check that we're on the login page
    await expect(page.locator('h1')).toContainText('Anmelden');
  });

  test('Critical maintenances page redirects to login when not authenticated', async ({ page }) => {
    // Navigate to critical maintenances page without authentication
    await page.goto('http://localhost:3000/dashboard/critical-maintenances');
    
    // Should redirect to login page
    await page.waitForURL('**/login**');
    
    // Check that we're on the login page
    await expect(page.locator('h1')).toContainText('Anmelden');
  });

  test('Property creation form shows no error message when redirected', async ({ page }) => {
    // Navigate to property creation page
    await page.goto('http://localhost:3000/properties/new');
    
    // Wait for redirect
    await page.waitForURL('**/login**');
    
    // Should not show authentication error message
    await expect(page.locator('text=Benutzer nicht authentifiziert')).not.toBeVisible();
    await expect(page.locator('text=Bitte melden Sie sich an')).not.toBeVisible();
  });

  test('Authentication check happens immediately on page load', async ({ page }) => {
    // Start navigation to property creation page
    const navigationPromise = page.goto('http://localhost:3000/properties/new');
    
    // Should redirect to login quickly (within 2 seconds)
    await page.waitForURL('**/login**', { timeout: 2000 });
    
    // Wait for navigation to complete
    await navigationPromise;
    
    // Should be on login page
    await expect(page.locator('h1')).toContainText('Anmelden');
  });

  test('Multiple protected pages redirect correctly', async ({ page }) => {
    const protectedPages = [
      '/dashboard',
      '/properties/new',
      '/dashboard/critical-maintenances',
      '/properties/1',
      '/properties/1/edit'
    ];
    
    for (const pagePath of protectedPages) {
      console.log(`Testing redirect for: ${pagePath}`);
      
      // Navigate to protected page
      await page.goto(`http://localhost:3000${pagePath}`);
      
      // Should redirect to login
      await page.waitForURL('**/login**', { timeout: 3000 });
      
      // Should be on login page
      await expect(page.locator('h1')).toContainText('Anmelden');
    }
  });

  test('Login page is accessible without authentication', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // Should not redirect
    await expect(page.locator('h1')).toContainText('Anmelden');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Home page is accessible without authentication', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000/');
    
    // Should not redirect to login
    await expect(page.locator('h1')).toContainText('ImmoWächter');
  });
});

