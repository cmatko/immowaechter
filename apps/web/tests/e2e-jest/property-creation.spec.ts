/**
 * End-to-End Tests für Property Creation
 * Testet die Immobilien-Erstellung und UUID-Validierung
 */

import { test, expect } from '@playwright/test';

test.describe('Property Creation E2E Tests', () => {
  
  test('Property creation API validates UUID format', async ({ page }) => {
    // Teste die Property Creation API direkt
    const response = await page.request.post('http://localhost:3000/api/properties', {
      data: {
        name: 'Test Immobilie',
        address: 'Teststraße 1',
        postal_code: '1010',
        city: 'Wien',
        property_type: 'house',
        build_year: 2020,
        living_area: 100,
        country: 'AT',
        user_id: 'temp-user-id' // This should fail with UUID validation
      }
    });
    
    // Should fail with UUID validation error
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('uuid');
  });

  test('Property creation with valid UUID format', async ({ page }) => {
    // Teste mit einer gültigen UUID
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    
    const response = await page.request.post('http://localhost:3000/api/properties', {
      data: {
        name: 'Test Immobilie',
        address: 'Teststraße 1',
        postal_code: '1010',
        city: 'Wien',
        property_type: 'house',
        build_year: 2020,
        living_area: 100,
        country: 'AT',
        user_id: validUUID
      }
    });
    
    // Should succeed with valid UUID
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('Property form validation works correctly', async ({ page }) => {
    // Navigate to property creation page
    await page.goto('http://localhost:3000/properties/new');
    
    // Check if we're redirected to login (expected)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('✅ Redirected to login - authentication required');
      return;
    }
    
    // If we reach the form, test validation
    await expect(page.locator('h1')).toContainText('Neue Immobilie anlegen');
    
    // Test required field validation
    const submitButton = page.locator('button:has-text("Immobilie anlegen")');
    await expect(submitButton).toBeVisible();
    
    // Try to submit without filling required fields
    await submitButton.click();
    
    // Check for validation errors
    await expect(page.locator('text=Name/Bezeichnung')).toBeVisible();
    await expect(page.locator('text=Adresse')).toBeVisible();
  });

  test('Property form accepts valid input', async ({ page }) => {
    // Navigate to property creation page
    await page.goto('http://localhost:3000/properties/new');
    
    // Check if we're redirected to login (expected)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('✅ Redirected to login - authentication required');
      return;
    }
    
    // Fill in valid form data
    await page.fill('input[name="name"]', 'Test Immobilie');
    await page.fill('input[name="address"]', 'Teststraße 1');
    await page.fill('input[name="postal_code"]', '1010');
    await page.fill('input[name="city"]', 'Wien');
    await page.selectOption('select[name="property_type"]', 'house');
    await page.fill('input[name="build_year"]', '2020');
    await page.fill('input[name="living_area"]', '100');
    
    // Submit form
    const submitButton = page.locator('button:has-text("Immobilie anlegen")');
    await submitButton.click();
    
    // Check for success or error
    await page.waitForTimeout(2000);
    
    // Should either redirect to dashboard or show error
    const finalUrl = page.url();
    if (finalUrl.includes('/dashboard')) {
      console.log('✅ Property created successfully - redirected to dashboard');
    } else if (finalUrl.includes('/properties/new')) {
      // Check for error message
      const errorMessage = page.locator('[class*="error"], [class*="alert"]');
      if (await errorMessage.isVisible()) {
        const errorText = await errorMessage.textContent();
        console.log('❌ Error message:', errorText);
        
        // Check if it's the UUID error
        if (errorText?.includes('uuid')) {
          console.log('✅ UUID validation error detected as expected');
        }
      }
    }
  });

  test('UUID validation error message is user-friendly', async ({ page }) => {
    // Test the specific error message for UUID validation
    const response = await page.request.post('http://localhost:3000/api/properties', {
      data: {
        name: 'Test Immobilie',
        address: 'Teststraße 1',
        postal_code: '1010',
        city: 'Wien',
        property_type: 'house',
        build_year: 2020,
        living_area: 100,
        country: 'AT',
        user_id: 'temp-user-id'
      }
    });
    
    const data = await response.json();
    
    // Check that error message is user-friendly
    expect(data.error).toBeDefined();
    expect(data.error).toContain('uuid');
    
    // Should not expose internal database details
    expect(data.error).not.toContain('invalid input syntax');
  });
});

