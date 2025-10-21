import { Page } from '@playwright/test';

/**
 * Helper functions for authentication in E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

/**
 * Create a unique test user email
 */
export function createTestUser(): TestUser {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return {
    email: `test-${timestamp}-${random}@immowaechter.test`,
    password: 'Test123!@#',
    name: `Test User ${timestamp}`,
  };
}

/**
 * Register a new user via UI
 */
export async function registerUser(page: Page, user: TestUser): Promise<void> {
  await page.goto('/register');
  
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  
  // Handle password confirmation if it exists
  const confirmPasswordField = page.locator('input[name="confirmPassword"], input[name="password_confirm"]');
  if (await confirmPasswordField.count() > 0) {
    await confirmPasswordField.fill(user.password);
  }
  
  // Handle name field if it exists
  if (user.name) {
    const nameField = page.locator('input[name="name"], input[name="full_name"]');
    if (await nameField.count() > 0) {
      await nameField.fill(user.name);
    }
  }
  
  await page.click('button[type="submit"]');
  
  // Wait for success (either redirect or message)
  await page.waitForURL(/\/(dashboard|login)/, { timeout: 10000 }).catch(() => {
    // If no redirect, wait for success message
    return page.waitForSelector('text=/success|account.*created/i', { timeout: 5000 });
  });
}

/**
 * Login via UI
 */
export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

/**
 * Login via API (faster for setup in tests)
 * Requires Supabase client
 */
export async function loginViaAPI(page: Page, email: string, password: string) {
  // This would use Supabase API directly to get a session token
  // Then inject it into the page's localStorage
  
  const authResponse = await page.evaluate(async ({ email, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }, { email, password });
  
  // TODO: Implement based on your auth API structure
  return authResponse;
}

/**
 * Logout via UI
 */
export async function logoutUser(page: Page) {
  // Try to open user menu if it exists
  const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Profile"), .user-menu').first();
  if (await userMenu.count() > 0) {
    await userMenu.click();
    await page.waitForTimeout(500); // Wait for dropdown
  }
  
  // Find logout button
  const logoutButton = page.locator(
    'button:has-text("Logout"), ' +
    'button:has-text("Abmelden"), ' +
    'button:has-text("Sign out"), ' +
    'a:has-text("Logout"), ' +
    'a:has-text("Abmelden")'
  ).first();
  
  await logoutButton.click();
  
  // Wait for redirect
  await page.waitForURL(/\/(login|home|$)/, { timeout: 5000 });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check localStorage for auth token
  const hasAuthToken = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    return keys.some(key => key.includes('supabase') && key.includes('auth'));
  });
  
  if (!hasAuthToken) return false;
  
  // Try to access dashboard
  await page.goto('/dashboard');
  
  // If redirected to login, not authenticated
  const currentUrl = page.url();
  return !currentUrl.includes('/login');
}

/**
 * Clear all auth data
 */
export async function clearAuthData(page: Page) {
  await page.evaluate(() => {
    // Clear localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
  });
  
  // Clear cookies
  await page.context().clearCookies();
}

/**
 * Wait for auth state to be ready
 */
export async function waitForAuthReady(page: Page) {
  await page.waitForFunction(() => {
    // Wait for Supabase client to initialize
    return window.localStorage.getItem('supabase.auth.token') !== null;
  }, { timeout: 5000 });
}

/**
 * Get current user from session
 */
export async function getCurrentUser(page: Page) {
  return page.evaluate(() => {
    const authData = localStorage.getItem('supabase.auth.token');
    if (!authData) return null;
    
    try {
      const parsed = JSON.parse(authData);
      return parsed.currentSession?.user || null;
    } catch {
      return null;
    }
  });
}

/**
 * Create and login a test user in one step
 */
export async function setupAuthenticatedUser(page: Page): Promise<TestUser> {
  const user = createTestUser();
  await registerUser(page, user);
  
  // If registration doesn't auto-login, login manually
  const isLoggedIn = await isAuthenticated(page);
  if (!isLoggedIn) {
    await loginUser(page, user.email, user.password);
  }
  
  return user;
}

/**
 * Cleanup test user from database
 * Requires service role key
 */
export async function cleanupTestUser(email: string) {
  // This should be implemented using your cleanup helper
  // For now, we'll leave it as a placeholder
  
  // TODO: Implement with Supabase Admin API
  console.log(`Cleanup needed for: ${email}`);
}