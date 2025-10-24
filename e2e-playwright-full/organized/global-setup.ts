import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup - runs once before all tests
 * Creates a test user that all tests can use
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Global Setup: Creating test user...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test user credentials
  const TEST_USER = {
    email: 'test@immowaechter.test',
    password: 'Test123!@#',
  };
  
  try {
    // Try to register the user
    await page.goto('http://localhost:3000/register');
    
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    
    // Handle password confirmation if exists
    const confirmField = page.locator('input[name="confirmPassword"], input[name="password_confirm"]');
    if (await confirmField.count() > 0) {
      await confirmField.fill(TEST_USER.password);
    }
    
    await page.click('button[type="submit"]');
    
    // Wait a bit for registration to complete
    await page.waitForTimeout(2000);
    
    console.log('✅ Test user created:', TEST_USER.email);
  } catch (error) {
    // User might already exist, that's okay
    console.log('ℹ️ Test user might already exist (this is okay)');
  }
  
  await browser.close();
  
  // Store credentials in process.env for tests to use
  process.env.TEST_USER_EMAIL = TEST_USER.email;
  process.env.TEST_USER_PASSWORD = TEST_USER.password;
  
  console.log('✅ Global Setup Complete');
}

export default globalSetup;