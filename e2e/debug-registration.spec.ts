import { test, expect, Page } from '@playwright/test';

test.describe('DEBUG: Registration Flow Analysis', () => {
  test('What happens after registration submit?', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@immowaechter.test`;
    const testPassword = 'Test123!@#';

    console.log('\n🚀 Starting registration debug...\n');

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Screenshot BEFORE filling
    await page.screenshot({ 
      path: 'test-results/debug-reg-01-initial.png', 
      fullPage: true 
    });

    console.log('📝 Step 1: Filling form...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);

    // Fill with delays to see what happens
    await page.fill('input#email', testEmail);
    await page.waitForTimeout(300);
    
    await page.fill('input#password', testPassword);
    await page.waitForTimeout(300);

    // Check for confirm password field
    const confirmField = page.locator('input#confirmPassword, input#password_confirm, input#confirm_password');
    const confirmFieldCount = await confirmField.count();
    console.log(`   Confirm password field found: ${confirmFieldCount > 0}`);
    
    if (confirmFieldCount > 0) {
      await confirmField.fill(testPassword);
      await page.waitForTimeout(300);
    }

    // Screenshot AFTER filling
    await page.screenshot({ 
      path: 'test-results/debug-reg-02-filled.png', 
      fullPage: true 
    });

    // Verify fields have values BEFORE submit
    const emailValueBefore = await page.locator('input#email').inputValue();
    const passwordValueBefore = await page.locator('input#password').inputValue();
    console.log('\n📋 Form values BEFORE submit:');
    console.log(`   Email: "${emailValueBefore}"`);
    console.log(`   Password: "${passwordValueBefore}" (length: ${passwordValueBefore.length})`);

    // Check submit button state
    const submitButton = page.locator('button[type="submit"]');
    const isDisabledBefore = await submitButton.isDisabled();
    const buttonText = await submitButton.textContent();
    console.log(`   Submit button: "${buttonText?.trim()}" (disabled: ${isDisabledBefore})`);

    console.log('\n🚀 Step 2: Clicking submit...');
    await submitButton.click();

    // Observe changes over time
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      const emailValueAfter = await page.locator('input#email').inputValue().catch(() => 'N/A');
      const submitDisabled = await submitButton.isDisabled().catch(() => false);
      const submitVisible = await submitButton.isVisible().catch(() => false);
      
      console.log(`\n⏱️  After ${i+1} second(s):`);
      console.log(`   URL: ${currentUrl}`);
      console.log(`   Email field value: "${emailValueAfter}"`);
      console.log(`   Submit button: visible=${submitVisible}, disabled=${submitDisabled}`);
      
      // Check for any visible text content
      const alerts = await page.locator('[role="alert"], .alert, .toast, .notification').allTextContents();
      if (alerts.length > 0) {
        console.log(`   🔔 Alerts found: ${alerts.join(', ')}`);
      }
      
      // Check for success/error keywords in body
      const bodyText = await page.locator('body').textContent();
      const keywords = ['success', 'error', 'fehler', 'erfolgreich', 'check your email', 'verification', 'bestätigung'];
      const foundKeywords = keywords.filter(k => bodyText?.toLowerCase().includes(k.toLowerCase()));
      if (foundKeywords.length > 0) {
        console.log(`   🔍 Keywords found: ${foundKeywords.join(', ')}`);
      }
      
      // Screenshot each second
      await page.screenshot({ 
        path: `test-results/debug-reg-03-after-${i+1}s.png`, 
        fullPage: true 
      });
    }

    console.log('\n📊 Step 3: Analyzing final state...');
    
    // Get all visible text on the page
    const allText = await page.locator('body').textContent();
    console.log('\n📄 Full page text (first 1000 chars):');
    console.log('─'.repeat(80));
    console.log(allText?.substring(0, 1000));
    console.log('─'.repeat(80));
    
    // Check for specific elements
    const checks = {
      'Success message': await page.locator('text=/success|erfolgreich/i').count(),
      'Error message': await page.locator('text=/error|fehler/i').count(),
      'Email verification message': await page.locator('text=/check.*email|verification|bestätigung/i').count(),
      'Dashboard link': await page.locator('a[href="/dashboard"]').count(),
      'Login link': await page.locator('a[href="/login"]').count(),
      'Form still visible': await page.locator('form').count(),
      'Email field': await page.locator('input#email').count(),
    };
    
    console.log('\n🔎 Element presence check:');
    for (const [name, count] of Object.entries(checks)) {
      console.log(`   ${name}: ${count > 0 ? '✅' : '❌'} (${count})`);
    }
    
    // Network requests (if any failed)
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`   ❌ Failed request: ${response.url()} (${response.status()})`);
      }
    });
    
    // Final screenshot
    await page.screenshot({ 
      path: 'test-results/debug-reg-04-final.png', 
      fullPage: true 
    });
    
    console.log('\n✅ Debug complete! Check test-results/ folder for screenshots.\n');
  });

  test('Check registration form structure', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    console.log('\n🔍 Analyzing registration form structure...\n');
    
    // Find all form fields
    const inputs = await page.locator('input').all();
    console.log(`📝 Found ${inputs.length} input fields:`);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      const required = await input.getAttribute('required');
      
      console.log(`\n   Input ${i+1}:`);
      console.log(`      Type: ${type}`);
      console.log(`      Name: ${name}`);
      console.log(`      ID: ${id}`);
      console.log(`      Placeholder: ${placeholder}`);
      console.log(`      Required: ${required !== null}`);
    }
    
    // Find submit button
    const buttons = await page.locator('button').all();
    console.log(`\n🔘 Found ${buttons.length} buttons:`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const type = await button.getAttribute('type');
      const text = await button.textContent();
      const disabled = await button.isDisabled();
      
      console.log(`\n   Button ${i+1}:`);
      console.log(`      Type: ${type}`);
      console.log(`      Text: ${text?.trim()}`);
      console.log(`      Disabled: ${disabled}`);
    }
    
    await page.screenshot({ 
      path: 'test-results/debug-reg-form-structure.png', 
      fullPage: true 
    });
  });
});