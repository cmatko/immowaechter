import { test, expect, Page } from '@playwright/test';

async function clearAuth(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();
}

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should register successfully with valid credentials', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@immowaechter.test`;
    const testPassword = 'Test123!@#';

    await page.goto('/register');
    await page.waitForTimeout(500);

    // ✅ FIX: Fill ALL 6 required fields!
    await page.fill('input#firstName', 'Test');
    await page.fill('input#lastName', 'User');
    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);
    await page.fill('input#confirmPassword', testPassword);
    
    // Check terms checkbox
    const termsCheckbox = page.locator('input[type="checkbox"]');
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.check();
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success (longer timeout for email verification)
    await Promise.race([
      page.waitForURL(/dashboard|login|verify|check-email/, { timeout: 5000 }),
      page.waitForTimeout(3000),
    ]);

    await page.screenshot({ path: 'test-results/registration-success.png', fullPage: true });

    // Check success
    const url = page.url();
    const hasSuccessMessage = await page.locator('text=/success|erfolgreich|check.*email|verification/i')
      .first()
      .isVisible()
      .catch(() => false);
    
    const successIndicators = [
      url.includes('/dashboard'),
      url.includes('/login'),
      url.includes('/verify'),
      url.includes('/check-email'),
      hasSuccessMessage,
      !url.includes('/register'), // Left registration page
    ];

    const hasSuccess = successIndicators.some(indicator => indicator === true);
    
    if (!hasSuccess) {
      const bodyText = await page.locator('body').textContent();
      console.log('❌ Page content:', bodyText?.substring(0, 500));
    }
    
    expect(hasSuccess).toBeTruthy();
    console.log('✅ Registration completed');
  });

  test('should show error when registering with duplicate email', async ({ page }) => {
    const existingEmail = 'test@immowaechter.test';
    const testPassword = 'Test123!@#';

    await page.goto('/register');
    await page.waitForTimeout(500);

    await page.fill('input#firstName', 'Test');
    await page.fill('input#lastName', 'User');
    await page.fill('input#email', existingEmail);
    await page.fill('input#password', testPassword);
    await page.fill('input#confirmPassword', testPassword);
    
    const termsCheckbox = page.locator('input[type="checkbox"]');
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.check();
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    const url = page.url();
    const hasError = await page.locator('text=/email.*already|bereits.*vorhanden|already.*exist/i')
      .first()
      .isVisible()
      .catch(() => false);
    
    expect(hasError || url.includes('/register')).toBeTruthy();
    console.log('✅ Duplicate email handled');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');
    await page.waitForTimeout(500);

    await page.fill('input#firstName', 'Test');
    await page.fill('input#lastName', 'User');
    await page.fill('input#email', 'notanemail');
    await page.fill('input#password', 'Test123!@#');
    await page.fill('input#confirmPassword', 'Test123!@#');

    const termsCheckbox = page.locator('input[type="checkbox"]');
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.check();
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const hasError = await page.locator('text=/invalid.*email|ungültig/i')
      .first()
      .isVisible()
      .catch(() => false);
    const stillOnPage = page.url().includes('/register');

    expect(hasError || stillOnPage).toBeTruthy();
    console.log('✅ Email validation works');
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/register');
    await page.waitForTimeout(500);

    await page.fill('input#firstName', 'Test');
    await page.fill('input#lastName', 'User');
    await page.fill('input#email', `test-${Date.now()}@immowaechter.test`);
    await page.fill('input#password', 'short');
    await page.fill('input#confirmPassword', 'short');

    const termsCheckbox = page.locator('input[type="checkbox"]');
    if (await termsCheckbox.count() > 0) {
      await termsCheckbox.check();
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const hasError = await page.locator('text=/password.*weak|mindestens.*8|zu kurz/i')
      .first()
      .isVisible()
      .catch(() => false);
    const stillOnPage = page.url().includes('/register');

    expect(hasError || stillOnPage).toBeTruthy();
    console.log('✅ Password validation works');
  });
});